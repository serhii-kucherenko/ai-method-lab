import { guard, json } from "@/lib/api";
import { archiveGate, createGate, listGates } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listGates({
      q: url.searchParams.get("q") ?? undefined,
      gateChannel: url.searchParams.get("gateChannel") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      packId: url.searchParams.get("packId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  if (body.action === "archive") {
    const gate = archiveGate(body.id);
    if (!gate) return json({ error: "not_found" }, { status: 404 });
    return json({ gate });
  }
  const gate = createGate(body);
  return json({ gate }, { status: 201 });
}
