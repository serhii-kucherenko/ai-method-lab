import { guard, json } from "@/lib/api";
import { createVerify, listVerifies } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId") ?? undefined;
  return json({ items: listVerifies(sessionId) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  try {
    return json(createVerify(body), { status: 201 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
