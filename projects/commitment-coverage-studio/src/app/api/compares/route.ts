import { NextResponse } from "next/server";
import { z } from "zod";
import { requireBearer } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { runCompare } from "@/services/compare";

const compareSchema = z.object({
  mode: z.string().min(1),
  cloudAccountId: z.string().min(1),
  windowStart: z.string().min(1),
  windowEnd: z.string().min(1),
});

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
  const parsed = compareSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "validation",
        message: "Invalid compare request (soft-sim)",
        details: parsed.error.flatten(),
      },
      { status: 422 },
    );
  }
  const result = runCompare(getDb(), parsed.data);
  if ("error" in result) {
    if (result.error === "unknown_mode") {
      return NextResponse.json(
        {
          error: "validation",
          message: "Unknown compare mode (soft-sim). Use commit_vs_ondemand.",
        },
        { status: 422 },
      );
    }
    return NextResponse.json(
      {
        error: "missing_usage",
        message: "No usage for compare window (soft-sim — not live billing SOR)",
      },
      { status: 422 },
    );
  }
  return NextResponse.json(
    {
      softSim: true,
      compare: result,
      pathA: JSON.parse(result.path_a_json),
      pathB: JSON.parse(result.path_b_json),
      deltaUsd: result.delta_usd,
      winner: result.winner,
    },
    { status: 201 },
  );
}
