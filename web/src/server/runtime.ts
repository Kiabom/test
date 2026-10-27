import "server-only";
import { buildSeed } from "./seed";
import { startSimulation } from "./sim";
import { globalRef, type DB } from "./store";

/** Returns the in-memory database, seeding it and starting the simulator on first use. */
export function getDb(): DB {
  if (!globalRef.__tozinDb) globalRef.__tozinDb = buildSeed();
  if (!globalRef.__tozinSimTimer) globalRef.__tozinSimTimer = startSimulation(() => globalRef.__tozinDb!);
  return globalRef.__tozinDb;
}

export function resetDb(): DB {
  globalRef.__tozinDb = buildSeed();
  return globalRef.__tozinDb;
}
