import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  const limit = Math.min(5, Number(url.searchParams.get("limit") ?? "3"));
  return json({
    count: GOLDENS.length,
    sample: GOLDENS.slice(0, limit),
  });
}
