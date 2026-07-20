import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type ProgramRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import {
  canSignOff,
  canTransitionApp,
  canTransitionMilestone,
  closeReady,
  milestoneBudgetAllowed,
  signOffReady,
  type ApplicationState,
  type MilestoneState,
} from "./rules.js";

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

export function registerUser(db: DatabaseSync, email: string, password: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO users (id, email, password) VALUES (?, ?, ?)").run(
    id,
    email,
    password,
  );
  return { id, email };
}

export function findUserByEmail(db: DatabaseSync, email: string) {
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

export function createProgram(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO programs (id, name, created_by) VALUES (?, ?, ?)").run(
    id,
    name,
    userId,
  );
  db.prepare(
    "INSERT INTO program_members (program_id, user_id, role) VALUES (?, ?, 'admin')",
  ).run(id, userId);
  return { id, name };
}

export function addProgramMember(
  db: DatabaseSync,
  programId: string,
  userId: string,
  role: ProgramRole,
): void {
  db.prepare(
    "INSERT INTO program_members (program_id, user_id, role) VALUES (?, ?, ?)",
  ).run(programId, userId, role);
}

export function getProgramRole(
  db: DatabaseSync,
  programId: string,
  userId: string,
): ProgramRole | null {
  const row = db
    .prepare("SELECT role FROM program_members WHERE program_id = ? AND user_id = ?")
    .get(programId, userId) as { role: ProgramRole } | undefined;
  return row?.role ?? null;
}

export function getProgram(db: DatabaseSync, programId: string) {
  return db
    .prepare("SELECT id, name FROM programs WHERE id = ?")
    .get(programId) as { id: string; name: string } | undefined;
}

function canWrite(role: ProgramRole | null): boolean {
  return role === "admin" || role === "officer";
}

function canRead(role: ProgramRole | null): boolean {
  return role === "admin" || role === "officer" || role === "reviewer";
}

export function assertProgramAccess(
  db: DatabaseSync,
  programId: string,
  userId: string,
  mode: "read" | "write",
): ProgramRole | null {
  const role = getProgramRole(db, programId, userId);
  if (!role) return null;
  if (mode === "write" && !canWrite(role)) return null;
  if (mode === "read" && !canRead(role)) return null;
  return role;
}

export type Application = {
  id: string;
  programId: string;
  orgName: string;
  amountRequested: number;
  approvedAmount: number | null;
  state: ApplicationState;
  paidTotal: number;
  version: number;
  signOffCount: number;
};

function mapApplication(row: {
  id: string;
  programId: string;
  orgName: string;
  amountRequested: number;
  approvedAmount: number | null;
  state: string;
  paidTotal: number;
  version: number;
}): Application {
  return {
    id: row.id,
    programId: row.programId,
    orgName: row.orgName,
    amountRequested: row.amountRequested,
    approvedAmount: row.approvedAmount,
    state: row.state as ApplicationState,
    paidTotal: row.paidTotal,
    version: row.version,
    signOffCount: 0,
  };
}

export function signOffCount(db: DatabaseSync, applicationId: string): number {
  const row = db
    .prepare(
      `SELECT COUNT(*) AS c FROM application_signoffs s
       JOIN program_members pm ON pm.user_id = s.user_id
       JOIN applications a ON a.id = s.application_id AND pm.program_id = a.program_id
       WHERE s.application_id = ? AND pm.role IN ('admin', 'reviewer')`,
    )
    .get(applicationId) as { c: number };
  return Number(row.c);
}

