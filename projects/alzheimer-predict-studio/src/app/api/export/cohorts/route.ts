import { guard } from "@/lib/api";
import { exportCohortsJson } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return new Response(exportCohortsJson(), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": 'attachment; filename="cohorts.json"',
    },
  });
}
