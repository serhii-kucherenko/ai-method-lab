import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type WarehouseRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import {
  canClear,
  canTransition,
  dualClearReady,
  isHot,
  type LotState,
} from "./rules.js";

export type Store = {
  db: DatabaseSync;
  dep: DepClient;
  webhookSecret: string;
  sideEffects: number;
  rateLimit: number;
  rateCounts: Map<string, number>;
};

export function createStore(
  opts: {
    dbPath?: string;
    dep?: DepClient;
    webhookSecret?: string;
    rateLimit?: number;
  } = {},
): Store {
  return {
    db: openDatabase(opts.dbPath ?? ":memory:"),
    dep: opts.dep ?? createMockDep(),
    webhookSecret: opts.webhookSecret ?? "whsec_test",
    sideEffects: 0,
    rateLimit: opts.rateLimit ?? 1000,
    rateCounts: new Map(),
  };
}

export function registerUser(db: DatabaseSync, email: string, password: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO users (id, email, password) VALUES (?, ?, ?)").run(id, email, password);
  return { id, email };
}

export function findUserByEmail(db: DatabaseSync, email: string) {
  return db.prepare("SELECT id, email, password FROM users WHERE email = ?").get(email) as
    | { id: string; email: string; password: string }
    | undefined;
}

export function issueToken(db: DatabaseSync, userId: string): string {
  const token = randomUUID();
  db.prepare("INSERT INTO tokens (token, user_id) VALUES (?, ?)").run(token, userId);
  return token;
}

export function resolveToken(db: DatabaseSync, token: string): string | null {
  const row = db.prepare("SELECT user_id FROM tokens WHERE token = ?").get(token) as
    | { user_id: string }
    | undefined;
  return row?.user_id ?? null;
}

export function createWarehouse(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO warehouses (id, name, created_by) VALUES (?, ?, ?)").run(
    id,
    name,
    userId,
  );
  db.prepare(
    "INSERT INTO warehouse_members (warehouse_id, user_id, role) VALUES (?, ?, 'qa_lead')",
  ).run(id, userId);
  return { id, name };
}

export function addMember(
  db: DatabaseSync,
  warehouseId: string,
  userId: string,
  role: WarehouseRole,
) {
  db.prepare(
    "INSERT INTO warehouse_members (warehouse_id, user_id, role) VALUES (?, ?, ?)",
  ).run(warehouseId, userId, role);
}

export function getRole(
  db: DatabaseSync,
  warehouseId: string,
  userId: string,
): WarehouseRole | null {
  const row = db
    .prepare("SELECT role FROM warehouse_members WHERE warehouse_id = ? AND user_id = ?")
    .get(warehouseId, userId) as { role: WarehouseRole } | undefined;
  return row?.role ?? null;
}

export function getWarehouse(db: DatabaseSync, id: string) {
  return db.prepare("SELECT id, name FROM warehouses WHERE id = ?").get(id) as
    | { id: string; name: string }
    | undefined;
}

export function assertAccess(
  db: DatabaseSync,
  warehouseId: string,
  userId: string,
  mode: "read" | "write" | "own" | "inspect" | "clear",
): WarehouseRole | null {
  const role = getRole(db, warehouseId, userId);
  if (!role) return null;
  if (mode === "read") return role;
  if (mode === "write" && (role === "qa_lead" || role === "clerk")) return role;
  if (mode === "own" && role === "qa_lead") return role;
  if (mode === "inspect" && (role === "qa_lead" || role === "inspector")) return role;
  if (mode === "clear" && canClear(role)) return role;
  return null;
}

export type Lot = {
  id: string;
  warehouseId: string;
  label: string;
  severityThreshold: number;
  state: LotState;
  version: number;
  maxSeverity: number;
  clearCount: number;
  hot: boolean;
};

function maxSeverity(db: DatabaseSync, lotId: string): number {
  const row = db
    .prepare("SELECT COALESCE(MAX(severity), 0) AS m FROM inspections WHERE lot_id = ?")
    .get(lotId) as { m: number };
  return row.m;
}

function clearCount(db: DatabaseSync, lotId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS c FROM lot_clears WHERE lot_id = ?")
    .get(lotId) as { c: number };
  return row.c;
}

