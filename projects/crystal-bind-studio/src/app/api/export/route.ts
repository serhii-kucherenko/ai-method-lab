import { guard } from "@/lib/api";
import { exportPacksJson, exportRetrievesCsv } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const kind = url.searchParams.get("kind") ?? "packs";
  if (kind === "retrieves") {
    return new Response(exportRetrievesCsv(), {
      headers: { "content-type": "text/csv; charset=utf-8" },
    });
  }
  return new Response(exportPacksJson(), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
