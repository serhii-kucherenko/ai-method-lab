import { guard, json } from "@/lib/api";
import { listReadiness, upsertReadiness } from "@/store";
import type { ReadinessCheck } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const appId = url.searchParams.get("appId") ?? undefined;
  return json({ items: listReadiness(appId) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    appId?: string;
    label?: string;
    kind?: ReadinessCheck["kind"];
    threshold?: number;
    observed?: number;
  };
  if (!body.appId || !body.kind || !body.label) {
    return json({ error: "fields_required" }, { status: 400 });
  }
  try {
    const row = upsertReadiness({
      appId: body.appId,
      label: body.label,
      kind: body.kind,
      threshold: body.threshold ?? 60,
      observed: body.observed ?? 0,
    });
    return json(row, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 400 },
    );
  }
}
