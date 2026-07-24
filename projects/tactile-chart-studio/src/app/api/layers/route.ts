import { guard, json } from "@/lib/api";
import { createLayer, listLayers } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const chartId = url.searchParams.get("chartId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listLayers(chartId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(createLayer(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
