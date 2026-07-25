import { NextResponse } from "next/server";
import { guard } from "@/lib/api";
import { exportComparesCsv, exportPacksJson } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  const format = url.searchParams.get("format") ?? "packs-json";
  if (format === "compares-csv") {
    return new NextResponse(exportComparesCsv(), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": 'attachment; filename="compares.csv"',
      },
    });
  }
  return new NextResponse(exportPacksJson(), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": 'attachment; filename="packs.json"',
    },
  });
}
