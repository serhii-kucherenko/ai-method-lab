import { guard, json } from "@/lib/api";
import { createCounterfactual, listCounterfactuals } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const siteId = url.searchParams.get("siteId") ?? undefined;
  return json({ items: listCounterfactuals(siteId) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as { planId?: string; label?: string };
  if (!body.planId) {
    return json({ error: "plan_id_required" }, { status: 400 });
  }
  try {
    const row = createCounterfactual({
      planId: body.planId,
      label: body.label,
    });
    return json(row, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
