import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type BoardRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import {
  canTransition,
  weightedAverage,
  type Decision,
  type WorkflowState,
} from "./scoring.js";

export type Store = {
  db: DatabaseSync;
  dep: DepClient;
  webhookSecret: string;
  sideEffects: number;
  rateLimit: number;
  rateCounts: Map<string, number>;
};

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
    .prepare("SELECT user_id FROM tokens WHERE token = ?")
    .get(token) as { user_id: string } | undefined;
  return row?.user_id ?? null;
}

export function createBoard(
  db: DatabaseSync,
  userId: string,
  name: string,
): { id: string; name: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO boards (id, name, created_by) VALUES (?, ?, ?)").run(
    id,
    name,
    userId,
  );
  db.prepare(
    "INSERT INTO board_members (board_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, userId);
  return { id, name };
}

export function addBoardMember(
  db: DatabaseSync,
  boardId: string,
  userId: string,
  role: BoardRole,
): void {
  db.prepare(
    "INSERT INTO board_members (board_id, user_id, role) VALUES (?, ?, ?)",
  ).run(boardId, userId, role);
}

export function getBoardRole(
  db: DatabaseSync,
  boardId: string,
  userId: string,
): BoardRole | null {
  const row = db
    .prepare(
      "SELECT role FROM board_members WHERE board_id = ? AND user_id = ?",
    )
    .get(boardId, userId) as { role: BoardRole } | undefined;
  return row?.role ?? null;
}

export function getBoard(
  db: DatabaseSync,
  boardId: string,
): { id: string; name: string } | undefined {
  return db
    .prepare("SELECT id, name FROM boards WHERE id = ?")
    .get(boardId) as { id: string; name: string } | undefined;
}

function canWrite(role: BoardRole | null): boolean {
  return role === "owner" || role === "recruiter";
}

function canReview(role: BoardRole | null): boolean {
  return role === "owner" || role === "recruiter" || role === "reviewer";
}

export function createJob(
  db: DatabaseSync,
  boardId: string,
  title: string,
  description = "",
): { id: string; boardId: string; title: string; description: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO jobs (id, board_id, title, description) VALUES (?, ?, ?, ?)",
  ).run(id, boardId, title, description);
  return { id, boardId, title, description };
}

export function listJobs(
  db: DatabaseSync,
  boardId: string,
  limit: number,
  offset: number,
): { id: string; boardId: string; title: string; description: string }[] {
  return db
    .prepare(
      `SELECT id, board_id AS boardId, title, description
       FROM jobs WHERE board_id = ?
       ORDER BY title ASC LIMIT ? OFFSET ?`,
    )
    .all(boardId, limit, offset) as {
    id: string;
    boardId: string;
    title: string;
    description: string;
  }[];
}

export function getJob(
  db: DatabaseSync,
  jobId: string,
): { id: string; boardId: string; title: string; description: string } | undefined {
  return db
    .prepare(
      "SELECT id, board_id AS boardId, title, description FROM jobs WHERE id = ?",
    )
    .get(jobId) as
    | { id: string; boardId: string; title: string; description: string }
    | undefined;
}

export function createCandidate(
  db: DatabaseSync,
  boardId: string,
  name: string,
  email: string,
): { id: string; boardId: string; name: string; email: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO candidates (id, board_id, name, email) VALUES (?, ?, ?, ?)",
  ).run(id, boardId, name, email);
  return { id, boardId, name, email };
}

export function getCandidate(
  db: DatabaseSync,
  candidateId: string,
): { id: string; boardId: string; name: string; email: string } | undefined {
  return db
    .prepare(
      "SELECT id, board_id AS boardId, name, email FROM candidates WHERE id = ?",
    )
    .get(candidateId) as
    | { id: string; boardId: string; name: string; email: string }
    | undefined;
}

export type Application = {
  id: string;
  jobId: string;
  candidateId: string;
  state: WorkflowState;
  decision: Decision;
  version: number;
  scoreAverage: number | null;
};

function mapApplication(row: {
  id: string;
  jobId: string;
  candidateId: string;
  state: string;
  decision: string | null;
  version: number;
}): Application {
  return {
    id: row.id,
    jobId: row.jobId,
    candidateId: row.candidateId,
    state: row.state as WorkflowState,
    decision: (row.decision as Decision) ?? null,
    version: row.version,
    scoreAverage: null,
  };
}

