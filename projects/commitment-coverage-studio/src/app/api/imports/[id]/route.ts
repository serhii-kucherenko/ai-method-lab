import { NextResponse } from "next/server";
import { requireBearer } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getImportBatch } from "@/services/import";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: Request, context: RouteContext) {
  const denied = requireBearer(req);
  if (denied) return denied;
  const { id } = await context.params;
  const batch = getImportBatch(getDb(), id);
  if (!batch) {
    return NextResponse.json(
      { error: "not_found", message: "Import batch not found (soft-sim)" },
      { status: 404 },
    );
  }
  return NextResponse.json({
    softSim: true,
    batch,
    errorDetail: batch.error_detail,
  });
}
