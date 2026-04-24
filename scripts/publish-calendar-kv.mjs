import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = join(root, "src/data/calendar.json");

const r = spawnSync(
  "npx",
  ["wrangler", "kv", "key", "put", "data", "--binding=CALENDAR", "--path", file],
  { stdio: "inherit", cwd: root, shell: process.platform === "win32" },
);
process.exit(r.status ?? 1);