export function getLot(db: DatabaseSync, id: string): Lot | undefined {
  const row = db
    .prepare(
      `SELECT id, warehouse_id AS warehouseId, label,
              severity_threshold AS severityThreshold, state, version
       FROM lots WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        warehouseId: string;
        label: string;
        severityThreshold: number;
        state: string;
        version: number;
      }
    | undefined;
  if (!row) return undefined;
  const max = maxSeverity(db, id);
  return {
    id: row.id,
    warehouseId: row.warehouseId,
    label: row.label,
    severityThreshold: row.severityThreshold,
    state: row.state as LotState,
    version: row.version,
    maxSeverity: max,
    clearCount: clearCount(db, id),
    hot: isHot(max, row.severityThreshold),
  };
}

export function createLot(
  db: DatabaseSync,
  warehouseId: string,
  label: string,
  severityThreshold = 4,
) {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO lots (id, warehouse_id, label, severity_threshold, state, version)
     VALUES (?, ?, ?, ?, 'open', 1)`,
  ).run(id, warehouseId, label, severityThreshold);
  return getLot(db, id)!;
}

export function listLots(db: DatabaseSync, warehouseId: string, limit: number, offset: number) {
  const rows = db
    .prepare(
      `SELECT id FROM lots WHERE warehouse_id = ? ORDER BY label ASC LIMIT ? OFFSET ?`,
    )
    .all(warehouseId, limit, offset) as { id: string }[];
  return rows.map((r) => getLot(db, r.id)!);
}

export function addInspection(
  db: DatabaseSync,
  lotId: string,
  inspectorId: string,
  severity: number,
  note = "",
): { ok: true; lot: Lot } | { ok: false; error: string; status: number } {
  const lot = getLot(db, lotId);
  if (!lot) return { ok: false, error: "not found", status: 404 };
  if (lot.state !== "open") {
    return { ok: false, error: "inspections only while open", status: 400 };
  }
  if (severity < 1 || severity > 5) {
    return { ok: false, error: "severity 1-5", status: 400 };
  }
  db.prepare(
    `INSERT INTO inspections (id, lot_id, inspector_id, severity, note)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), lotId, inspectorId, severity, note);
  return { ok: true, lot: getLot(db, lotId)! };
}

export function addClear(
  db: DatabaseSync,
  lotId: string,
  qaLeadId: string,
): { ok: true; clearCount: number } | { ok: false; error: string; status: number } {
  const lot = getLot(db, lotId);
  if (!lot) return { ok: false, error: "not found", status: 404 };
  if (lot.state !== "held") {
    return { ok: false, error: "clears only while held", status: 400 };
  }
  try {
    db.prepare(
      `INSERT INTO lot_clears (id, lot_id, qa_lead_id) VALUES (?, ?, ?)`,
    ).run(randomUUID(), lotId, qaLeadId);
  } catch {
    return { ok: false, error: "already cleared by this qa lead", status: 409 };
  }
  return { ok: true, clearCount: clearCount(db, lotId) };
}

export function transitionLot(
  db: DatabaseSync,
  lotId: string,
  actorId: string,
  to: LotState,
  version: number,
): { ok: true; lot: Lot } | { ok: false; error: string; status: number } {
  const lot = getLot(db, lotId);
  if (!lot) return { ok: false, error: "not found", status: 404 };
  if (lot.version !== version) {
    return { ok: false, error: "version conflict", status: 409 };
  }
  if (!canTransition(lot.state, to)) {
    return { ok: false, error: "illegal transition", status: 400 };
  }
  if (to === "held" && !lot.hot) {
    return { ok: false, error: "quarantine requires hot severity", status: 400 };
  }
  if (to === "cleared" && !dualClearReady(lot.clearCount, lot.hot)) {
    return { ok: false, error: "dual qa clear required", status: 400 };
  }
  db.prepare("UPDATE lots SET state = ?, version = version + 1 WHERE id = ?").run(to, lotId);
  db.prepare(
    `INSERT INTO lot_audit (id, lot_id, actor_id, from_state, to_state)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), lotId, actorId, lot.state, to);
  return { ok: true, lot: getLot(db, lotId)! };
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  lotId: string,
  payload: Record<string, unknown>,
) {
  db.prepare(
    `INSERT INTO webhook_deliveries (id, event, lot_id, payload) VALUES (?, ?, ?, ?)`,
  ).run(randomUUID(), event, lotId, JSON.stringify(payload));
}
