import { guard, json } from "@/lib/api";
import { listTriggers, synthesizeTrigger } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const findingId = url.searchParams.get("findingId") ?? undefined;
  return json({ items: listTriggers(findingId) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as { findingId?: string; label?: string };
  if (!body.findingId) {
    return json({ error: "finding_required" }, { status: 400 });
  }
  try {
    const trigger = synthesizeTrigger({
      findingId: body.findingId,
      label: body.label,
    });
    return json(trigger, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
