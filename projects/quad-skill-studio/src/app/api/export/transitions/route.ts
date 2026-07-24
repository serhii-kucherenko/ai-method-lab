import { guard } from "@/lib/api";
import { exportTransitionsJson } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return new Response(exportTransitionsJson(), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": "attachment; filename=transitions.json",
    },
  });
}
