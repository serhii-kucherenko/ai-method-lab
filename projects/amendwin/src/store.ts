import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type StudyRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import {
  canPublish,
  scoreVisit,
  type Classification,
  type ProtocolVersion,
  type Window,
} from "./window.js";
import { canTransition, type VisitLockState } from "./rules.js";

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

type WriteResult<T> = { ok: true; value: T } | { ok: false; status: number; error: string };

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

export function createStudy(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO studies (id, name, created_by, important_codes_json) VALUES (?, ?, ?, '[]')",
  ).run(id, name, userId);
  db.prepare("INSERT INTO study_members (study_id, user_id, role) VALUES (?, ?, 'cra')").run(
    id,
    userId,
  );
  return { id, name };
}

export function addMember(db: DatabaseSync, studyId: string, userId: string, role: StudyRole) {
  db.prepare(
    `INSERT INTO study_members (study_id, user_id, role) VALUES (?, ?, ?)
     ON CONFLICT(study_id, user_id) DO UPDATE SET role = excluded.role`,
  ).run(studyId, userId, role);
}

export function getRole(db: DatabaseSync, studyId: string, userId: string): StudyRole | null {
  const row = db
    .prepare("SELECT role FROM study_members WHERE study_id = ? AND user_id = ?")
    .get(studyId, userId) as { role: StudyRole } | undefined;
  return row?.role ?? null;
}

export function getStudy(db: DatabaseSync, id: string) {
  return db
    .prepare("SELECT id, name, important_codes_json AS importantCodesJson FROM studies WHERE id = ?")
    .get(id) as { id: string; name: string; importantCodesJson: string } | undefined;
}

export function assertAccess(
  db: DatabaseSync,
  studyId: string,
  userId: string,
  mode: "read" | "write" | "publish" | "lock",
): StudyRole | null {
  const role = getRole(db, studyId, userId);
  if (!role) return null;
  if (mode === "read") return role;
  if (mode === "write" && (role === "cra" || role === "cdm")) return role;
  if (mode === "publish" && role === "sponsor") return role;
  if (mode === "lock" && (role === "cdm" || role === "sponsor")) return role;
  return null;
}

export function setImportantCodes(db: DatabaseSync, studyId: string, codes: string[]) {
  db.prepare("UPDATE studies SET important_codes_json = ? WHERE id = ?").run(
    JSON.stringify(codes),
    studyId,
  );
}

export function listVersions(db: DatabaseSync, studyId: string): ProtocolVersion[] {
  return (
    db
      .prepare(
        `SELECT id, effective_at AS effective_at, visits_json AS visitsJson
         FROM protocol_versions WHERE study_id = ?`,
      )
      .all(studyId) as Array<{ id: string; effective_at: string; visitsJson: string }>
  ).map((r) => ({
    id: r.id,
    effective_at: r.effective_at,
    visits: JSON.parse(r.visitsJson) as Record<string, Window>,
  }));
}

export function publishVersion(
  db: DatabaseSync,
  studyId: string,
  version: ProtocolVersion,
): WriteResult<ProtocolVersion> {
  const existing = listVersions(db, studyId);
  if (!canPublish(existing, version)) {
    return { ok: false, status: 409, error: "reject_unordered_effective" };
  }
  if (existing.some((v) => v.id === version.id)) {
    return { ok: false, status: 409, error: "version id exists" };
  }
  db.prepare(
    `INSERT INTO protocol_versions (study_id, id, effective_at, visits_json) VALUES (?, ?, ?, ?)`,
  ).run(studyId, version.id, version.effective_at, JSON.stringify(version.visits));
  return { ok: true, value: version };
}

export function createSubject(db: DatabaseSync, studyId: string, enrollment: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO subjects (id, study_id, enrollment) VALUES (?, ?, ?)").run(
    id,
    studyId,
    enrollment,
  );
  return { id, studyId, enrollment };
}

export function getSubject(db: DatabaseSync, id: string) {
  return db
    .prepare("SELECT id, study_id AS studyId, enrollment FROM subjects WHERE id = ?")
    .get(id) as { id: string; studyId: string; enrollment: string } | undefined;
}

export function recordVisit(
  db: DatabaseSync,
  studyId: string,
  subjectId: string,
  code: string,
  actual: string | null,
  asOfMissed?: string,
): WriteResult<{
  id: string;
  classification: Classification;
  version_id: string;
  important: boolean;
}> {
  const subject = getSubject(db, subjectId);
  if (!subject || subject.studyId !== studyId) {
    return { ok: false, status: 404, error: "subject not found" };
  }
  const study = getStudy(db, studyId)!;
  const importantCodes = JSON.parse(study.importantCodesJson) as string[];
  const versions = listVersions(db, studyId);
  if (!versions.length) return { ok: false, status: 400, error: "no protocol versions" };
  let scored;
  try {
    scored = scoreVisit(
      versions,
      { id: subject.id, enrollment: subject.enrollment },
      { code, actual, locked: false },
      importantCodes,
      asOfMissed,
    );
  } catch (err) {
    return { ok: false, status: 400, error: err instanceof Error ? err.message : String(err) };
  }
  const id = randomUUID();
  db.prepare(
    `INSERT INTO visits (id, study_id, subject_id, code, actual, locked, scored_version_id, classification, important)
     VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?)`,
  ).run(
    id,
    studyId,
    subjectId,
    code,
    actual,
    scored.version_id,
    scored.classification,
    scored.important ? 1 : 0,
  );
  return {
    ok: true,
    value: {
      id,
      classification: scored.classification,
      version_id: scored.version_id,
      important: scored.important,
    },
  };
}