export function createApplication(
  db: DatabaseSync,
  jobId: string,
  candidateId: string,
): Application {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO applications (id, job_id, candidate_id, state, version)
     VALUES (?, ?, ?, 'applied', 1)`,
  ).run(id, jobId, candidateId);
  return getApplication(db, id)!;
}

export function getApplication(
  db: DatabaseSync,
  applicationId: string,
): Application | undefined {
  const row = db
    .prepare(
      `SELECT id, job_id AS jobId, candidate_id AS candidateId, state, decision, version
       FROM applications WHERE id = ?`,
    )
    .get(applicationId) as
    | {
        id: string;
        jobId: string;
        candidateId: string;
        state: string;
        decision: string | null;
        version: number;
      }
    | undefined;
  if (!row) return undefined;
  const app = mapApplication(row);
  app.scoreAverage = computeScoreAverage(db, applicationId);
  return app;
}

export function listApplications(
  db: DatabaseSync,
  jobId: string,
  limit: number,
  offset: number,
): Application[] {
  const rows = db
    .prepare(
      `SELECT id, job_id AS jobId, candidate_id AS candidateId, state, decision, version
       FROM applications WHERE job_id = ?
       ORDER BY id ASC LIMIT ? OFFSET ?`,
    )
    .all(jobId, limit, offset) as {
    id: string;
    jobId: string;
    candidateId: string;
    state: string;
    decision: string | null;
    version: number;
  }[];
  return rows.map((r) => {
    const app = mapApplication(r);
    app.scoreAverage = computeScoreAverage(db, r.id);
    return app;
  });
}

export function addCriterion(
  db: DatabaseSync,
  jobId: string,
  label: string,
  weight = 1,
): { id: string; jobId: string; label: string; weight: number } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO criteria (id, job_id, label, weight) VALUES (?, ?, ?, ?)",
  ).run(id, jobId, label, weight);
  return { id, jobId, label, weight };
}

export function listCriteria(
  db: DatabaseSync,
  jobId: string,
): { id: string; jobId: string; label: string; weight: number }[] {
  return db
    .prepare(
      "SELECT id, job_id AS jobId, label, weight FROM criteria WHERE job_id = ? ORDER BY label",
    )
    .all(jobId) as { id: string; jobId: string; label: string; weight: number }[];
}

export function upsertScore(
  db: DatabaseSync,
  applicationId: string,
  criterionId: string,
  reviewerId: string,
  value: number,
): { id: string; value: number } {
  const existing = db
    .prepare(
      `SELECT id FROM scores
       WHERE application_id = ? AND criterion_id = ? AND reviewer_id = ?`,
    )
    .get(applicationId, criterionId, reviewerId) as { id: string } | undefined;
  if (existing) {
    db.prepare("UPDATE scores SET value = ? WHERE id = ?").run(value, existing.id);
    return { id: existing.id, value };
  }
  const id = randomUUID();
  db.prepare(
    `INSERT INTO scores (id, application_id, criterion_id, reviewer_id, value)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(id, applicationId, criterionId, reviewerId, value);
  return { id, value };
}

export function computeScoreAverage(
  db: DatabaseSync,
  applicationId: string,
): number | null {
  const rows = db
    .prepare(
      `SELECT c.weight AS weight, AVG(s.value) AS value
       FROM scores s
       JOIN criteria c ON c.id = s.criterion_id
       WHERE s.application_id = ?
       GROUP BY s.criterion_id, c.weight`,
    )
    .all(applicationId) as { weight: number; value: number }[];
  return weightedAverage(rows);
}

export function transitionApplication(
  db: DatabaseSync,
  applicationId: string,
  actorId: string,
  to: WorkflowState,
  version: number,
  decision: Decision = null,
): { ok: true; application: Application } | { ok: false; error: string; status: number } {
  const app = getApplication(db, applicationId);
  if (!app) return { ok: false, error: "not found", status: 404 };
  if (app.version !== version) {
    return { ok: false, error: "version conflict", status: 409 };
  }
  if (!canTransition(app.state, to)) {
    return { ok: false, error: "illegal transition", status: 400 };
  }
  if (to === "decided") {
    if (decision !== "hired" && decision !== "rejected") {
      return { ok: false, error: "decision required", status: 400 };
    }
  } else if (decision) {
    return { ok: false, error: "decision only on decided", status: 400 };
  }
  if (to === "screening" && listCriteria(db, app.jobId).length === 0) {
    return { ok: false, error: "criteria required before screening", status: 400 };
  }
  db.prepare(
    `UPDATE applications SET state = ?, decision = ?, version = version + 1 WHERE id = ?`,
  ).run(to, to === "decided" ? decision : null, applicationId);
  db.prepare(
    `INSERT INTO application_audit (id, application_id, actor_id, from_state, to_state)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), applicationId, actorId, app.state, to);
  return { ok: true, application: getApplication(db, applicationId)! };
}

export function listAudit(
  db: DatabaseSync,
  applicationId: string,
): { id: string; from: string; to: string; actorId: string; at: string }[] {
  return db
    .prepare(
      `SELECT id, from_state AS "from", to_state AS "to", actor_id AS actorId, at
       FROM application_audit WHERE application_id = ? ORDER BY at ASC`,
    )
    .all(applicationId) as {
    id: string;
    from: string;
    to: string;
    actorId: string;
    at: string;
  }[];
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  applicationId: string,
  payload: Record<string, unknown>,
): void {
  db.prepare(
    `INSERT INTO webhook_deliveries (id, event, application_id, payload)
     VALUES (?, ?, ?, ?)`,
  ).run(randomUUID(), event, applicationId, JSON.stringify(payload));
}

export function assertBoardAccess(
  db: DatabaseSync,
  boardId: string,
  userId: string,
  mode: "read" | "write" | "review",
): BoardRole | null {
  const role = getBoardRole(db, boardId, userId);
  if (!role) return null;
  if (mode === "write" && !canWrite(role)) return null;
  if (mode === "review" && !canReview(role)) return null;
  return role;
}

export function boardIdForJob(db: DatabaseSync, jobId: string): string | null {
  return getJob(db, jobId)?.boardId ?? null;
}

export function boardIdForApplication(
  db: DatabaseSync,
  applicationId: string,
): string | null {
  const app = getApplication(db, applicationId);
  if (!app) return null;
  return boardIdForJob(db, app.jobId);
}
