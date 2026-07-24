import { guard } from "@/lib/api";
import { exportDecisionsJson } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const episodeId = url.searchParams.get("episodeId") ?? undefined;
  return new Response(exportDecisionsJson(episodeId), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": "attachment; filename=decisions.json",
    },
  });
}
