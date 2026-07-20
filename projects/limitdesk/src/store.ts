import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type DeskRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import {
  canRelease,
  canTransition,
  dualReleaseReady,
  fitsCeiling,
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

export function createDesk(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO desks (id, name, created_by) VALUES (?, ?, ?)").run(id, name, userId);
  db.prepare(
    "INSERT INTO desk_members (desk_id, user_id, role) VALUES (?, ?, 'credit_officer')",
  ).run(id, userId);
  return { id, name };
}

export function addMember(db: DatabaseSync, deskId: string, userId: string, role: DeskRole) {
  db.prepare("INSERT INTO desk_members (desk_id, user_id, role) VALUES (?, ?, ?)").run(
    deskId,
    userId,
    role,
  );
}

export function getRole(db: DatabaseSync, deskId: string, userId: string): DeskRole | null {
  const row = db
    .prepare("SELECT role FROM desk_members WHERE desk_id = ? AND user_id = ?")
    .get(deskId, userId) as { role: DeskRole } | undefined;
  return row?.role ?? null;
}

export function getDesk(db: DatabaseSync, id: string) {
  return db.prepare("SELECT id, name FROM desks WHERE id = ?").get(id) as
    | { id: string; name: string }
    | undefined;
}

export function assertAccess(
  db: DatabaseSync,
  deskId: string,
  userId: string,
  mode: "read" | "write" | "own" | "release",
): DeskRole | null {
  const role = getRole(db, deskId, userId);
  if (!role) return null;
  if (mode === "read") return role;
  if (mode === "write" && (role === "credit_officer" || role === "analyst")) return role;
  if (mode === "own" && role === "credit_officer") return role;
  if (mode === "release" && canRelease(role)) return role;
  return null;
}

export function createLine(db: DatabaseSync, deskId: string, label: string, ceiling: number) {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO credit_lines (id, desk_id, label, ceiling) VALUES (?, ?, ?, ?)`,
  ).run(id, deskId, label, ceiling);
  return { id, deskId, label, ceiling };
}

export function listLines(db: DatabaseSync, deskId: string, limit: number, offset: number) {
  return db
    .prepare(
      `SELECT id, desk_id AS deskId, label, ceiling
       FROM credit_lines WHERE desk_id = ? ORDER BY label ASC LIMIT ? OFFSET ?`,
    )
    .all(deskId, limit, offset) as {
    id: string;
    deskId: string;
    label: string;
    ceiling: number;
  }[];
}

export function getLine(db: DatabaseSync, id: string) {
  return db
    .prepare(
      `SELECT id, desk_id AS deskId, label, ceiling FROM credit_lines WHERE id = ?`,
    )
    .get(id) as
    | { id: string; deskId: string; label: string; ceiling: number }
    | undefined;
}

function outstandingAmount(db: DatabaseSync, lineId: string): number {
  const row = db
    .prepare(
      `SELECT COALESCE(SUM(amount), 0) AS s FROM draws
       WHERE line_id = ? AND state IN ('requested', 'held')`,
    )
    .get(lineId) as { s: number };
  return row.s;
}

export type Draw = {
  id: string;
  lineId: string;
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
      `SELECT id, line_id AS lineId, title, amount, state, version FROM draws WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        lineId: string;
        title: string;
        amount: number;
        state: string;
        version: number;
      }
    | undefined;
  if (!row) return undefined;
  return {
    id: row.id,
    lineId: row.lineId,
    title: row.title,
    amount: row.amount,
    state: row.state as DrawState,
    version: row.version,
    releaseCount: releaseCount(db, id),
  };
}

export function createDraw(
  db: DatabaseSync,
  lineId: string,
  title: string,
  amount: number,
): { ok: true; draw: Draw } | { ok: false; error: string } {
  const line = getLine(db, lineId);
  if (!line) return { ok: false, error: "line not found" };
  const outstanding = outstandingAmount(db, lineId);
  if (!fitsCeiling(amount, line.ceiling, outstanding)) {
    return { ok: false, error: "draw exceeds credit ceiling" };
  }
  const id = randomUUID();
  db.prepare(
    `INSERT INTO draws (id, line_id, title, amount, state, version)
     VALUES (?, ?, ?, ?, 'requested', 1)`,
  ).run(id, lineId, title, amount);
  return { ok: true, draw: getDraw(db, id)! };
}

export function addRelease(
  db: DatabaseSync,
  drawId: string,
  officerId: string,
): { ok: true; releaseCount: number } | { ok: false; error: string; status: number } {
  const draw = getDraw(db, drawId);
  if (!draw) return { ok: false, error: "not found", status: 404 };
  if (draw.state !== "held") {
    return { ok: false, error: "releases only while held", status: 400 };
  }
  try {
    db.prepare(
      `INSERT INTO draw_releases (id, draw_id, officer_id) VALUES (?, ?, ?)`,
    ).run(randomUUID(), drawId, officerId);
  } catch {
    return { ok: false, error: "already released by this officer", status: 409 };
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
    return { ok: false, error: "dual credit officer release required", status: 400 };
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

export function deskIdForDraw(db: DatabaseSync, drawId: string): string | null {
  const draw = getDraw(db, drawId);
  if (!draw) return null;
  return getLine(db, draw.lineId)?.deskId ?? null;
}
