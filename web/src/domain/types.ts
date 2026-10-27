// Domain model — see docs/prompts/spec/DATA_MODEL.md
export type ID = string;
export type ISO = string;

export interface Plate {
  d2: string;
  letter: string;
  d3: string;
  region: string;
}

export interface Site {
  id: ID;
  code: string;
  name: string;
  nameEn: string;
  timezone: string;
  branch: string;
}

export type LaneKind = "GATE_IN" | "SCALE" | "GATE_OUT" | "SCAN";
export interface Lane {
  id: ID;
  siteId: ID;
  code: "A" | "B" | "C" | "D" | "E";
  name: string;
  nameEn: string;
  kind: LaneKind;
  scaleId?: ID;
}

export type ScaleStatus = "READY" | "BUSY" | "HOLD" | "LOCKED" | "OFFLINE";
export interface Scale {
  id: ID;
  siteId: ID;
  laneId: ID;
  name: string;
  nameEn: string;
  capacityKg: number;
  divisionKg: number;
  lengthM: number;
  loadCells: number;
  indicatorModel: string;
  legalForTrade: boolean;
  diagnosticsSupported: boolean;
  status: ScaleStatus;
  calibrationId?: ID;
}

export type DeviceType =
  | "INDICATOR"
  | "CAMERA_ANPR"
  | "CAMERA_OVERVIEW"
  | "CAMERA_TOP"
  | "CAMERA_SIDE"
  | "CAMERA_LICENSE"
  | "UVSS"
  | "LIDAR"
  | "RFID_READER"
  | "PLC"
  | "BARRIER"
  | "TRAFFIC_LIGHT"
  | "POSITION_SENSOR"
  | "LED_DISPLAY"
  | "QUEUE_BOARD"
  | "KIOSK"
  | "PRINTER"
  | "EDGE_GATEWAY"
  | "INTERCOM"
  | "SIREN"
  | "JUNCTION_BOX";

export type DeviceStatus = "ONLINE" | "DEGRADED" | "OFFLINE";
export interface Device {
  id: ID;
  siteId: ID;
  laneId?: ID;
  type: DeviceType;
  name: string;
  model: string;
  protocol: string;
  ip: string;
  firmware: string;
  status: DeviceStatus;
  lastHeartbeatAt: ISO;
  position?: "FRONT" | "REAR" | "TOP" | "SIDE" | "UNDER" | "OVERVIEW";
}

export type VehicleType = "TRAILER" | "TIPPER" | "HAUL_TRUCK";
export interface Vehicle {
  id: ID;
  plate: Plate;
  plateNormalized: string;
  rfidEpc?: string;
  type: VehicleType;
  axles: number;
  ratedPayloadKg: number;
  maxGvwKg: number;
  storedTareKg?: number;
  tareValidUntil?: ISO;
  carrierId: ID;
  trailerPlate?: string;
  insuranceUntil: ISO;
  inspectionUntil: ISO;
  status: "ACTIVE" | "BLOCKED" | "GUEST";
  internal: boolean;
  color: string;
}

export interface Driver {
  id: ID;
  name: string;
  nameEn: string;
  nationalIdMasked: string;
  licenseNo: string;
  licenseUntil: ISO;
  phone: string;
  carrierId: ID;
  status: "ACTIVE" | "BLOCKED";
}

export interface Carrier {
  id: ID;
  name: string;
  nameEn: string;
  regNo: string;
  phone: string;
  status: "ACTIVE" | "SUSPENDED";
}

export interface Customer {
  id: ID;
  name: string;
  nameEn: string;
  type: "CUSTOMER" | "SUPPLIER" | "BOTH";
  erpCode: string;
  city: string;
  creditLimit: number;
}

export interface Material {
  id: ID;
  code: string;
  name: string;
  nameEn: string;
  grade: string;
  densityKgM3: number;
  pricePerTon: number;
  color: string;
  requiresQc: boolean;
  internalOnly: boolean;
}

export interface Location {
  id: ID;
  name: string;
  nameEn: string;
  type: "PIT" | "STOCKPILE" | "CRUSHER" | "PLANT" | "EXTERNAL" | "DUMP";
}

export interface Shift {
  id: ID;
  siteId: ID;
  code: "A" | "B" | "C";
  name: string;
  nameEn: string;
  startHour: number;
  endHour: number;
  targetTons: number;
}

export type RoleCode =
  | "system_admin"
  | "site_manager"
  | "scale_operator"
  | "gate_guard"
  | "logistics"
  | "sales"
  | "qc"
  | "maintenance"
  | "auditor"
  | "fleet_manager"
  | "finance"
  | "driver";

export interface User {
  id: ID;
  name: string;
  nameEn: string;
  role: RoleCode;
}

