import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { DB } from "./store";

/**
 * Master-data edits (create / update / RFID assignment) are kept in web/data/master-overrides.json
 * and re-applied after the locked seed is built, so they survive restarts and resets while the
 * transaction history stays identical. Delete the file to return to the original seed.
 */
type Op = { kind: "create" | "update"; col: string; id: string; data: Record<string, unknown> };
const FILE = path.join(process.cwd(), "data", "master-overrides.json");

function read(): Op[] {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8")) as Op[];
  } catch {
    return [];
  }
}

export function recordOverride(op: Op) {
  if (process.env.VITEST) return;
  try {
    const ops = read();
    ops.push(op);
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(ops, null, 1));
  } catch (e) {
    console.error("[overrides] could not save", e);
  }
}

export function applyOverrides(d: DB, ops: Op[] = read()) {
  for (const op of ops) {
    const list = (d as unknown as Record<string, { id: string }[]>)[op.col];
    if (!Array.isArray(list)) continue;
    const item = list.find((x) => x.id === op.id);
    if (op.kind === "create" && !item) list.push({ ...(op.data as object), id: op.id } as { id: string });
    else if (item) Object.assign(item, op.data);
  }
}
