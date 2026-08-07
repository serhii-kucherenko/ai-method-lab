import { randomUUID } from "node:crypto";
import type { CoverageDb } from "@/lib/db";
import { DEMO_ORG_ID } from "@/lib/ids";

export type AuditEntryRow = {
  id: string;
  org_id: string;
  actor: string;
  action: string;
  entity_type: string;
  entity_id: string;
  detail: string;
  created_at: string;
};

/** Soft-sim audit append — who/what/when for renewals act/dismiss and later PLT surfaces. */
export function appendAudit(
  db: CoverageDb,
  input: {
    orgId?: string;
    actor: string;
    action: string;
    entityType: string;
    entityId: string;
    detail?: Record<string, unknown>;
  },
): AuditEntryRow {
  const id = randomUUID();
  const orgId = input.orgId ?? DEMO_ORG_ID;
  db.prepare(
    `INSERT INTO audit_entries (
      id, org_id, actor, action, entity_type, entity_id, detail
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    orgId,
    input.actor,
    input.action,
    input.entityType,
    input.entityId,
    JSON.stringify(input.detail ?? {}),
  );
  return db
    .prepare("SELECT * FROM audit_entries WHERE id = ?")
    .get(id) as AuditEntryRow;
}

export function listAudit(
  db: CoverageDb,
  opts: { orgId?: string; entityId?: string; action?: string } = {},
): AuditEntryRow[] {
  const orgId = opts.orgId ?? DEMO_ORG_ID;
  let sql = "SELECT * FROM audit_entries WHERE org_id = ?";
  const params: unknown[] = [orgId];
  if (opts.entityId) {
    sql += " AND entity_id = ?";
    params.push(opts.entityId);
  }
  if (opts.action) {
    sql += " AND action = ?";
    params.push(opts.action);
  }
  sql += " ORDER BY created_at DESC";
  return db.prepare(sql).all(...params) as AuditEntryRow[];
}
