import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type OrgRole } from "./db.js";
import { recover, type ClaimLineInput, type RecoverResult } from "./domain/recover.js";

export type Store = {
  db: DatabaseSync;
};

export function createStore(opts: { dbPath?: string } = {}): Store {
  return { db: openDatabase(opts.dbPath ?? ":memory:") };
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

export function createOrg(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO orgs (id, name, created_by) VALUES (?, ?, ?)").run(id, name, userId);
  db.prepare(
    "INSERT INTO org_members (org_id, user_id, role) VALUES (?, ?, 'admin')",
  ).run(id, userId);
  return { id, name };
}

export function getOrg(db: DatabaseSync, id: string) {
  return db.prepare("SELECT id, name FROM orgs WHERE id = ?").get(id) as
    | { id: string; name: string }
    | undefined;
}

export function assertAccess(
  db: DatabaseSync,
  orgId: string,
  userId: string,
  roles: OrgRole[],
): OrgRole | null {
  const row = db
    .prepare("SELECT role FROM org_members WHERE org_id = ? AND user_id = ?")
    .get(orgId, userId) as { role: OrgRole } | undefined;
  if (!row) return null;
  if (!roles.includes(row.role)) return null;
  return row.role;
}

export type ClaimLineCreate = ClaimLineInput & {
  claim_type: string;
  duties_paid: number;
  substitute_basis: number;
};

export function createClaimLine(db: DatabaseSync, orgId: string, input: ClaimLineCreate) {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO claim_lines (
      id, org_id, claim_type, duties_paid, substitute_basis,
      apply_usmca_lesser_of, usmca_partner_duty, basket_other_ineligible,
      force_lesser_of, skip_lesser_of, relabel_from_substitution
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    orgId,
    input.claim_type,
    input.duties_paid,
    input.substitute_basis,
    input.apply_usmca_lesser_of === true ? 1 : 0,
    typeof input.usmca_partner_duty === "number" ? input.usmca_partner_duty : null,
    input.basket_other_ineligible === true ? 1 : 0,
    input.force_lesser_of === true ? 1 : 0,
    input.skip_lesser_of === true ? 1 : 0,
    input.relabel_from_substitution === true ? 1 : 0,
  );
  return getClaimLine(db, orgId, id);
}

export function getClaimLine(db: DatabaseSync, orgId: string, id: string) {
  const row = db
    .prepare("SELECT * FROM claim_lines WHERE id = ? AND org_id = ?")
    .get(id, orgId) as Record<string, unknown> | undefined;
  if (!row) return undefined;
  return rowToInput(row);
}

function rowToInput(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    org_id: String(row.org_id),
    claim_type: String(row.claim_type),
    duties_paid: Number(row.duties_paid),
    substitute_basis: Number(row.substitute_basis),
    apply_usmca_lesser_of: Number(row.apply_usmca_lesser_of) === 1,
    usmca_partner_duty:
      row.usmca_partner_duty === null || row.usmca_partner_duty === undefined
        ? undefined
        : Number(row.usmca_partner_duty),
    basket_other_ineligible: Number(row.basket_other_ineligible) === 1,
    force_lesser_of: Number(row.force_lesser_of) === 1,
    skip_lesser_of: Number(row.skip_lesser_of) === 1,
    relabel_from_substitution: Number(row.relabel_from_substitution) === 1,
  };
}

export function listClaimLines(db: DatabaseSync, orgId: string) {
  const rows = db
    .prepare("SELECT * FROM claim_lines WHERE org_id = ? ORDER BY created_at DESC")
    .all(orgId) as Record<string, unknown>[];
  return rows.map(rowToInput);
}

export function patchClaimLine(
  db: DatabaseSync,
  orgId: string,
  lineId: string,
  patch: Partial<ClaimLineCreate>,
) {
  const existing = getClaimLine(db, orgId, lineId);
  if (!existing) return null;
  const next = {
    claim_type: patch.claim_type ?? existing.claim_type,
    duties_paid: patch.duties_paid ?? existing.duties_paid,
    substitute_basis: patch.substitute_basis ?? existing.substitute_basis,
    apply_usmca_lesser_of:
      patch.apply_usmca_lesser_of !== undefined
        ? patch.apply_usmca_lesser_of
        : existing.apply_usmca_lesser_of,
    usmca_partner_duty:
      patch.usmca_partner_duty !== undefined
        ? patch.usmca_partner_duty
        : existing.usmca_partner_duty,
    basket_other_ineligible:
      patch.basket_other_ineligible !== undefined
        ? patch.basket_other_ineligible
        : existing.basket_other_ineligible,
    force_lesser_of:
      patch.force_lesser_of !== undefined ? patch.force_lesser_of : existing.force_lesser_of,
    skip_lesser_of:
      patch.skip_lesser_of !== undefined ? patch.skip_lesser_of : existing.skip_lesser_of,
    relabel_from_substitution:
      patch.relabel_from_substitution !== undefined
        ? patch.relabel_from_substitution
        : existing.relabel_from_substitution,
  };
  db.prepare(
    `UPDATE claim_lines SET
      claim_type = ?, duties_paid = ?, substitute_basis = ?,
      apply_usmca_lesser_of = ?, usmca_partner_duty = ?, basket_other_ineligible = ?,
      force_lesser_of = ?, skip_lesser_of = ?, relabel_from_substitution = ?
    WHERE id = ? AND org_id = ?`,
  ).run(
    next.claim_type,
    next.duties_paid,
    next.substitute_basis,
    next.apply_usmca_lesser_of ? 1 : 0,
    typeof next.usmca_partner_duty === "number" ? next.usmca_partner_duty : null,
    next.basket_other_ineligible ? 1 : 0,
    next.force_lesser_of ? 1 : 0,
    next.skip_lesser_of ? 1 : 0,
    next.relabel_from_substitution ? 1 : 0,
    lineId,
    orgId,
  );
  return getClaimLine(db, orgId, lineId);
}

export function addMember(
  db: DatabaseSync,
  orgId: string,
  userId: string,
  role: OrgRole,
): { ok: true } | { ok: false; error: string } {
  if (!getOrg(db, orgId)) return { ok: false, error: "org_not_found" };
  const user = db.prepare("SELECT id FROM users WHERE id = ?").get(userId);
  if (!user) return { ok: false, error: "user_not_found" };
  db.prepare(
    `INSERT INTO org_members (org_id, user_id, role) VALUES (?, ?, ?)
     ON CONFLICT(org_id, user_id) DO UPDATE SET role = excluded.role`,
  ).run(orgId, userId, role);
  return { ok: true };
}

export function runRecover(db: DatabaseSync, orgId: string, lineId: string): RecoverResult | null {
  const line = getClaimLine(db, orgId, lineId);
  if (!line) return null;
  const { id: _id, org_id: _org, ...input } = line;
  return recover(input);
}
