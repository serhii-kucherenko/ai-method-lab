import { guard, json } from "@/lib/api";
import { listAudits } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit") ?? 50);
  return json({ items: listAudits(limit) });
}
