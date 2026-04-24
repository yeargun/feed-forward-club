import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const from = join(root, "src/data/calendar.json");
const to = join(root, "public/calendar.json");
const toDir = dirname(to);
if (!existsSync(toDir)) mkdirSync(toDir, { recursive: true });
copyFileSync(from, to);
