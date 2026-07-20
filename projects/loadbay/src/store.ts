import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type BayRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import {
  canSeal,
  canTransition,
  dualSealReady,
  fitsCapacity,
  type LoadState,
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

export function createBay(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO bays (id, name, created_by) VALUES (?, ?, ?)").run(id, name, userId);
  db.prepare("INSERT INTO bay_members (bay_id, user_id, role) VALUES (?, ?, 'owner')").run(
    id,
    userId,
  );
  return { id, name };
}

export function addMember(db: DatabaseSync, bayId: string, userId: string, role: BayRole) {
  db.prepare("INSERT INTO bay_members (bay_id, user_id, role) VALUES (?, ?, ?)").run(
    bayId,
    userId,
    role,
  );
}

export function getRole(db: DatabaseSync, bayId: string, userId: string): BayRole | null {
  const row = db
    .prepare("SELECT role FROM bay_members WHERE bay_id = ? AND user_id = ?")
    .get(bayId, userId) as { role: BayRole } | undefined;
  return row?.role ?? null;
}

export function getBay(db: DatabaseSync, id: string) {
  return db.prepare("SELECT id, name FROM bays WHERE id = ?").get(id) as
    | { id: string; name: string }
    | undefined;
}

export function assertAccess(
  db: DatabaseSync,
  bayId: string,
  userId: string,
  mode: "read" | "write" | "own" | "seal",
): BayRole | null {
  const role = getRole(db, bayId, userId);
  if (!role) return null;
  if (mode === "read") return role;
  if (mode === "write" && (role === "owner" || role === "dispatcher")) return role;
  if (mode === "own" && role === "owner") return role;
  if (mode === "seal" && canSeal(role)) return role;
  return null;
}

export function createDock(db: DatabaseSync, bayId: string, label: string, maxWeightKg = 10000) {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO docks (id, bay_id, label, max_weight_kg) VALUES (?, ?, ?, ?)`,
  ).run(id, bayId, label, maxWeightKg);
  return { id, bayId, label, maxWeightKg };
}

export function listDocks(db: DatabaseSync, bayId: string, limit: number, offset: number) {
  return db
    .prepare(
      `SELECT id, bay_id AS bayId, label, max_weight_kg AS maxWeightKg
       FROM docks WHERE bay_id = ? ORDER BY label ASC LIMIT ? OFFSET ?`,
    )
    .all(bayId, limit, offset) as {
    id: string;
    bayId: string;
    label: string;
    maxWeightKg: number;
  }[];
}

export function getDock(db: DatabaseSync, id: string) {
  return db
    .prepare(
      `SELECT id, bay_id AS bayId, label, max_weight_kg AS maxWeightKg FROM docks WHERE id = ?`,
    )
    .get(id) as
    | { id: string; bayId: string; label: string; maxWeightKg: number }
    | undefined;
}

export type Load = {
  id: string;
  dockId: string;
  title: string;
  weightKg: number;
  state: LoadState;
  version: number;
  sealCount: number;
};

function sealCount(db: DatabaseSync, loadId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS c FROM load_seals WHERE load_id = ?")
    .get(loadId) as { c: number };
  return row.c;
}

export function getLoad(db: DatabaseSync, id: string): Load | undefined {
  const row = db
    .prepare(
      `SELECT id, dock_id AS dockId, title, weight_kg AS weightKg, state, version
       FROM loads WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        dockId: string;
        title: string;
        weightKg: number;
        state: string;
        version: number;
      }
    | undefined;
  if (!row) return undefined;
  return {
    id: row.id,
    dockId: row.dockId,
    title: row.title,
    weightKg: row.weightKg,
    state: row.state as LoadState,
    version: row.version,
    sealCount: sealCount(db, id),
  };
}

export function createLoad(
  db: DatabaseSync,
  dockId: string,
  title: string,
  weightKg: number,
): { ok: true; load: Load } | { ok: false; error: string } {
  const dock = getDock(db, dockId);
  if (!dock) return { ok: false, error: "dock not found" };
  if (!fitsCapacity(weightKg, dock.maxWeightKg)) {
    return { ok: false, error: "weight exceeds dock capacity" };
  }
  const id = randomUUID();
  db.prepare(
    `INSERT INTO loads (id, dock_id, title, weight_kg, state, version)
     VALUES (?, ?, ?, ?, 'staged', 1)`,
  ).run(id, dockId, title, weightKg);
  return { ok: true, load: getLoad(db, id)! };
}

export function addSeal(
  db: DatabaseSync,
  loadId: string,
  checkerId: string,
): { ok: true; sealCount: number } | { ok: false; error: string; status: number } {
  const load = getLoad(db, loadId);
  if (!load) return { ok: false, error: "not found", status: 404 };
  if (load.state !== "sealed") {
    return { ok: false, error: "seals only while sealed", status: 400 };
  }
  try {
    db.prepare(
      `INSERT INTO load_seals (id, load_id, checker_id) VALUES (?, ?, ?)`,
    ).run(randomUUID(), loadId, checkerId);
  } catch {
    return { ok: false, error: "already sealed", status: 409 };
  }
  return { ok: true, sealCount: sealCount(db, loadId) };
}

export function transitionLoad(
  db: DatabaseSync,
  loadId: string,
  actorId: string,
  to: LoadState,
  version: number,
): { ok: true; load: Load } | { ok: false; error: string; status: number } {
  const load = getLoad(db, loadId);
  if (!load) return { ok: false, error: "not found", status: 404 };
  if (load.version !== version) {
    return { ok: false, error: "version conflict", status: 409 };
  }
  if (!canTransition(load.state, to)) {
    return { ok: false, error: "illegal transition", status: 400 };
  }
  if (to === "departed" && !dualSealReady(load.sealCount)) {
    return { ok: false, error: "dual checker seal required", status: 400 };
  }
  db.prepare("UPDATE loads SET state = ?, version = version + 1 WHERE id = ?").run(to, loadId);
  db.prepare(
    `INSERT INTO load_audit (id, load_id, actor_id, from_state, to_state)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), loadId, actorId, load.state, to);
  return { ok: true, load: getLoad(db, loadId)! };
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  loadId: string,
  payload: Record<string, unknown>,
) {
  db.prepare(
    `INSERT INTO webhook_deliveries (id, event, load_id, payload) VALUES (?, ?, ?, ?)`,
  ).run(randomUUID(), event, loadId, JSON.stringify(payload));
}

export function bayIdForLoad(db: DatabaseSync, loadId: string): string | null {
  const load = getLoad(db, loadId);
  if (!load) return null;
  return getDock(db, load.dockId)?.bayId ?? null;
}
