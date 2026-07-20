import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "planned" | "prepped" | "served" | "discarded";

export type Meal = {
  id: string;
  userId: string;
  title: string;
  body: string;
  status: WorkflowState;
  state: WorkflowState;
  version: number;
};

export type AuditEntry = {
  id: string;
  mealId: string;
  actorId: string;
  from: WorkflowState;
  to: WorkflowState;
  at: string;
};

export type Store = {
  db: DatabaseSync;
  dep: DepClient;
  webhookSecret: string;
  sideEffects: number;
  rateLimit: number;
  rateCounts: Map<string, number>;
};

const LEGAL: Record<WorkflowState, WorkflowState[]> = {
  planned: ["prepped", "discarded"],
  prepped: ["served"],
  served: [],
  discarded: ["planned"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "planned" ||
    value === "prepped" ||
    value === "served" ||
    value === "discarded"
  );
}

export type CreateStoreOptions = {
  dbPath?: string;
  dep?: DepClient;
  webhookSecret?: string;
  rateLimit?: number;
};

export function createStore(opts: CreateStoreOptions | string = {}): Store {
  const normalized = typeof opts === "string" ? { dbPath: opts } : opts;
  return {
    db: openDatabase(normalized.dbPath ?? ":memory:"),
    dep: normalized.dep ?? createMockDep(),
    webhookSecret: normalized.webhookSecret ?? "whsec_test",
    sideEffects: 0,
    rateLimit: normalized.rateLimit ?? 1000,
    rateCounts: new Map(),
  };
}

export function registerUser(
  db: DatabaseSync,
  email: string,
  password: string,
): { id: string; email: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO users (id, email, password) VALUES (?, ?, ?)").run(
    id,
    email,
    password,
  );
  return { id, email };
}

export function findUserByEmail(
  db: DatabaseSync,
  email: string,
): { id: string; email: string; password: string } | undefined {
  return db
    .prepare("SELECT id, email, password FROM users WHERE email = ?")
    .get(email) as { id: string; email: string; password: string } | undefined;
}

export function issueToken(db: DatabaseSync, userId: string): string {
  const token = randomUUID();
  db.prepare("INSERT INTO tokens (token, user_id) VALUES (?, ?)").run(token, userId);
  return token;
}

export function resolveToken(db: DatabaseSync, token: string): string | null {
  const row = db
    .prepare("SELECT user_id AS userId FROM tokens WHERE token = ?")
    .get(token) as { userId: string } | undefined;
  return row?.userId ?? null;
}

function mapMeal(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Meal {
  const state = isState(row.status) ? row.status : "planned";
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    body: row.body,
    status: state,
    state,
    version: row.version,
  };
}

export function createMeal(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Meal {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO meals (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'planned', 1)",
  ).run(id, userId, title, body);
  return getMeal(db, id)!;
}

export function listMeals(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { meals: Meal[]; nextCursor: string | null; limit: number } {
  const DEFAULT_LIMIT = 20;
  const MAX_LIMIT = 50;
  let limit = opts.limit ?? DEFAULT_LIMIT;
  if (!Number.isFinite(limit) || limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;
  const cursor = opts.cursor ?? null;
  const rows = (
    cursor
      ? db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM meals WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM meals WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapMeal>[0]>;
  const meals = rows.map(mapMeal);
  const nextCursor =
    meals.length === limit ? meals[meals.length - 1]!.id : null;
  return { meals, nextCursor, limit };
}

export function seedMeals(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO meals (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'planned', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `meal_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Kitchen ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getMeal(db: DatabaseSync, id: string): Meal | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM meals WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapMeal>[0] | undefined;
  return row ? mapMeal(row) : undefined;
}

export function updateMeal(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Meal | undefined {
  const existing = getMeal(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE meals SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getMeal(db, id);
}

export type TransitionResult =
  | { ok: true; request: Meal }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionMeal(
  db: DatabaseSync,
  mealId: string,
  userId: string,
  to: unknown,
  version: unknown,
): TransitionResult {
  if (typeof version !== "number") {
    return { ok: false, status: 400, error: "version required" };
  }
  if (!isState(to)) {
    return { ok: false, status: 400, error: "invalid target state" };
  }
  const existing = getMeal(db, mealId);
  if (!existing || existing.userId !== userId) {
    return { ok: false, status: 404, error: "not found" };
  }
  if (!LEGAL[existing.state].includes(to)) {
    return {
      ok: false,
      status: 409,
      error: `illegal transition from ${existing.state} to ${to}`,
    };
  }
  if (version !== existing.version) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const result = db
    .prepare(
      "UPDATE meals SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, mealId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO meal_audit (id, meal_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), mealId, userId, existing.state, to, at);
  const updated = getMeal(db, mealId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listMealAudit(
  db: DatabaseSync,
  mealId: string,
  userId: string,
): AuditEntry[] | null {
  const meal = getMeal(db, mealId);
  if (!meal || meal.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, meal_id AS mealId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM meal_audit WHERE meal_id = ? ORDER BY at ASC`,
    )
    .all(mealId) as AuditEntry[];
}

export function deleteMeal(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM meals WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, kitchenId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM kitchen_members WHERE kitchen_id = ? AND user_id = ?")
    .get(kitchenId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createKitchen(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO kitchens (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO kitchen_members (kitchen_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getKitchen(
  db: DatabaseSync,
  kitchenId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM kitchens WHERE id = ?")
    .get(kitchenId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addKitchenMember(
  db: DatabaseSync,
  kitchenId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO kitchen_members (kitchen_id, user_id, role) VALUES (?, ?, ?)",
  ).run(kitchenId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  kitchenId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; kitchenId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, kitchen_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, kitchenId, title, notes, createdBy);
  return { id, kitchenId, title, notes };
}

export function getTaskKitchenId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT kitchen_id AS kitchenId FROM tasks WHERE id = ?")
    .get(taskId) as { kitchenId: string } | undefined;
  return row?.kitchenId ?? null;
}

export function createComment(
  db: DatabaseSync,
  taskId: string,
  authorId: string,
  body: string,
): { id: string; taskId: string; authorId: string; body: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO comments (id, task_id, author_id, body) VALUES (?, ?, ?, ?)",
  ).run(id, taskId, authorId, body);
  return { id, taskId, authorId, body };
}
