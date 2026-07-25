import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  const n = Math.min(5, Math.max(1, Number(url.searchParams.get("n") ?? "3")));
  return json({ count: GOLDENS.length, sample: GOLDENS.slice(0, n) });
}
