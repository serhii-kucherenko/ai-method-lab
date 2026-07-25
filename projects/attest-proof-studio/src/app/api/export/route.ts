import { NextResponse } from "next/server";
import { guard, json } from "@/lib/api";
import { exportClaimsJson, exportComparesCsv } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  const kind = url.searchParams.get("kind") ?? "claims";
  if (kind === "compares") {
    return new NextResponse(exportComparesCsv(), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": 'attachment; filename="compares.csv"',
      },
    });
  }
  return new NextResponse(exportClaimsJson(), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": 'attachment; filename="claims.json"',
    },
  });
}

export async function POST(req: Request) {
  return GET(req);
}
