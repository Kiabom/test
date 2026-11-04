// Presentation scene: a fixed, fully consistent snapshot with an example at every station.
// Built by driving the real gate/scale/exit logic (so tickets, evidence, alerts and audit all
// line up), then every lane is parked at a point that waits for a person.
import type * as T from "@/domain/types";
import { consumeExitPermit, finalizeTx, findTx, gateDecide, lane } from "./ops";
import { seedSimRandom } from "./rng";
import { completeLoading, fakeWeigh, initLive, laneTargets, processGateIn, processGateOut, processScale, resetSimState, simState, spawnArrival } from "./sim";
import { bump, log, type DB, type ShowcaseRefs } from "./store";

const SCENE_SEED = 20261104;
const far = () => Date.now() + 365 * 864e5;
const ago = (min: number) => new Date(Date.now() - min * 60_000).toISOString();

function arrive(d: DB, scenario?: string): T.Visit {
  const v = spawnArrival(d, scenario, true);
  if (!v) throw new Error(`showcase: no vehicle available for ${scenario ?? "normal"} arrival`);
  return v;
}

/** Runs the entry gate until the truck is admitted or held. `park` keeps a held truck on lane A. */
function throughGate(d: DB, v: T.Visit, park = false) {
  d.live.queueGateIn = [v.id, ...d.live.queueGateIn.filter((x) => x !== v.id)];
  const l = lane(d, "A");
  for (let i = 0; i < 12; i++) {
    processGateIn(d, Date.now());
    if (park && l.visitId === v.id && l.phase === "HELD") {
      l.phaseUntil = far();
      return;
    }
    if (!l.visitId && !d.live.queueGateIn.includes(v.id)) return;
    l.phaseUntil = 0;
  }
  throw new Error(`showcase: gate did not settle for ${v.id}`);
}

function firstWeigh(d: DB, v: T.Visit, loader: string) {
  d.live.queueB = d.live.queueB.filter((x) => x !== v.id);
  fakeWeigh(d, v, "B", simState.get(v.id)!.targetFirstKg);
  v.loadingEquipmentId = loader;
  simState.get(v.id)!.loadingUntil = far();
}

function loadAndScan(d: DB, v: T.Visit) {
  completeLoading(d, v);
}

function secondWeigh(d: DB, v: T.Visit) {
  d.live.queueC = d.live.queueC.filter((x) => x !== v.id);
  d.live.queueB = d.live.queueB.filter((x) => x !== v.id);
  fakeWeigh(d, v, "C", simState.get(v.id)!.targetSecondKg);
  return v.transactionIds.map((id) => findTx(d, id)!).at(-1)!;
}

function fullTrip(d: DB, scenario: string | undefined, loader: string) {
  const v = arrive(d, scenario);
  throughGate(d, v);
  firstWeigh(d, v, loader);
  loadAndScan(d, v);
  const tx = secondWeigh(d, v);
  if (tx.state === "RECONCILED") finalizeTx(d, tx.id, "U-OP2");
  return { v, tx };
}

/** Exit gate: guard scans the QR, then the barrier cycle runs until the truck has left. */
function exitThrough(d: DB, v: T.Visit) {
  const ep = d.exitPermits.find((e) => e.id === v.exitPermitId)!;
  consumeExitPermit(d, ep.token, "U-GD1");
  const l = lane(d, "E");
  for (let i = 0; i < 12 && v.state !== "EXITED"; i++) {
    l.phaseUntil = 0;
    processGateOut(d, Date.now());
  }
  return ep;
}

/** Calls the first truck of a queue onto a scale and settles it until the weight is stable. */
function parkOnScale(d: DB, code: "B" | "C", v: T.Visit) {
  const q = code === "B" ? d.live.queueB : d.live.queueC;
  const rest = q.filter((x) => x !== v.id);
  q.length = 0;
  q.push(v.id, ...rest);
  const l = lane(d, code);
  for (let i = 0; i < 12; i++) {
    processScale(d, code, Date.now());
    if (l.visitId === v.id && l.phase === "STABLE") {
      l.phaseUntil = far();
      processScale(d, code, Date.now()); // one reading at the settled weight
      return;
    }
    l.phaseUntil = 0;
  }
  throw new Error(`showcase: scale ${code} did not settle`);
}

function backdate(v: T.Visit, arrivedMin: number, enteredMin = arrivedMin - 2) {
  v.arrivedAt = ago(arrivedMin);
  v.enteredAt = ago(Math.max(0, enteredMin));
  v.queueJoinedAt = ago(Math.max(0, enteredMin - 1));
}

