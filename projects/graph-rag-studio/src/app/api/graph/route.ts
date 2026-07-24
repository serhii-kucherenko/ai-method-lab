import { guard, json } from "@/lib/api";
import { getGraph, hopHighlight, listGraphs, paginate } from "@/store";

export function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (id) {
    const g = getGraph(id);
    if (!g) return json({ error: "not_found" }, { status: 404 });
    return json(g);
  }
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listGraphs(q), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    graphId?: string;
    startEntityId?: string;
    hops?: number;
  };
  if (!body.graphId || !body.startEntityId) {
    return json({ error: "graphId_and_start_required" }, { status: 400 });
  }
  try {
    return json(
      hopHighlight(body.graphId, body.startEntityId, body.hops ?? 2),
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    return json({ error: msg }, { status: 400 });
  }
}