export interface Equipment {
  id: ID;
  code: string;
  type: "LOADER" | "SHOVEL" | "EXCAVATOR";
  name: string;
  nameEn: string;
  status: "WORKING" | "IDLE" | "DOWN";
  ratedBucketKg: number;
}

export interface Contract {
  id: ID;
  no: string;
  customerId: ID;
  materialId: ID;
  totalKg: number;
  deliveredKg: number;
  validFrom: ISO;
  validTo: ISO;
  pricePerTon: number;
}

export type PermitType = "SALE" | "HAUL" | "PURCHASE" | "TRANSFER";
export type PermitStatus = "ISSUED" | "ACTIVE" | "SUSPENDED" | "EXPIRED" | "REVOKED" | "CONSUMED";
export interface Permit {
  id: ID;
  permitNo: string;
  type: PermitType;
  customerId: ID;
  materialId: ID;
  contractId?: ID;
  originId: ID;
  destinationId: ID;
  allowedKg: number;
  reservedKg: number;
  consumedKg: number;
  maxTrips?: number;
  tripsUsed: number;
  allowedVehicleIds: ID[];
  carrierId?: ID;
  validFrom: ISO;
  validTo: ISO;
  status: PermitStatus;
  issuer: string;
  documentHash: string;
}

export interface PermitLedgerEntry {
  id: ID;
  permitId: ID;
  transactionId: ID;
  kind: "RESERVE" | "COMMIT" | "RELEASE";
  kg: number;
  at: ISO;
  by: ID;
}

export interface Booking {
  id: ID;
  permitId: ID;
  vehicleId: ID;
  driverId: ID;
  slotStart: ISO;
  slotEnd: ISO;
  status: "BOOKED" | "ARRIVED" | "MISSED" | "CANCELLED";
}

export type VisitState =
  | "EXPECTED"
  | "ARRIVED"
  | "IDENTIFIED"
  | "IN_SITE"
  | "ON_SCALE_1"
  | "LOADING"
  | "ON_SCALE_2"
  | "READY_TO_EXIT"
  | "EXITED"
  | "HOLD"
  | "REJECTED"
  | "CANCELLED";

export type IdentityMatch = "MATCH" | "MISMATCH" | "PLATE_ONLY" | "RFID_ONLY" | "UNKNOWN";

export interface Visit {
  id: ID;
  siteId: ID;
  vehicleId: ID;
  driverId: ID;
  permitId?: ID;
  bookingId?: ID;
  state: VisitState;
  prevState?: VisitState;
  arrivedAt: ISO;
  enteredAt?: ISO;
  exitedAt?: ISO;
  queueNo: number;
  queueJoinedAt?: ISO;
  calledAt?: ISO;
  laneCode?: Lane["code"];
  driverToken: string;
  identity: {
    anpr?: { plate: string; confidence: number; readId: ID };
    anprRear?: { plate: string; confidence: number; readId: ID };
    rfid?: { epc: string; rssi: number; readId: ID };
    match: IdentityMatch;
  };
  transactionIds: ID[];
  exitPermitId?: ID;
  shiftCode: Shift["code"];
  internal: boolean;
  operation: Operation;
  holdReasons: string[];
  scenario?: string;
  uvssScanId?: ID;
  loadingEquipmentId?: ID;
}

export type Operation = "DISPATCH" | "RECEIVE" | "TRANSFER" | "INTERNAL";

export type TxState =
  | "DRAFT"
  | "FIRST_CAPTURED"
  | "SECOND_CAPTURED"
  | "RECONCILED"
  | "APPROVED"
  | "EXCEPTION"
  | "VOIDED";

export interface Revision {
  version: number;
  at: ISO;
  by: ID;
  reason: string;
  changes: Record<string, [unknown, unknown]>;
}

export interface Transaction {
  id: ID;
  ticketNo: string;
  verifyCode: string;
  visitId: ID;
  siteId: ID;
  vehicleId: ID;
  driverId: ID;
  carrierId: ID;
  customerId?: ID;
  materialId: ID;
  permitId?: ID;
  originId: ID;
  destinationId: ID;
  operation: Operation;
  state: TxState;
  firstWeighId?: ID;
  secondWeighId?: ID;
  extraWeighIds: ID[];
  grossKg?: number;
  tareKg?: number;
  netKg?: number;
  deductionKg: number;
  deductionReason?: string;
  billableKg?: number;
  tareSource?: "MEASURED" | "STORED";
  holdReasons: string[];
  version: number;
  revisions: Revision[];
  printCount: number;
  createdBy: ID;
  approvedBy?: ID;
  createdAt: ISO;
  approvedAt?: ISO;
  erpStatus: "PENDING" | "SENT" | "FAILED" | "N/A";
  volumeM3?: number;
  estimatedMassKg?: number;
  payloadKg?: number;
  lidarScanIds: ID[];
  qcStatus: "NOT_REQUIRED" | "PENDING" | "APPROVED" | "QUARANTINE";
  shiftCode: Shift["code"];
}

