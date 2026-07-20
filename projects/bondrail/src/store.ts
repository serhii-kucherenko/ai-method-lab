import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type WorkspaceRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import {
  canRelease,
  canTransition,
  dualReleaseReady,
  fitsFloor,
  type DrawState,
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

export function createWorkspace(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO workspaces (id, name, created_by) VALUES (?, ?, ?)").run(
    id,
    name,
    userId,
  );
  db.prepare(
    "INSERT INTO workspace_members (workspace_id, user_id, role) VALUES (?, ?, 'treasurer')",
  ).run(id, userId);
  return { id, name };
}

export function addMember(
  db: DatabaseSync,
  workspaceId: string,
  userId: string,
  role: WorkspaceRole,
) {
  db.prepare(
    "INSERT INTO workspace_members (workspace_id, user_id, role) VALUES (?, ?, ?)",
  ).run(workspaceId, userId, role);
}

export function getRole(
  db: DatabaseSync,
  workspaceId: string,
  userId: string,
): WorkspaceRole | null {
  const row = db
    .prepare("SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?")
    .get(workspaceId, userId) as { role: WorkspaceRole } | undefined;
  return row?.role ?? null;
}

export function getWorkspace(db: DatabaseSync, id: string) {
  return db.prepare("SELECT id, name FROM workspaces WHERE id = ?").get(id) as
    | { id: string; name: string }
    | undefined;
}

export function assertAccess(
  db: DatabaseSync,
  workspaceId: string,
  userId: string,
  mode: "read" | "write" | "own" | "release",
): WorkspaceRole | null {
  const role = getRole(db, workspaceId, userId);
  if (!role) return null;
  if (mode === "read") return role;
  if (mode === "write" && (role === "treasurer" || role === "clerk")) return role;
  if (mode === "own" && role === "treasurer") return role;
  if (mode === "release" && canRelease(role)) return role;
  return null;
}

export function createBond(
  db: DatabaseSync,
  workspaceId: string,
  label: string,
  collateral: number,
  floor = 0,
) {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO bonds (id, workspace_id, label, collateral, floor) VALUES (?, ?, ?, ?, ?)`,
  ).run(id, workspaceId, label, collateral, floor);
  return { id, workspaceId, label, collateral, floor };
}

export function listBonds(db: DatabaseSync, workspaceId: string, limit: number, offset: number) {
  return db
    .prepare(
      `SELECT id, workspace_id AS workspaceId, label, collateral, floor
       FROM bonds WHERE workspace_id = ? ORDER BY label ASC LIMIT ? OFFSET ?`,
    )
    .all(workspaceId, limit, offset) as {
    id: string;
    workspaceId: string;
    label: string;
    collateral: number;
    floor: number;
  }[];
}

export function getBond(db: DatabaseSync, id: string) {
  return db
    .prepare(
      `SELECT id, workspace_id AS workspaceId, label, collateral, floor FROM bonds WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        workspaceId: string;
        label: string;
        collateral: number;
        floor: number;
      }
    | undefined;
}

function outstandingAmount(db: DatabaseSync, bondId: string): number {
  const row = db
    .prepare(
      `SELECT COALESCE(SUM(amount), 0) AS s FROM draws
       WHERE bond_id = ? AND state IN ('requested', 'held')`,
    )
    .get(bondId) as { s: number };
  return row.s;
}

export type Draw = {
  id: string;
  bondId: string;
  title: string;
  amount: number;
  state: DrawState;
  version: number;
  releaseCount: number;
};

function releaseCount(db: DatabaseSync, drawId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS c FROM draw_releases WHERE draw_id = ?")
    .get(drawId) as { c: number };
  return row.c;
}

export function getDraw(db: DatabaseSync, id: string): Draw | undefined {
  const row = db
    .prepare(
      `SELECT id, bond_id AS bondId, title, amount, state, version FROM draws WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        bondId: string;
        title: string;
        amount: number;
        state: string;
        version: number;
      }
    | undefined;
  if (!row) return undefined;
  return {
    id: row.id,
    bondId: row.bondId,
    title: row.title,
    amount: row.amount,
    state: row.state as DrawState,
    version: row.version,
    releaseCount: releaseCount(db, id),
  };
}

export function createDraw(
  db: DatabaseSync,
  bondId: string,
  title: string,
  amount: number,
): { ok: true; draw: Draw } | { ok: false; error: string } {
  const bond = getBond(db, bondId);
  if (!bond) return { ok: false, error: "bond not found" };
  const outstanding = outstandingAmount(db, bondId);
  if (!fitsFloor(amount, bond.collateral, bond.floor, outstanding)) {
    return { ok: false, error: "draw exceeds collateral floor headroom" };
  }
  const id = randomUUID();
  db.prepare(
    `INSERT INTO draws (id, bond_id, title, amount, state, version)
     VALUES (?, ?, ?, ?, 'requested', 1)`,
  ).run(id, bondId, title, amount);
  return { ok: true, draw: getDraw(db, id)! };
}

export function addRelease(
  db: DatabaseSync,
  drawId: string,
  treasurerId: string,
): { ok: true; releaseCount: number } | { ok: false; error: string; status: number } {
  const draw = getDraw(db, drawId);
  if (!draw) return { ok: false, error: "not found", status: 404 };
  if (draw.state !== "held") {
    return { ok: false, error: "releases only while held", status: 400 };
  }
  try {
    db.prepare(
      `INSERT INTO draw_releases (id, draw_id, treasurer_id) VALUES (?, ?, ?)`,
    ).run(randomUUID(), drawId, treasurerId);
  } catch {
    return { ok: false, error: "already released by this treasurer", status: 409 };
  }
  return { ok: true, releaseCount: releaseCount(db, drawId) };
}

export function transitionDraw(
  db: DatabaseSync,
  drawId: string,
  actorId: string,
  to: DrawState,
  version: number,
): { ok: true; draw: Draw } | { ok: false; error: string; status: number } {
  const draw = getDraw(db, drawId);
  if (!draw) return { ok: false, error: "not found", status: 404 };
  if (draw.version !== version) {
    return { ok: false, error: "version conflict", status: 409 };
  }
  if (!canTransition(draw.state, to)) {
    return { ok: false, error: "illegal transition", status: 400 };
  }
  if (to === "released" && !dualReleaseReady(draw.releaseCount)) {
    return { ok: false, error: "dual treasurer release required", status: 400 };
  }
  db.prepare("UPDATE draws SET state = ?, version = version + 1 WHERE id = ?").run(to, drawId);
  db.prepare(
    `INSERT INTO draw_audit (id, draw_id, actor_id, from_state, to_state)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), drawId, actorId, draw.state, to);
  return { ok: true, draw: getDraw(db, drawId)! };
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  drawId: string,
  payload: Record<string, unknown>,
) {
  db.prepare(
    `INSERT INTO webhook_deliveries (id, event, draw_id, payload) VALUES (?, ?, ?, ?)`,
  ).run(randomUUID(), event, drawId, JSON.stringify(payload));
}

export function workspaceIdForDraw(db: DatabaseSync, drawId: string): string | null {
  const draw = getDraw(db, drawId);
  if (!draw) return null;
  return getBond(db, draw.bondId)?.workspaceId ?? null;
}
