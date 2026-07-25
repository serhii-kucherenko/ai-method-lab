import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit") ?? 5);
  return json({
    total: GOLDENS.length,
    items: GOLDENS.slice(0, limit),
  });
}
