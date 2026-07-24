import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const n = Math.min(5, Math.max(1, Number(url.searchParams.get("n") ?? "3")));
  return json({ items: GOLDENS.slice(0, n) });
}
