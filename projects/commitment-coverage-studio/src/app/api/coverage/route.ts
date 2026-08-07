import { NextResponse } from "next/server";
import { z } from "zod";
import { requireBearer } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { computeCoverage, listCoverageSnapshots } from "@/services/coverage";

const computeSchema = z.object({
  cloudAccountId: z.string().min(1),
  windowStart: z.string().min(1),
  windowEnd: z.string().min(1),
});

export async function GET(req: Request) {
  const denied = requireBearer(req);
  if (denied) return denied;
  return NextResponse.json({
    softSim: true,
    snapshots: listCoverageSnapshots(getDb()),
  });
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
  const parsed = computeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "validation",
        message: "Invalid coverage request (soft-sim)",
        details: parsed.error.flatten(),
      },
      { status: 422 },
    );
  }
  if (Date.parse(parsed.data.windowStart) >= Date.parse(parsed.data.windowEnd)) {
    return NextResponse.json(
      {
        error: "validation",
        message: "windowStart must be before windowEnd (soft-sim)",
      },
      { status: 422 },
    );
  }
  const result = computeCoverage(getDb(), parsed.data);
  if ("error" in result && result.error === "no_usage") {
    return NextResponse.json(
      {
        error: "missing_usage",
        message:
          "No usage slices for this account/window (soft-sim — import usage before coverage; not a live billing SOR)",
      },
      { status: 422 },
    );
  }
  return NextResponse.json(
    { softSim: true, snapshot: result },
    { status: 201 },
  );
}
