import { guard } from "@/lib/api";
import { exportComparesCsv, exportPlansJson } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const kind = url.searchParams.get("kind") ?? "plans";
  if (kind === "compares") {
    return new Response(exportComparesCsv(), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": 'attachment; filename="compares.csv"',
      },
    });
  }
  return new Response(exportPlansJson(), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": 'attachment; filename="plans.json"',
    },
  });
}