export interface WeighEvent {
  id: ID;
  transactionId: ID;
  scaleId: ID;
  seq: number;
  pass: "FIRST" | "SECOND" | "EXTRA" | "ONE_PASS";
  weightKg: number;
  stable: boolean;
  fresh: boolean;
  ageMs: number;
  positionOk: boolean;
  captureMethod: "SENSOR" | "MANUAL" | "STORED";
  manualReason?: string;
  secondSigner?: ID;
  rawFrame: string;
  rawHash: string;
  capturedAt: ISO;
  operatorId: ID;
  evidenceIds: ID[];
}

export type EvidenceKind =
  | "CAM_FRONT"
  | "CAM_REAR"
  | "CAM_TOP"
  | "CAM_SIDE"
  | "CAM_OVERVIEW"
  | "UVSS"
  | "LICENSE_PHOTO"
  | "PLATE_CROP";
export interface Evidence {
  id: ID;
  kind: EvidenceKind;
  cameraId?: ID;
  visitId: ID;
  transactionId?: ID;
  stage: "GATE_IN" | "SCALE_1" | "SCALE_2" | "GATE_OUT" | "SCAN";
  capturedAt: ISO;
  sha256: string;
  seed: number;
  loaded: boolean;
}

export interface PlateRead {
  id: ID;
  cameraId: ID;
  visitId?: ID;
  plateRaw: string;
  plateNormalized: string;
  confidence: number;
  bbox: [number, number, number, number];
  modelVersion: string;
  capturedAt: ISO;
  review: "AUTO" | "CONFIRMED" | "CORRECTED";
}

export interface RfidRead {
  id: ID;
  readerId: ID;
  epc: string;
  rssi: number;
  antenna: number;
  readAt: ISO;
  vehicleId?: ID;
}

export type Decision = "PASS" | "REVIEW" | "HOLD" | "BLOCK";
export type DecisionStepName = "SAFETY" | "IDENTITY" | "DOCUMENTS" | "PERMIT" | "WEIGHT" | "EXIT_PERMIT" | "EVIDENCE" | "ALERTS";
export interface DecisionStep {
  step: DecisionStepName;
  result: "OK" | "FAIL" | "UNKNOWN" | "SKIP";
  code?: string;
}

export type GateEventType =
  | "ARRIVE"
  | "DECISION"
  | "OPEN_REQUEST"
  | "OPEN_CONFIRMED"
  | "OPEN_FAILED"
  | "CLOSE"
  | "EXIT"
  | "DENY"
  | "ANTI_PASSBACK"
  | "TAILGATE"
  | "UNCOMMANDED_OPEN";
export interface GateEvent {
  id: ID;
  visitId?: ID;
  laneCode: Lane["code"];
  type: GateEventType;
  decision?: Decision;
  trace?: DecisionStep[];
  reason?: string;
  actorId?: ID;
  at: ISO;
}

export interface ExitPermit {
  id: ID;
  serial: string;
  visitId: ID;
  transactionIds: ID[];
  token: string;
  status: "DRAFT" | "APPROVED" | "CONSUMED" | "CANCELLED";
  empty: boolean;
  approvedBy?: ID;
  approvedAt?: ISO;
  consumedAt?: ISO;
  consumedBy?: ID;
  scans: { at: ISO; by: ID; result: "ACCEPTED" | "REJECTED_USED" | "REJECTED_INVALID" | "REJECTED_CANCELLED" }[];
}

export interface LidarScan {
  id: ID;
  visitId: ID;
  vehicleId: ID;
  transactionId?: ID;
  kind: "EMPTY" | "LOADED";
  volumeM3: number;
  quality: number;
  offCenterPct: number;
  peakHeightM: number;
  carrybackM3: number;
  covered: boolean;
  capturedAt: ISO;
  seed: number;
}

export interface UvssAnomaly {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  labelEn: string;
  score: number;
}
export interface UvssScan {
  id: ID;
  visitId: ID;
  vehicleId: ID;
  capturedAt: ISO;
  referenceMatchPct: number;
  status: "CLEAR" | "SUSPECT" | "CLEARED_BY_GUARD" | "ESCALATED";
  anomalies: UvssAnomaly[];
  seed: number;
}

export interface PayloadEvent {
  id: ID;
  equipmentId: ID;
  visitId?: ID;
  vehicleId: ID;
  buckets: number[];
  payloadKg: number;
  targetKg: number;
  at: ISO;
}

