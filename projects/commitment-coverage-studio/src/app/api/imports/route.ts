import { NextResponse } from "next/server";
import { requireBearer } from "@/lib/auth";
import { getDb } from "@/lib/db";
import {
  importBatchSchema,
  listImportBatches,
  runImportBatch,
} from "@/services/import";

export async function GET(req: Request) {
  const denied = requireBearer(req);
  if (denied) return denied;
  const db = getDb();
  return NextResponse.json({ softSim: true, imports: listImportBatches(db) });
}

export async function POST(req: Request) {
  const denied = requireBearer(req);
  if (denied) return denied;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "Soft-sim expects JSON body" },
      { status: 422 },
    );
  }
  const parsed = importBatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "validation",
        message: "Invalid import batch (soft-sim — not live billing SOR)",
        details: parsed.error.flatten(),
      },
      { status: 422 },
    );
  }
  if (parsed.data.rows.length > 500) {
    return NextResponse.json(
      {
        error: "validation",
        message: "Batch exceeds max 500 rows (soft-sim)",
      },
      { status: 422 },
    );
  }
  const db = getDb();
  try {
    const result = runImportBatch(db, parsed.data);
    return NextResponse.json(
      {
        softSim: true,
        batchId: result.batch.id,
        status: result.status,
        batch: result.batch,
      },
      { status: result.status === "accepted" ? 201 : 422 },
    );
  } catch (err) {
    if (err instanceof Error && err.message === "idempotency_conflict") {
      return NextResponse.json(
        {
          error: "conflict",
          message: "clientKey already used (soft-sim idempotency)",
          batch: (err as Error & { batch?: unknown }).batch,
        },
        { status: 409 },
      );
    }
    throw err;
  }
}
