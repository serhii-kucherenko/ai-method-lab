import { guard, json } from "@/lib/api";
import { exportAuditsCsv, listAudits, paginate } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  if (url.searchParams.get("export") === "csv") {
    return new Response(exportAuditsCsv(), {
      headers: {
        "content-type": "text/csv",
        "content-disposition": "attachment; filename=audits.csv",
      },
    });
  }
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  return json(paginate(listAudits(200), page, pageSize));
}
