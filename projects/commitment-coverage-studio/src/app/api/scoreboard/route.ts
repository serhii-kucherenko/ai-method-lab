import { NextResponse } from "next/server";
import { requireBearer } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { listScoreboard } from "@/services/scoreboard";

export async function GET(req: Request) {
  const denied = requireBearer(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const rows = listScoreboard(getDb(), {
    provider: url.searchParams.get("provider") ?? undefined,
    cloudAccountId: url.searchParams.get("cloudAccountId") ?? undefined,
  });
  return NextResponse.json({ softSim: true, scoreboard: rows });
}
