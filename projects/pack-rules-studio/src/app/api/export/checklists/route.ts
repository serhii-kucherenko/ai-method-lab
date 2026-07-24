import { guard } from "@/lib/api";
import { exportChecklistsJson } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const profileId = url.searchParams.get("profileId") ?? undefined;
  return new Response(exportChecklistsJson(profileId), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
