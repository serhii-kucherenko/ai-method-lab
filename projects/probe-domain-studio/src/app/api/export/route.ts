import { NextResponse } from "next/server";
import { guard } from "@/lib/api";
import { exportComparesCsv, exportPacksJson } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const format = new URL(req.url).searchParams.get("format") ?? "json";
  if (format === "csv") {
    return new NextResponse(exportComparesCsv(), {
      headers: { "content-type": "text/csv; charset=utf-8" },
    });
  }
  return new NextResponse(exportPacksJson(), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export async function POST(req: Request) {
  return GET(req);
}
