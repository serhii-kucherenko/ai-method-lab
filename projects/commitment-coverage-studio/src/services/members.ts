import { randomUUID } from "node:crypto";
import type { CoverageDb } from "@/lib/db";
import { DEMO_ORG_ID } from "@/lib/ids";

export type MemberRow = {
  id: string;
  org_id: string;
  email: string;
  role: string;
  created_at: string;
};

export type MemberPublic = {
  id: string;
  orgId: string;
  email: string;
  role: string;
  createdAt: string;
};

export function toMemberPublic(row: MemberRow): MemberPublic {
  return {
    id: row.id,
    orgId: row.org_id,
    email: row.email,
    role: row.role,
    createdAt: row.created_at,
  };
}

export function listMembers(
  db: CoverageDb,
  orgId = DEMO_ORG_ID,
): MemberRow[] {
  return db
    .prepare(
      `SELECT id, org_id, email, role, created_at
       FROM members WHERE org_id = ?
       ORDER BY created_at ASC`,
    )
    .all(orgId) as MemberRow[];
}

export function createMember(
  db: CoverageDb,
  input: { orgId?: string; email: string; role: string },
): MemberRow {
  const id = randomUUID();
  const orgId = input.orgId ?? DEMO_ORG_ID;
  db.prepare(
    `INSERT INTO members (id, org_id, email, role) VALUES (?, ?, ?, ?)`,
  ).run(id, orgId, input.email.trim().toLowerCase(), input.role);
  return db
    .prepare(
      `SELECT id, org_id, email, role, created_at FROM members WHERE id = ?`,
    )
    .get(id) as MemberRow;
}
