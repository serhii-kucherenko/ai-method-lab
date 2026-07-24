import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";
import { listFeatures } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  if (url.searchParams.get("sample") === "goldens") {
    return json({ count: GOLDENS.length, sample: GOLDENS.slice(0, 3) });
  }
  return json({ features: listFeatures() });
}
