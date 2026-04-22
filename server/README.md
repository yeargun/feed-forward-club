# feedforwardclub-server

Tiny Node.js API for the `/apply` and `/contact` forms. Hono + Zod, single file.

## Quick start

```bash
cd server
cp .env.example .env
npm install
npm run dev    # watches src/index.mjs on http://localhost:3000
```

Then in the site `.env` (one level up):

```
PUBLIC_APPLY_ENDPOINT=http://localhost:3000/apply
PUBLIC_CONTACT_ENDPOINT=http://localhost:3000/contact
```

## Endpoints

| Method | Path       | Purpose                            |
| -----: | ---------- | ---------------------------------- |
|    GET | `/health`  | `{ ok: true, at: "<iso>" }`        |
|   POST | `/apply`   | Accepts the apply form JSON        |
|   POST | `/contact` | Accepts the contact form JSON      |

Both POST endpoints:

- require `Content-Type: application/json`,
- run Zod validation and return `400` on failure,
- silently drop records where the `_hp` honeypot field is non-empty,
- append the cleaned payload to `data/<kind>.jsonl` with `_receivedAt`, `_ip`, `_ua`.

## Data

Submissions live in `data/apply.jsonl` and `data/contact.jsonl`. Gitignored by default.

Tail them with:

```bash
tail -f data/apply.jsonl
```

## Env

| Var                | Default                                         |
| ------------------ | ----------------------------------------------- |
| `PORT`             | `3000`                                          |
| `DATA_DIR`         | `./data`                                        |
| `ALLOWED_ORIGINS`  | `*` (comma-separated list in production)        |

## Deploy

Any Node 20+ host. `npm start` runs `node src/index.mjs` — no build step.
Point a process manager (pm2, systemd, fly.io, render, etc.) at it.
