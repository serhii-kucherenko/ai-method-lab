import { guard, json } from "@/lib/api";
import { createConstraint, listConstraints } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const tripId = url.searchParams.get("tripId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listConstraints(tripId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(createConstraint(body), { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 400 },
    );
  }
}
