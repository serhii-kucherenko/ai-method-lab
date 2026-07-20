import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type StoreRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import {
  canApprove,
  canTransition,
  dualApproveReady,
  staysNonNegative,
  type AdjustState,
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

export function createRetailStore(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO stores (id, name, created_by) VALUES (?, ?, ?)").run(id, name, userId);
  db.prepare(`INSERT INTO store_members (store_id, user_id, role) VALUES (?, ?, 'manager')`).run(
    id,
    userId,
  );
  return { id, name };
}

export function addMember(db: DatabaseSync, storeId: string, userId: string, role: StoreRole) {
  db.prepare("INSERT INTO store_members (store_id, user_id, role) VALUES (?, ?, ?)").run(
    storeId,
    userId,
    role,
  );
}

export function getRole(db: DatabaseSync, storeId: string, userId: string): StoreRole | null {
  const row = db
    .prepare("SELECT role FROM store_members WHERE store_id = ? AND user_id = ?")
    .get(storeId, userId) as { role: StoreRole } | undefined;
  return row?.role ?? null;
}

export function getRetailStore(db: DatabaseSync, id: string) {
  return db.prepare("SELECT id, name FROM stores WHERE id = ?").get(id) as
    | { id: string; name: string }
    | undefined;
}

export function assertAccess(
  db: DatabaseSync,
  storeId: string,
  userId: string,
  mode: "read" | "write" | "own" | "approve",
): StoreRole | null {
  const role = getRole(db, storeId, userId);
  if (!role) return null;
  if (mode === "read") return role;
  if (mode === "write" && (role === "manager" || role === "clerk")) return role;
  if (mode === "own" && role === "manager") return role;
  if (mode === "approve" && canApprove(role)) return role;
  return null;
}

export type Sku = {
  id: string;
  storeId: string;
  code: string;
  qty: number;
};

export function getSku(db: DatabaseSync, id: string): Sku | undefined {
  return db
    .prepare(`SELECT id, store_id AS storeId, code, qty FROM skus WHERE id = ?`)
    .get(id) as Sku | undefined;
}

export function createSku(
  db: DatabaseSync,
  storeId: string,
  code: string,
  qty: number,
): { ok: true; sku: Sku } | { ok: false; error: string } {
  if (!(qty >= 0)) return { ok: false, error: "qty must be non-negative" };
  if (!code.trim()) return { ok: false, error: "code required" };
  const id = randomUUID();
  db.prepare(`INSERT INTO skus (id, store_id, code, qty) VALUES (?, ?, ?, ?)`).run(
    id,
    storeId,
    code,
    qty,
  );
  return { ok: true, sku: getSku(db, id)! };
}

export function listSkus(db: DatabaseSync, storeId: string, limit: number, offset: number) {
  return db
    .prepare(
      `SELECT id, store_id AS storeId, code, qty FROM skus
       WHERE store_id = ? ORDER BY code ASC LIMIT ? OFFSET ?`,
    )
    .all(storeId, limit, offset) as Sku[];
}

export type Adjustment = {
  id: string;
  skuId: string;
  title: string;
  delta: number;
  state: AdjustState;
  version: number;
  approvalCount: number;
};

function approvalCount(db: DatabaseSync, adjustmentId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS c FROM adjust_approvals WHERE adjustment_id = ?")
    .get(adjustmentId) as { c: number };
  return row.c;
}

export function getAdjustment(db: DatabaseSync, id: string): Adjustment | undefined {
  const row = db
    .prepare(
      `SELECT id, sku_id AS skuId, title, delta, state, version FROM adjustments WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        skuId: string;
        title: string;
        delta: number;
        state: string;
        version: number;
      }
    | undefined;
  if (!row) return undefined;
  return {
    id: row.id,
    skuId: row.skuId,
    title: row.title,
    delta: row.delta,
    state: row.state as AdjustState,
    version: row.version,
    approvalCount: approvalCount(db, id),
  };
}

export function createAdjustment(
  db: DatabaseSync,
  skuId: string,
  title: string,
  delta: number,
): { ok: true; adjustment: Adjustment } | { ok: false; error: string } {
  const sku = getSku(db, skuId);
  if (!sku) return { ok: false, error: "sku not found" };
  if (delta === 0) return { ok: false, error: "delta required" };
  if (!staysNonNegative(sku.qty, delta)) {
    return { ok: false, error: "adjustment would make stock negative" };
  }
  const id = randomUUID();
  db.prepare(
    `INSERT INTO adjustments (id, sku_id, title, delta, state, version)
     VALUES (?, ?, ?, ?, 'drafted', 1)`,
  ).run(id, skuId, title, delta);
  return { ok: true, adjustment: getAdjustment(db, id)! };
}

export function addApproval(
  db: DatabaseSync,
  adjustmentId: string,
  managerId: string,
): { ok: true; approvalCount: number } | { ok: false; error: string; status: number } {
  const adj = getAdjustment(db, adjustmentId);
  if (!adj) return { ok: false, error: "not found", status: 404 };
  if (adj.state !== "staged") {
    return { ok: false, error: "approvals only while staged", status: 400 };
  }
  try {
    db.prepare(
      `INSERT INTO adjust_approvals (id, adjustment_id, manager_id) VALUES (?, ?, ?)`,
    ).run(randomUUID(), adjustmentId, managerId);
  } catch {
    return { ok: false, error: "already approved", status: 409 };
  }
  return { ok: true, approvalCount: approvalCount(db, adjustmentId) };
}

export function transitionAdjustment(
  db: DatabaseSync,
  adjustmentId: string,
  actorId: string,
  to: AdjustState,
  version: number,
): { ok: true; adjustment: Adjustment } | { ok: false; error: string; status: number } {
  const adj = getAdjustment(db, adjustmentId);
  if (!adj) return { ok: false, error: "not found", status: 404 };
  if (adj.version !== version) {
    return { ok: false, error: "version conflict", status: 409 };
  }
  if (!canTransition(adj.state, to)) {
    return { ok: false, error: "illegal transition", status: 400 };
  }
  if (to === "applied") {
    if (!dualApproveReady(adj.approvalCount)) {
      return { ok: false, error: "dual manager approval required", status: 400 };
    }
    const sku = getSku(db, adj.skuId);
    if (!sku) return { ok: false, error: "sku not found", status: 404 };
    if (!staysNonNegative(sku.qty, adj.delta)) {
      return { ok: false, error: "adjustment would make stock negative", status: 400 };
    }
    db.prepare("UPDATE skus SET qty = qty + ? WHERE id = ?").run(adj.delta, adj.skuId);
  }
  db.prepare("UPDATE adjustments SET state = ?, version = version + 1 WHERE id = ?").run(
    to,
    adjustmentId,
  );
  db.prepare(
    `INSERT INTO adjust_audit (id, adjustment_id, actor_id, from_state, to_state)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), adjustmentId, actorId, adj.state, to);
  return { ok: true, adjustment: getAdjustment(db, adjustmentId)! };
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  adjustmentId: string,
  payload: Record<string, unknown>,
) {
  db.prepare(
    `INSERT INTO webhook_deliveries (id, event, adjustment_id, payload) VALUES (?, ?, ?, ?)`,
  ).run(randomUUID(), event, adjustmentId, JSON.stringify(payload));
}

export function storeIdForAdjustment(db: DatabaseSync, adjustmentId: string): string | null {
  const adj = getAdjustment(db, adjustmentId);
  if (!adj) return null;
  return getSku(db, adj.skuId)?.storeId ?? null;
}
