import "server-only";
import { resetClock } from "@/domain/clock";
import { buildSeed } from "./seed";
import { stageShowcase } from "./showcase";
import { startSimulation } from "./sim";
import { globalRef, type DB } from "./store";

function freshDb(): DB {
  resetClock();
  const d = buildSeed();
  stageShowcase(d);
  return d;
}

/** Returns the in-memory database — seeded and staged as the presentation scene on first use. */
export function getDb(): DB {
  if (!globalRef.__tozinDb) globalRef.__tozinDb = freshDb();
  if (!globalRef.__tozinSimTimer) globalRef.__tozinSimTimer = startSimulation(() => globalRef.__tozinDb!);
  return globalRef.__tozinDb;
}

/** Back to the staged presentation scene. */
export function resetDb(): DB {
  globalRef.__tozinDb = freshDb();
  return globalRef.__tozinDb;
}
