import { guard } from "@/lib/api";
import { exportDebatesJson } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return new Response(exportDebatesJson(), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": "attachment; filename=debates.json",
    },
  });
}
