import { guard } from "@/lib/api";
import { exportLayersJson } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const chartId = url.searchParams.get("chartId") ?? undefined;
  return new Response(exportLayersJson(chartId), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
