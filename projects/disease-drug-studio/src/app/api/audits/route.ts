import { guard, json } from "@/lib/api";
import { exportAuditsCsv, listAudits, paginate } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  if (url.searchParams.get("format") === "csv") {
    return new Response(exportAuditsCsv(), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": 'attachment; filename="runs-audit.csv"',
      },
    });
  }
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  return json(paginate(listAudits(200), page, pageSize));
}
