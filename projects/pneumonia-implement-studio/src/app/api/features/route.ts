import { guard, json } from "@/lib/api";
import { featureInventory } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const items = featureInventory();
  return json({ count: items.length, items });
}
