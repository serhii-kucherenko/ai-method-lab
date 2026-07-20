import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type FleetRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import {
  canSignOff,
  canTransition,
  dualSignOffReady,
  isOverdueService,
  type WorkOrderState,
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

export function createFleet(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO fleets (id, name, created_by) VALUES (?, ?, ?)").run(id, name, userId);
  db.prepare("INSERT INTO fleet_members (fleet_id, user_id, role) VALUES (?, ?, 'owner')").run(
    id,
    userId,
  );
  return { id, name };
}

export function addMember(db: DatabaseSync, fleetId: string, userId: string, role: FleetRole) {
  db.prepare("INSERT INTO fleet_members (fleet_id, user_id, role) VALUES (?, ?, ?)").run(
    fleetId,
    userId,
    role,
  );
}

export function getRole(db: DatabaseSync, fleetId: string, userId: string): FleetRole | null {
  const row = db
    .prepare("SELECT role FROM fleet_members WHERE fleet_id = ? AND user_id = ?")
    .get(fleetId, userId) as { role: FleetRole } | undefined;
  return row?.role ?? null;
}

export function getFleet(db: DatabaseSync, id: string) {
  return db.prepare("SELECT id, name FROM fleets WHERE id = ?").get(id) as
    | { id: string; name: string }
    | undefined;
}

export function assertAccess(
  db: DatabaseSync,
  fleetId: string,
  userId: string,
  mode: "read" | "write" | "own" | "signoff",
): FleetRole | null {
  const role = getRole(db, fleetId, userId);
  if (!role) return null;
  if (mode === "read") return role;
  if (mode === "write" && (role === "owner" || role === "dispatcher")) return role;
  if (mode === "own" && role === "owner") return role;
  if (mode === "signoff" && canSignOff(role)) return role;
  return null;
}

export function createAsset(
  db: DatabaseSync,
  fleetId: string,
  label: string,
  serviceIntervalHours = 100,
) {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO assets (id, fleet_id, label, service_interval_hours)
     VALUES (?, ?, ?, ?)`,
  ).run(id, fleetId, label, serviceIntervalHours);
  return { id, fleetId, label, serviceIntervalHours };
}

export function listAssets(db: DatabaseSync, fleetId: string, limit: number, offset: number) {
  return db
    .prepare(
      `SELECT id, fleet_id AS fleetId, label,
              service_interval_hours AS serviceIntervalHours
       FROM assets WHERE fleet_id = ? ORDER BY label ASC LIMIT ? OFFSET ?`,
    )
    .all(fleetId, limit, offset) as {
    id: string;
    fleetId: string;
    label: string;
    serviceIntervalHours: number;
  }[];
}

export function getAsset(db: DatabaseSync, id: string) {
  return db
    .prepare(
      `SELECT id, fleet_id AS fleetId, label,
              service_interval_hours AS serviceIntervalHours FROM assets WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        fleetId: string;
        label: string;
        serviceIntervalHours: number;
      }
    | undefined;
}

export type WorkOrder = {
  id: string;
  assetId: string;
  title: string;
  hoursDue: number;
  state: WorkOrderState;
  version: number;
  signOffCount: number;
};

function signOffCount(db: DatabaseSync, workOrderId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS c FROM work_order_signoffs WHERE work_order_id = ?")
    .get(workOrderId) as { c: number };
  return row.c;
}

export function getWorkOrder(db: DatabaseSync, id: string): WorkOrder | undefined {
  const row = db
    .prepare(
      `SELECT id, asset_id AS assetId, title, hours_due AS hoursDue, state, version
       FROM work_orders WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        assetId: string;
        title: string;
        hoursDue: number;
        state: string;
        version: number;
      }
    | undefined;
  if (!row) return undefined;
  return {
    id: row.id,
    assetId: row.assetId,
    title: row.title,
    hoursDue: row.hoursDue,
    state: row.state as WorkOrderState,
    version: row.version,
    signOffCount: signOffCount(db, id),
  };
}

export function createWorkOrder(
  db: DatabaseSync,
  assetId: string,
  title: string,
  hoursDue: number,
): { ok: true; workOrder: WorkOrder } | { ok: false; error: string } {
  const asset = getAsset(db, assetId);
  if (!asset) return { ok: false, error: "asset not found" };
  if (!isOverdueService(hoursDue, asset.serviceIntervalHours)) {
    return { ok: false, error: "hours within interval — not overdue" };
  }
  const id = randomUUID();
  db.prepare(
    `INSERT INTO work_orders (id, asset_id, title, hours_due, state, version)
     VALUES (?, ?, ?, ?, 'open', 1)`,
  ).run(id, assetId, title, hoursDue);
  return { ok: true, workOrder: getWorkOrder(db, id)! };
}

export function addSignOff(
  db: DatabaseSync,
  workOrderId: string,
  mechanicId: string,
): { ok: true; signOffCount: number } | { ok: false; error: string; status: number } {
  const wo = getWorkOrder(db, workOrderId);
  if (!wo) return { ok: false, error: "not found", status: 404 };
  if (wo.state !== "parts") {
    return { ok: false, error: "sign-offs only while parts", status: 400 };
  }
  try {
    db.prepare(
      `INSERT INTO work_order_signoffs (id, work_order_id, mechanic_id)
       VALUES (?, ?, ?)`,
    ).run(randomUUID(), workOrderId, mechanicId);
  } catch {
    return { ok: false, error: "already signed", status: 409 };
  }
  return { ok: true, signOffCount: signOffCount(db, workOrderId) };
}

export function transitionWorkOrder(
  db: DatabaseSync,
  workOrderId: string,
  actorId: string,
  to: WorkOrderState,
  version: number,
): { ok: true; workOrder: WorkOrder } | { ok: false; error: string; status: number } {
  const wo = getWorkOrder(db, workOrderId);
  if (!wo) return { ok: false, error: "not found", status: 404 };
  if (wo.version !== version) {
    return { ok: false, error: "version conflict", status: 409 };
  }
  if (!canTransition(wo.state, to)) {
    return { ok: false, error: "illegal transition", status: 400 };
  }
  if (to === "closed" && !dualSignOffReady(wo.signOffCount)) {
    return { ok: false, error: "dual mechanic sign-off required", status: 400 };
  }
  db.prepare("UPDATE work_orders SET state = ?, version = version + 1 WHERE id = ?").run(
    to,
    workOrderId,
  );
  db.prepare(
    `INSERT INTO work_order_audit (id, work_order_id, actor_id, from_state, to_state)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), workOrderId, actorId, wo.state, to);
  return { ok: true, workOrder: getWorkOrder(db, workOrderId)! };
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  workOrderId: string,
  payload: Record<string, unknown>,
) {
  db.prepare(
    `INSERT INTO webhook_deliveries (id, event, work_order_id, payload) VALUES (?, ?, ?, ?)`,
  ).run(randomUUID(), event, workOrderId, JSON.stringify(payload));
}

export function fleetIdForWorkOrder(db: DatabaseSync, workOrderId: string): string | null {
  const wo = getWorkOrder(db, workOrderId);
  if (!wo) return null;
  return getAsset(db, wo.assetId)?.fleetId ?? null;
}