export type Severity = "INFO" | "WARNING" | "HIGH" | "CRITICAL";
export type AlertAction =
  | "BLOCK_CAPTURE"
  | "HOLD_EXIT"
  | "HOLD_ENTRY"
  | "REVIEW"
  | "NOTIFY"
  | "LOCK_LEGAL"
  | "MAINTENANCE"
  | "ALARM";
export interface AlertRule {
  code: string;
  name: string;
  nameEn: string;
  condition: string;
  severity: Severity;
  action: AlertAction;
  enabled: boolean;
  params: Record<string, number>;
  version: number;
  source: string;
}

export type AlertStatus = "OPEN" | "ACK" | "INVESTIGATING" | "RESOLVED" | "DISMISSED";
export interface Alert {
  id: ID;
  ruleCode: string;
  severity: Severity;
  status: AlertStatus;
  title: string;
  titleEn: string;
  detail?: string;
  observed?: string;
  threshold?: string;
  visitId?: ID;
  transactionId?: ID;
  deviceId?: ID;
  laneCode?: Lane["code"];
  openedAt: ISO;
  ackBy?: ID;
  ackAt?: ISO;
  assignee?: ID;
  slaDueAt: ISO;
  resolvedAt?: ISO;
  resolution?: string;
  evidenceIds: ID[];
}

export interface FraudCase {
  id: ID;
  kind: "TARE_OUTLIER" | "REPEAT_NET" | "IMPOSSIBLE_TRIP" | "MANUAL_RATE" | "PLATE_SWAP";
  title: string;
  titleEn: string;
  transactionIds: ID[];
  vehicleId?: ID;
  operatorId?: ID;
  score: number;
  status: "NEW" | "REVIEWING" | "CONFIRMED" | "FALSE_POSITIVE";
  notes: string;
  data: number[];
  openedAt: ISO;
}

export interface CalibrationRecord {
  id: ID;
  scaleId: ID;
  certificateNo: string;
  issuer: string;
  calibratedAt: ISO;
  validUntil: ISO;
  testPoints: { refKg: number; readKg: number; errorKg: number }[];
  maxErrorKg: number;
  documentHash: string;
}

export interface LoadCellSample {
  scaleId: ID;
  cellNo: number;
  zeroKg: number;
  driftKg: number;
  noiseKg: number;
  temperatureC: number;
  voltage: number;
  loadSharePct: number;
  status: "OK" | "WARN" | "FAULT";
  history: number[];
}

export interface AuditEvent {
  id: ID;
  seq: number;
  at: ISO;
  actorId: ID;
  actorType: "HUMAN" | "DEVICE" | "SYSTEM";
  action: string;
  entityType: string;
  entityId: ID;
  reason?: string;
  data?: Record<string, unknown>;
  prevHash: string;
  hash: string;
}

export type OutboxChannel = "ERP" | "WEBHOOK" | "SMS" | "WHATSAPP" | "EMAIL";
export interface OutboxMessage {
  id: ID;
  channel: OutboxChannel;
  topic: string;
  entityId: ID;
  recipient?: string;
  body: string;
  status: "PENDING" | "SENT" | "FAILED" | "DEAD";
  attempts: number;
  nextRetryAt?: ISO;
  idempotencyKey: string;
  lastError?: string;
  createdAt: ISO;
}

export interface FleetCycle {
  id: ID;
  vehicleId: ID;
  shiftCode: Shift["code"];
  start: ISO;
  loadMin: number;
  haulMin: number;
  queueMin: number;
  dumpMin: number;
  returnMin: number;
  payloadKg: number;
  equipmentId: ID;
}

// ---- Live (simulated hardware) state ----
export interface LaneLive {
  code: Lane["code"];
  kind: LaneKind;
  visitId?: ID;
  barrier: "CLOSED" | "OPENING" | "OPEN" | "CLOSING" | "FAULT";
  barrierAck: boolean;
  light: "RED" | "YELLOW" | "GREEN" | "OFF";
  decision?: Decision;
  trace?: DecisionStep[];
  message?: string;
  // scale lanes
  weightKg?: number;
  stable?: boolean;
  motion?: boolean;
  zero?: boolean;
  lastReadingAt?: ISO;
  rawFrame?: string;
  weightHistory?: number[];
  positionOk?: boolean;
  beams?: [boolean, boolean, boolean, boolean];
  truckOffsetPct?: number;
  indicatorOnline?: boolean;
  phase?: string;
  phaseUntil?: number;
  locked?: boolean;
}

export interface LogLine {
  at: ISO;
  level: "info" | "warn" | "error" | "device";
  source: string;
  text: string;
}

export interface LiveSnapshot {
  now: ISO;
  revision: number;
  speed: number;
  mode: "AUTO" | "MANUAL";
  wanOnline: boolean;
  syncQueue: number;
  lanes: LaneLive[];
  queue: ID[];
  log: LogLine[];
  openAlerts: number;
  criticalAlerts: number;
}
