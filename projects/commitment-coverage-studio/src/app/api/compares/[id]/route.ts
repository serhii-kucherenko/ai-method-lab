import { NextResponse } from "next/server";
import { requireBearer } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getCompare } from "@/services/compare";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: Request, context: RouteContext) {
  const denied = requireBearer(req);
  if (denied) return denied;
  const { id } = await context.params;
  const compare = getCompare(getDb(), id);
  if (!compare) {
    return NextResponse.json(
      { error: "not_found", message: "Compare result not found (soft-sim)" },
      { status: 404 },
    );
  }
  return NextResponse.json({
    softSim: true,
    compare,
    pathA: JSON.parse(compare.path_a_json),
    pathB: JSON.parse(compare.path_b_json),
    deltaUsd: compare.delta_usd,
    winner: compare.winner,
  });
}
