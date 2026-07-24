import { guard, json } from "@/lib/api";
import { createKnowledge, listKnowledge } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const episodeId = url.searchParams.get("episodeId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listKnowledge(episodeId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(createKnowledge(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
