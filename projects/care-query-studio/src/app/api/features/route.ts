import { guard, json } from "@/lib/api";
import { featureInventory } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const items = featureInventory();
  return json({ count: items.length, items });
}