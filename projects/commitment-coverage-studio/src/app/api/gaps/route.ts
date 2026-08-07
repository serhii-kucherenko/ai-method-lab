import { NextResponse } from "next/server";
import { requireBearer } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { listGaps } from "@/services/gaps";

export async function GET(req: Request) {
  const denied = requireBearer(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const gaps = listGaps(getDb(), {
    cloudAccountId: url.searchParams.get("cloudAccountId") ?? undefined,
    windowStart: url.searchParams.get("windowStart") ?? undefined,
    windowEnd: url.searchParams.get("windowEnd") ?? undefined,
  });
  return NextResponse.json({ softSim: true, gaps });
}
