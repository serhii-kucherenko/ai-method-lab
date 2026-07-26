import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? "5"), 30);
  return json({ items: GOLDENS.slice(0, limit) });
}