export function createApplication(
  db: DatabaseSync,
  programId: string,
  orgName: string,
  amountRequested: number,
): Application {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO applications (id, program_id, org_name, amount_requested, state, version)
     VALUES (?, ?, ?, ?, 'submitted', 1)`,
  ).run(id, programId, orgName, amountRequested);
  return getApplication(db, id)!;
}

export function getApplication(db: DatabaseSync, applicationId: string): Application | undefined {
  const row = db
    .prepare(
      `SELECT id, program_id AS programId, org_name AS orgName,
              amount_requested AS amountRequested, approved_amount AS approvedAmount,
              state, paid_total AS paidTotal, version
       FROM applications WHERE id = ?`,
    )
    .get(applicationId) as
    | {
        id: string;
        programId: string;
        orgName: string;
        amountRequested: number;
        approvedAmount: number | null;
        state: string;
        paidTotal: number;
        version: number;
      }
    | undefined;
  if (!row) return undefined;
  const app = mapApplication(row);
  app.signOffCount = signOffCount(db, applicationId);
  return app;
}

export function listApplications(
  db: DatabaseSync,
  programId: string,
  limit: number,
  offset: number,
): Application[] {
  const rows = db
    .prepare(
      `SELECT id, program_id AS programId, org_name AS orgName,
              amount_requested AS amountRequested, approved_amount AS approvedAmount,
              state, paid_total AS paidTotal, version
       FROM applications WHERE program_id = ?
       ORDER BY org_name ASC LIMIT ? OFFSET ?`,
    )
    .all(programId, limit, offset) as {
    id: string;
    programId: string;
    orgName: string;
    amountRequested: number;
    approvedAmount: number | null;
    state: string;
    paidTotal: number;
    version: number;
  }[];
  return rows.map((r) => {
    const app = mapApplication(r);
    app.signOffCount = signOffCount(db, r.id);
    return app;
  });
}

export function addSignOff(
  db: DatabaseSync,
  applicationId: string,
  userId: string,
): { ok: true } | { ok: false; error: string; status: number } {
  const app = getApplication(db, applicationId);
  if (!app) return { ok: false, error: "not found", status: 404 };
  if (app.state !== "submitted") {
    return { ok: false, error: "sign-off only on submitted applications", status: 400 };
  }
  const role = getProgramRole(db, app.programId, userId);
  if (!role || !canSignOff(role)) {
    return { ok: false, error: "forbidden", status: 403 };
  }
  const existing = db
    .prepare(
      "SELECT 1 FROM application_signoffs WHERE application_id = ? AND user_id = ?",
    )
    .get(applicationId, userId);
  if (existing) return { ok: true };
  db.prepare(
    "INSERT INTO application_signoffs (application_id, user_id) VALUES (?, ?)",
  ).run(applicationId, userId);
  return { ok: true };
}

export function activateApplication(
  db: DatabaseSync,
  applicationId: string,
  actorId: string,
  approvedAmount: number,
  version: number,
): { ok: true; application: Application } | { ok: false; error: string; status: number } {
  const app = getApplication(db, applicationId);
  if (!app) return { ok: false, error: "not found", status: 404 };
  if (app.version !== version) {
    return { ok: false, error: "version conflict", status: 409 };
  }
  if (!canTransitionApp(app.state, "active")) {
    return { ok: false, error: "illegal transition", status: 400 };
  }
  if (!signOffReady(app.signOffCount)) {
    return { ok: false, error: "dual reviewer sign-off required", status: 400 };
  }
  if (approvedAmount <= 0) {
    return { ok: false, error: "approved amount required", status: 400 };
  }
  db.prepare(
    `UPDATE applications SET state = 'active', approved_amount = ?, version = version + 1
     WHERE id = ?`,
  ).run(approvedAmount, applicationId);
  db.prepare(
    `INSERT INTO application_audit (id, application_id, actor_id, action, detail)
     VALUES (?, ?, ?, 'activate', ?)`,
  ).run(randomUUID(), applicationId, actorId, String(approvedAmount));
  return { ok: true, application: getApplication(db, applicationId)! };
}

export type Milestone = {
  id: string;
  applicationId: string;
  label: string;
  amount: number;
  state: MilestoneState;
};

export function createMilestone(
  db: DatabaseSync,
  applicationId: string,
  label: string,
  amount: number,
): Milestone | undefined {
  const app = getApplication(db, applicationId);
  if (!app || app.state !== "active") return undefined;
  const id = randomUUID();
  db.prepare(
    `INSERT INTO milestones (id, application_id, label, amount, state)
     VALUES (?, ?, ?, ?, 'planned')`,
  ).run(id, applicationId, label, amount);
  return getMilestone(db, id);
}

export function getMilestone(db: DatabaseSync, milestoneId: string): Milestone | undefined {
  const row = db
    .prepare(
      `SELECT id, application_id AS applicationId, label, amount, state
       FROM milestones WHERE id = ?`,
    )
    .get(milestoneId) as
    | {
        id: string;
        applicationId: string;
        label: string;
        amount: number;
        state: string;
      }
    | undefined;
  if (!row) return undefined;
  return { ...row, state: row.state as MilestoneState };
}

export function listMilestones(db: DatabaseSync, applicationId: string): Milestone[] {
  const rows = db
    .prepare(
      `SELECT id, application_id AS applicationId, label, amount, state
       FROM milestones WHERE application_id = ? ORDER BY label ASC`,
    )
    .all(applicationId) as {
    id: string;
    applicationId: string;
    label: string;
    amount: number;
    state: string;
  }[];
  return rows.map((r) => ({ ...r, state: r.state as MilestoneState }));
}

export function payMilestone(
  db: DatabaseSync,
  milestoneId: string,
  actorId: string,
): { ok: true; milestone: Milestone; application: Application } | {
  ok: false;
  error: string;
  status: number;
} {
  const milestone = getMilestone(db, milestoneId);
  if (!milestone) return { ok: false, error: "not found", status: 404 };
  const app = getApplication(db, milestone.applicationId);
  if (!app || app.state !== "active") {
    return { ok: false, error: "application not active", status: 400 };
  }
  if (!canTransitionMilestone(milestone.state, "paid")) {
    return { ok: false, error: "illegal milestone transition", status: 400 };
  }
  if (!milestoneBudgetAllowed(app.paidTotal, milestone.amount, app.approvedAmount)) {
    return { ok: false, error: "milestone exceeds approved budget", status: 400 };
  }
  db.prepare("UPDATE milestones SET state = 'paid' WHERE id = ?").run(milestoneId);
  db.prepare(
    "UPDATE applications SET paid_total = paid_total + ? WHERE id = ?",
  ).run(milestone.amount, milestone.applicationId);
  db.prepare(
    `INSERT INTO application_audit (id, application_id, actor_id, action, detail)
     VALUES (?, ?, ?, 'milestone.paid', ?)`,
  ).run(randomUUID(), milestone.applicationId, actorId, milestoneId);
  return {
    ok: true,
    milestone: getMilestone(db, milestoneId)!,
    application: getApplication(db, milestone.applicationId)!,
  };
}

export function waiveMilestone(
  db: DatabaseSync,
  milestoneId: string,
  actorId: string,
): { ok: true; milestone: Milestone } | { ok: false; error: string; status: number } {
  const milestone = getMilestone(db, milestoneId);
  if (!milestone) return { ok: false, error: "not found", status: 404 };
  const app = getApplication(db, milestone.applicationId);
  if (!app || app.state !== "active") {
    return { ok: false, error: "application not active", status: 400 };
  }
  if (!canTransitionMilestone(milestone.state, "waived")) {
    return { ok: false, error: "illegal milestone transition", status: 400 };
  }
  db.prepare("UPDATE milestones SET state = 'waived' WHERE id = ?").run(milestoneId);
  db.prepare(
    `INSERT INTO application_audit (id, application_id, actor_id, action, detail)
     VALUES (?, ?, ?, 'milestone.waived', ?)`,
  ).run(randomUUID(), milestone.applicationId, actorId, milestoneId);
  return { ok: true, milestone: getMilestone(db, milestoneId)! };
}

export function clawbackMilestone(
  db: DatabaseSync,
  milestoneId: string,
  actorId: string,
): { ok: true; milestone: Milestone; application: Application } | {
  ok: false;
  error: string;
  status: number;
} {
  const milestone = getMilestone(db, milestoneId);
  if (!milestone) return { ok: false, error: "not found", status: 404 };
  const app = getApplication(db, milestone.applicationId);
  if (!app || app.state !== "active") {
    return { ok: false, error: "clawback only on active applications", status: 400 };
  }
  if (!canTransitionMilestone(milestone.state, "clawed_back")) {
    return { ok: false, error: "milestone must be paid to claw back", status: 400 };
  }
  db.prepare("UPDATE milestones SET state = 'clawed_back' WHERE id = ?").run(milestoneId);
  db.prepare(
    "UPDATE applications SET paid_total = paid_total - ? WHERE id = ?",
  ).run(milestone.amount, milestone.applicationId);
  db.prepare(
    `INSERT INTO application_audit (id, application_id, actor_id, action, detail)
     VALUES (?, ?, ?, 'milestone.clawback', ?)`,
  ).run(randomUUID(), milestone.applicationId, actorId, milestoneId);
  return {
    ok: true,
    milestone: getMilestone(db, milestoneId)!,
    application: getApplication(db, milestone.applicationId)!,
  };
}

export function closeApplication(
  db: DatabaseSync,
  applicationId: string,
  actorId: string,
  version: number,
): { ok: true; application: Application } | { ok: false; error: string; status: number } {
  const app = getApplication(db, applicationId);
  if (!app) return { ok: false, error: "not found", status: 404 };
  if (app.version !== version) {
    return { ok: false, error: "version conflict", status: 409 };
  }
  if (!canTransitionApp(app.state, "closed")) {
    return { ok: false, error: "illegal transition", status: 400 };
  }
  const milestones = listMilestones(db, applicationId);
  if (!closeReady(milestones.map((m) => m.state))) {
    return { ok: false, error: "all milestones must be paid or waived", status: 400 };
  }
  db.prepare(
    "UPDATE applications SET state = 'closed', version = version + 1 WHERE id = ?",
  ).run(applicationId);
  db.prepare(
    `INSERT INTO application_audit (id, application_id, actor_id, action)
     VALUES (?, ?, ?, 'close')`,
  ).run(randomUUID(), applicationId, actorId);
  return { ok: true, application: getApplication(db, applicationId)! };
}

export function listAudit(db: DatabaseSync, applicationId: string) {
  return db
    .prepare(
      `SELECT id, action, detail, actor_id AS actorId, at
       FROM application_audit WHERE application_id = ? ORDER BY at ASC`,
    )
    .all(applicationId) as {
    id: string;
    action: string;
    detail: string | null;
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

export function programIdForApplication(db: DatabaseSync, applicationId: string): string | null {
  return getApplication(db, applicationId)?.programId ?? null;
}
