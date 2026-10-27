import type { Alert, ExitPermit, TxState, VisitState } from "./types";

type Table<S extends string> = Record<S, S[]>;

export const VISIT_TRANSITIONS: Table<VisitState> = {
  EXPECTED: ["ARRIVED", "CANCELLED"],
  ARRIVED: ["IDENTIFIED", "HOLD", "REJECTED", "CANCELLED"],
  IDENTIFIED: ["IN_SITE", "HOLD", "REJECTED"],
  IN_SITE: ["ON_SCALE_1", "ON_SCALE_2", "READY_TO_EXIT", "HOLD"],
  ON_SCALE_1: ["LOADING", "IN_SITE", "HOLD"],
  LOADING: ["ON_SCALE_2", "HOLD"],
  ON_SCALE_2: ["READY_TO_EXIT", "LOADING", "HOLD"],
  READY_TO_EXIT: ["EXITED", "HOLD"],
  HOLD: ["ARRIVED", "IDENTIFIED", "IN_SITE", "ON_SCALE_1", "LOADING", "ON_SCALE_2", "READY_TO_EXIT", "REJECTED", "CANCELLED"],
  EXITED: [],
  REJECTED: [],
  CANCELLED: [],
};

export const TX_TRANSITIONS: Table<TxState> = {
  DRAFT: ["FIRST_CAPTURED", "VOIDED", "EXCEPTION"],
  FIRST_CAPTURED: ["SECOND_CAPTURED", "EXCEPTION", "VOIDED"],
  SECOND_CAPTURED: ["RECONCILED", "EXCEPTION", "VOIDED"],
  RECONCILED: ["APPROVED", "EXCEPTION", "VOIDED"],
  APPROVED: ["VOIDED"],
  EXCEPTION: ["FIRST_CAPTURED", "SECOND_CAPTURED", "RECONCILED", "APPROVED", "VOIDED"],
  VOIDED: [],
};

export const EXIT_PERMIT_TRANSITIONS: Table<ExitPermit["status"]> = {
  DRAFT: ["APPROVED", "CANCELLED"],
  APPROVED: ["CONSUMED", "CANCELLED"],
  CONSUMED: [],
  CANCELLED: [],
};

export const ALERT_TRANSITIONS: Table<Alert["status"]> = {
  OPEN: ["ACK", "INVESTIGATING", "RESOLVED", "DISMISSED"],
  ACK: ["INVESTIGATING", "RESOLVED", "DISMISSED"],
  INVESTIGATING: ["RESOLVED", "DISMISSED"],
  RESOLVED: [],
  DISMISSED: [],
};

export class TransitionError extends Error {
  constructor(public from: string, public to: string) {
    super(`Illegal transition ${from} → ${to}`);
  }
}

export function canTransition<S extends string>(table: Table<S>, from: S, to: S): boolean {
  return table[from]?.includes(to) ?? false;
}

export function assertTransition<S extends string>(table: Table<S>, from: S, to: S): void {
  if (!canTransition(table, from, to)) throw new TransitionError(from, to);
}

export const VISIT_STEPS: VisitState[] = ["ARRIVED", "IDENTIFIED", "IN_SITE", "ON_SCALE_1", "LOADING", "ON_SCALE_2", "READY_TO_EXIT", "EXITED"];

export function visitProgress(state: VisitState, prevState?: VisitState): number {
  const s = state === "HOLD" && prevState ? prevState : state;
  const i = VISIT_STEPS.indexOf(s);
  return i < 0 ? 0 : i;
}
