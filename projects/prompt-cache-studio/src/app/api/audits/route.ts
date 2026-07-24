import { NextResponse } from "next/server";
import { guard, json } from "@/lib/api";
import { exportAuditsCsv, listAudits } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  if (url.searchParams.get("export") === "csv") {
    return new NextResponse(exportAuditsCsv(), {
      headers: { "content-type": "text/csv; charset=utf-8" },
    });
  }
  const limit = Number(url.searchParams.get("limit") ?? "50");
  return json({ items: listAudits(limit) });
}