/** Builds the presentation scene on top of a fresh seed. Deterministic for the same seed day. */
export function stageShowcase(d: DB): ShowcaseRefs {
  seedSimRandom(SCENE_SEED);
  resetSimState();
  try {
    d.live.scene = "PRESENTATION";
    d.live.mode = "MANUAL";
    d.live.speed = 1;
    initLive(d, false);
    const refs: ShowcaseRefs = { builtAt: new Date().toISOString(), loading: [], queued: [], exited: [], driverTokens: {} };

    // 1. trucks that left a few minutes ago (they are on the road on the map)
    for (const [i, min] of [12, 26, 41].entries()) {
      const { v, tx } = fullTrip(d, undefined, ["EQ-L1", "EQ-L2", "EQ-S1"][i]);
      exitThrough(d, v);
      backdate(v, min + 70, min + 66);
      v.exitedAt = ago(min);
      refs.exited.push(v.id);
      if (i === 0) {
        refs.recentTx = tx.id;
        refs.recentVerify = tx.verifyCode;
      }
    }
    // one of them: the guard scanned the used QR again → security alert R36
    const reuse = d.visits.find((x) => x.id === refs.exited[1])!;
    consumeExitPermit(d, d.exitPermits.find((e) => e.id === reuse.exitPermitId)!.token, "U-GD2");
    refs.qrReuseVisit = reuse.id;

    // 2. expired permit — rejected at the gate
    const rej = arrive(d, "S-PERMIT-EXP");
    throughGate(d, rej);
    if (rej.state === "HOLD") gateDecide(d, rej.id, false, "U-GD1", "حواله منقضی — بازگشت به فروش");
    backdate(rej, 22, 22);
    refs.rejected = rej.id;

    // 3. under-vehicle scan suspect, now loading at the shovel
    const uv = arrive(d, "S-UVSS");
    throughGate(d, uv);
    firstWeigh(d, uv, "EQ-S1");
    backdate(uv, 34);
    refs.uvssVisit = uv.id;
    refs.uvssScan = uv.uvssScanId;
    refs.loading.push(uv.id);

    // 4. two more trucks mid-load at the loaders
    for (const [i, eq] of ["EQ-L1", "EQ-L2"].entries()) {
      const v = arrive(d);
      throughGate(d, v);
      firstWeigh(d, v, eq);
      backdate(v, 28 - i * 6);
      refs.loading.push(v.id);
    }

    // 5. quota overdraw — second weighing above the permit balance, waiting for a two-signature override
    const od = arrive(d, "S-OVERDRAW");
    throughGate(d, od);
    firstWeigh(d, od, "EQ-L2");
    loadAndScan(d, od);
    const odTx = secondWeigh(d, od);
    backdate(od, 52);
    refs.overdrawVisit = od.id;
    refs.overdrawTx = odTx.id;

    // 6. two loaded trucks waiting for scale 2 (the second one is under the LiDAR gantry)
    const qc: T.Visit[] = [];
    for (let i = 0; i < 2; i++) {
      const v = arrive(d);
      throughGate(d, v);
      firstWeigh(d, v, i ? "EQ-L1" : "EQ-S1");
      loadAndScan(d, v);
      backdate(v, 44 - i * 5);
      qc.push(v);
    }

    // 7. overweight truck on scale 2, stable and ready to capture (capturing raises R14)
    const ow = arrive(d, "S-OVERWEIGHT");
    throughGate(d, ow);
    firstWeigh(d, ow, "EQ-S1");
    loadAndScan(d, ow);
    backdate(ow, 48);
    parkOnScale(d, "C", ow);
    refs.laneC = ow.id;
    refs.lidarScan = d.lidarScans.filter((l) => l.visitId === ow.id).at(-1)?.id;

    // 8. ticket approved, truck at the exit barrier waiting for the guard to scan the QR
    const ex = fullTrip(d, undefined, "EQ-L1").v;
    backdate(ex, 63);
    const lE = lane(d, "E");
    for (let i = 0; i < 6 && lE.phase !== "AWAIT_QR"; i++) {
      processGateOut(d, Date.now());
      lE.phaseUntil = 0;
    }
    const exEp = d.exitPermits.find((e) => e.id === ex.exitPermitId)!;
    refs.laneE = ex.id;
    refs.exitPermitToken = exEp.token;
    refs.exitPermitSerial = exEp.serial;

    // 9. truck on scale 1, stable and ready to capture
    const b = arrive(d);
    throughGate(d, b);
    backdate(b, 17);
    parkOnScale(d, "B", b);
    refs.laneB = b.id;

    // 10. three trucks waiting in the parking (one inbound purchase delivery)
    for (const [i, sc] of [undefined, "S-INBOUND", undefined].entries()) {
      const v = arrive(d, sc);
      throughGate(d, v);
      backdate(v, 14 - i * 4);
      refs.queued.push(v.id);
      if (sc) refs.inbound = v.id;
    }

    // 11. dirty plate — low ANPR confidence, waiting for the guard in the inspection bay
    const lc = arrive(d, "S-LOWCONF");
    throughGate(d, lc);
    backdate(lc, 7, 7);
    refs.lowConf = lc.id;

    // 12. plate/RFID mismatch — held on the entry lane with the full decision trace
    const mm = arrive(d, "S-MISMATCH");
    throughGate(d, mm, true);
    backdate(mm, 3, 3);
    refs.gateHold = mm.id;

    // lane D shows the last loaded truck under the gantry
    const dl = lane(d, "D");
    dl.visitId = qc[1].id;
    dl.phase = "SCANNING";
    dl.phaseUntil = far();

    // one camera with a dusty lens, so the health screens have something to show
    const cam = d.devices.find((x) => x.type === "CAMERA_SIDE" && x.laneId === "L-C") ?? d.devices.find((x) => x.type === "CAMERA_OVERVIEW");
    if (cam) cam.status = "DEGRADED";

    const token = (id?: string) => d.visits.find((x) => x.id === id)?.driverToken;
    const tk: Record<string, string | undefined> = {
      gate: token(refs.gateHold),
      queue: token(refs.queued[0]),
      scale1: token(refs.laneB),
      loading: token(refs.loading[1]),
      scale2: token(refs.laneC),
      exit: token(refs.laneE),
      exited: token(refs.exited[0]),
      hold: token(refs.overdrawVisit),
    };
    refs.driverTokens = Object.fromEntries(Object.entries(tk).filter(([, x]) => !!x)) as Record<string, string>;
    // keep stored targets in sync with what the lanes show
    for (const code of ["B", "C"] as const) if (!lane(d, code).visitId) laneTargets.delete(code);

    d.live.showcase = refs;
    log(d, "info", "SIM", "Presentation scene ready — nothing moves until someone acts");
    bump(d);
    return refs;
  } finally {
    seedSimRandom();
  }
}
