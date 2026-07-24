import { guard } from "@/lib/api";
import { exportPlansJson } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const tripId = url.searchParams.get("tripId") ?? undefined;
  return new Response(exportPlansJson(tripId), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": 'attachment; filename="plans.json"',
    },
  });
}
