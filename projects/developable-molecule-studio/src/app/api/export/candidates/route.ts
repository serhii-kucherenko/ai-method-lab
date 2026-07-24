import { guard } from "@/lib/api";
import { exportCandidatesJson } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return new Response(exportCandidatesJson(), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": "attachment; filename=candidates.json",
    },
  });
}
