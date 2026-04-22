// FeedForwardClub submission API.
// Single file. Accepts JSON POSTs from the /apply and /contact forms,
// appends them to JSONL files on disk.
//
// Env:
//   PORT                  default 3000
//   ALLOWED_ORIGINS       comma-separated list, default "*"
//   DATA_DIR              default "./data"
//
// Endpoints:
//   GET  /health          -> { ok: true }
//   POST /apply           -> { ok: true } or 4xx
//   POST /contact         -> { ok: true } or 4xx

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { z } from "zod";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

const PORT = Number(process.env.PORT ?? 3000);
const DATA_DIR = process.env.DATA_DIR ?? "./data";
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "*")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

await mkdir(DATA_DIR, { recursive: true });

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: (origin) => {
      if (ALLOWED_ORIGINS.includes("*") || !origin) return origin ?? "*";
      return ALLOWED_ORIGINS.includes(origin) ? origin : "";
    },
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    maxAge: 600,
  }),
);

// — schemas -----------------------------------------------------------------

const str = (max = 5000) => z.string().trim().min(1).max(max);
const optStr = (max = 5000) => z.string().trim().max(max).optional().or(z.literal(""));

const applySchema = z.object({
  type: z.literal("apply"),
  name: str(200),
  email: z.string().trim().email().max(200),
  city: str(200),
  obsession: str(3000),
  hot_seat: str(3000),
  links: optStr(500),
  referrer: optStr(200),
  _hp: z.string().optional(), // honeypot
});

const contactSchema = z.object({
  type: z.literal("contact"),
  name: str(200),
  email: z.string().trim().email().max(200),
  subject: optStr(200),
  message: str(5000),
  _hp: z.string().optional(),
});

// — helpers -----------------------------------------------------------------

const nowIso = () => new Date().toISOString();

async function persist(kind, record) {
  const file = path.join(DATA_DIR, `${kind}.jsonl`);
  await appendFile(file, JSON.stringify(record) + "\n", "utf8");
}

function clientIp(c) {
  const fwd = c.req.header("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return c.req.header("x-real-ip") ?? "";
}

// — routes ------------------------------------------------------------------

app.get("/health", (c) => c.json({ ok: true, at: nowIso() }));

app.get("/", (c) =>
  c.json({
    service: "feedforwardclub-server",
    endpoints: ["/health", "/apply (POST)", "/contact (POST)"],
  }),
);

app.post("/apply", async (c) => {
  const raw = await c.req.json().catch(() => null);
  if (!raw) return c.json({ ok: false, error: "invalid_json" }, 400);

  const parsed = applySchema.safeParse(raw);
  if (!parsed.success) {
    return c.json(
      { ok: false, error: "validation", issues: parsed.error.issues },
      400,
    );
  }
  const data = parsed.data;

  // Honeypot — pretend success, do not persist.
  if (data._hp && data._hp.length > 0) {
    return c.json({ ok: true });
  }

  const { _hp: _ignore, ...clean } = data;
  await persist("apply", {
    ...clean,
    _receivedAt: nowIso(),
    _ip: clientIp(c),
    _ua: c.req.header("user-agent") ?? "",
  });

  return c.json({ ok: true });
});

app.post("/contact", async (c) => {
  const raw = await c.req.json().catch(() => null);
  if (!raw) return c.json({ ok: false, error: "invalid_json" }, 400);

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return c.json(
      { ok: false, error: "validation", issues: parsed.error.issues },
      400,
    );
  }
  const data = parsed.data;

  if (data._hp && data._hp.length > 0) {
    return c.json({ ok: true });
  }

  const { _hp: _ignore, ...clean } = data;
  await persist("contact", {
    ...clean,
    _receivedAt: nowIso(),
    _ip: clientIp(c),
    _ua: c.req.header("user-agent") ?? "",
  });

  return c.json({ ok: true });
});

app.notFound((c) => c.json({ ok: false, error: "not_found" }, 404));
app.onError((err, c) => {
  console.error("[ffc-server]", err);
  return c.json({ ok: false, error: "internal" }, 500);
});

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(
    `[ffc-server] listening on http://localhost:${info.port}  data → ${path.resolve(DATA_DIR)}  origins=${ALLOWED_ORIGINS.join(", ") || "*"}`,
  );
});
