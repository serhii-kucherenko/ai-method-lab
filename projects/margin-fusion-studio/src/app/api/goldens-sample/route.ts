import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 5), 30);
  return json({ items: GOLDENS.slice(0, limit), total: GOLDENS.length });
}
