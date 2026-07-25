import { guard, json } from "@/lib/api";
import { createStructure, listStructures } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  const packId = url.searchParams.get("packId") ?? undefined;
  return json(listStructures(q, page, pageSize, packId));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(createStructure(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "error" }, { status: 400 });
  }
}
