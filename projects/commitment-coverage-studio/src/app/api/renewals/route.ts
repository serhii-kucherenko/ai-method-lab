import { NextResponse } from "next/server";
import { requireBearer } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { DEMO_ORG_ID } from "@/lib/ids";

/**
 * Renew-by queue from commitment lock_end — no buy/reduce/hold packs (Phase 4).
 */
export async function GET(req: Request) {
  const denied = requireBearer(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const cloudAccountId = url.searchParams.get("cloudAccountId");
  const db = getDb();
  let sql = `SELECT id AS commitmentId, name, cloud_account_id AS cloudAccountId,
                    lock_end AS lockEnd, provider
             FROM commitments
             WHERE org_id = ? AND archived_at IS NULL`;
  const params: unknown[] = [DEMO_ORG_ID];
  if (cloudAccountId) {
    sql += " AND cloud_account_id = ?";
    params.push(cloudAccountId);
  }
  sql += " ORDER BY lock_end ASC";
  const renewals = db.prepare(sql).all(...params);
  return NextResponse.json({ softSim: true, renewals });
}
