import { NextResponse } from "next/server";
import { guard } from "@/lib/api";
import { exportComparesCsv, exportStreamsJson } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  const kind = url.searchParams.get("kind") ?? "streams";
  if (kind === "compares") {
    return new NextResponse(exportComparesCsv(), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": 'attachment; filename="compares.csv"',
      },
    });
  }
  return new NextResponse(exportStreamsJson(), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": 'attachment; filename="streams.json"',
    },
  });
}

export async function POST(req: Request) {
  return GET(req);
}
