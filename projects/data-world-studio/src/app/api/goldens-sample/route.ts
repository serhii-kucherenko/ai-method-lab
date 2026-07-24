import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ count: GOLDENS.length, sample: GOLDENS.slice(0, 3) });
}