export function lockVisit(
  db: DatabaseSync,
  visitId: string,
  actorId: string,
  expectedVersion: number,
): WriteResult<{ id: string; version: number; state: VisitLockState }> {
  const row = db
    .prepare("SELECT id, locked, version FROM visits WHERE id = ?")
    .get(visitId) as { id: string; locked: number; version: number } | undefined;
  if (!row) return { ok: false, status: 404, error: "not found" };
  if (row.version !== expectedVersion) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const from: VisitLockState = row.locked ? "locked" : "open";
  if (!canTransition(from, "locked")) {
    return { ok: false, status: 400, error: "illegal transition" };
  }
  const updated = db
    .prepare("UPDATE visits SET locked = 1, version = version + 1 WHERE id = ? AND version = ?")
    .run(visitId, expectedVersion);
  if (Number(updated.changes) !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  db.prepare(
    `INSERT INTO visit_audit (id, visit_id, actor_id, from_state, to_state) VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), visitId, actorId, from, "locked");
  return { ok: true, value: { id: visitId, version: expectedVersion + 1, state: "locked" } };
}

export function listVisitAudit(db: DatabaseSync, visitId: string) {
  return db
    .prepare(
      `SELECT id, actor_id AS actorId, from_state AS fromState, to_state AS toState, at
       FROM visit_audit WHERE visit_id = ? ORDER BY at`,
    )
    .all(visitId) as Array<{
    id: string;
    actorId: string;
    fromState: string;
    toState: string;
    at: string;
  }>;
}

export function getVisit(db: DatabaseSync, id: string) {
  return db
    .prepare(
      `SELECT id, study_id AS studyId, subject_id AS subjectId, code, actual, locked, version,
              scored_version_id AS scoredVersionId, classification, important
       FROM visits WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        studyId: string;
        subjectId: string;
        code: string;
        actual: string | null;
        locked: number;
        version: number;
        scoredVersionId: string | null;
        classification: string | null;
        important: number;
      }
    | undefined;
}

export function listImportant(
  db: DatabaseSync,
  studyId: string,
  limit: number,
  offset: number,
) {
  return db
    .prepare(
      `SELECT id, subject_id AS subjectId, code, classification, scored_version_id AS versionId
       FROM visits WHERE study_id = ? AND important = 1
       ORDER BY code, id LIMIT ? OFFSET ?`,
    )
    .all(studyId, limit, offset) as Array<{
    id: string;
    subjectId: string;
    code: string;
    classification: string;
    versionId: string;
  }>;
}

export function countImportant(db: DatabaseSync, studyId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS n FROM visits WHERE study_id = ? AND important = 1")
    .get(studyId) as { n: number };
  return Number(row.n);
}

export function listSubjects(
  db: DatabaseSync,
  studyId: string,
  limit: number,
  offset: number,
) {
  return db
    .prepare(
      `SELECT id, enrollment FROM subjects WHERE study_id = ?
       ORDER BY enrollment, id LIMIT ? OFFSET ?`,
    )
    .all(studyId, limit, offset) as Array<{ id: string; enrollment: string }>;
}

export function countSubjects(db: DatabaseSync, studyId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS n FROM subjects WHERE study_id = ?")
    .get(studyId) as { n: number };
  return Number(row.n);
}

export function listVisits(db: DatabaseSync, studyId: string, limit: number, offset: number) {
  return db
    .prepare(
      `SELECT id, subject_id AS subjectId, code, actual, locked, classification, important
       FROM visits WHERE study_id = ?
       ORDER BY code, id LIMIT ? OFFSET ?`,
    )
    .all(studyId, limit, offset) as Array<{
    id: string;
    subjectId: string;
    code: string;
    actual: string | null;
    locked: number;
    classification: string | null;
    important: number;
  }>;
}

export function countVisits(db: DatabaseSync, studyId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS n FROM visits WHERE study_id = ?")
    .get(studyId) as { n: number };
  return Number(row.n);
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  studyId: string,
  payload: Record<string, unknown>,
): void {
  db.prepare(
    "INSERT INTO webhook_deliveries (id, event, study_id, payload) VALUES (?, ?, ?, ?)",
  ).run(randomUUID(), event, studyId, JSON.stringify(payload));
}
