import { NextResponse } from "next/server";
import { z } from "zod";
import { requireBearer } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getCommitment, updateCommitment } from "@/lib/repos";

const patchSchema = z.object({
  rateUsd: z.number().positive().optional(),
  lockStart: z.string().min(1).optional(),
  lockEnd: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  archive: z.boolean().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: Request, context: RouteContext) {
  const denied = requireBearer(req);
  if (denied) return denied;
  const { id } = await context.params;
  const commitment = getCommitment(getDb(), id);
  if (!commitment) {
    return NextResponse.json(
      { error: "not_found", message: "Commitment not found (soft-sim)" },
      { status: 404 },
    );
  }
  return NextResponse.json({ softSim: true, commitment });
}

export async function PATCH(req: Request, context: RouteContext) {
  const denied = requireBearer(req);
  if (denied) return denied;
  const { id } = await context.params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "Soft-sim expects JSON body" },
      { status: 422 },
    );
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "validation",
        message: "Invalid commitment patch (soft-sim)",
        details: parsed.error.flatten(),
      },
      { status: 422 },
    );
  }
  const existing = getCommitment(getDb(), id);
  if (!existing) {
    return NextResponse.json(
      { error: "not_found", message: "Commitment not found (soft-sim)" },
      { status: 404 },
    );
  }
  const lockStart = parsed.data.lockStart ?? existing.lock_start;
  const lockEnd = parsed.data.lockEnd ?? existing.lock_end;
  if (Date.parse(lockStart) >= Date.parse(lockEnd)) {
    return NextResponse.json(
      {
        error: "validation",
        message: "lockStart must be before lockEnd (soft-sim inventory)",
      },
      { status: 422 },
    );
  }
  const commitment = updateCommitment(getDb(), id, parsed.data);
  return NextResponse.json({ softSim: true, commitment });
}
