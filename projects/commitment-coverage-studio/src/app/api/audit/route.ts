import { NextResponse } from "next/server";
import { requireBearer } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { listAudit } from "@/services/audit";

export type AuditPublic = {
  id: string;
  orgId: string;
  actor: string;
  action: string;
  entityType: string;
  entityId: string;
  detail: Record<string, unknown>;
  createdAt: string;
};

/** GET recent audit entries for demo org (D-10, PLT-04). */
export async function GET(req: Request) {
  const denied = requireBearer(req);
  if (denied) return denied;
  const rows = listAudit(getDb());
  const entries: AuditPublic[] = rows.map((row) => {
    let detail: Record<string, unknown> = {};
    try {
      detail = JSON.parse(row.detail) as Record<string, unknown>;
    } catch {
      detail = {};
    }
    return {
      id: row.id,
      orgId: row.org_id,
      actor: row.actor,
      action: row.action,
      entityType: row.entity_type,
      entityId: row.entity_id,
      detail,
      createdAt: row.created_at,
    };
  });
  return NextResponse.json({ softSim: true, entries });
}
