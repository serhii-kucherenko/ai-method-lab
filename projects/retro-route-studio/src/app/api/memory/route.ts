import { guard, json } from "@/lib/api";
import { createMemoryCell, listMemory, type MemoryOutcome } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listMemory({
      packId: url.searchParams.get("packId") ?? undefined,
      outcome: url.searchParams.get("outcome") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const cell = createMemoryCell({
    packId: String(body.packId ?? ""),
    routeId: body.routeId ? String(body.routeId) : undefined,
    triedPathHash: String(body.triedPathHash ?? `ph_${Date.now()}`),
    outcome: (body.outcome as MemoryOutcome) ?? "promising",
    intermediateIds: Array.isArray(body.intermediateIds)
      ? body.intermediateIds.map(String)
      : [],
    notes: body.notes ? String(body.notes) : "",
  });
  if (!cell) return json({ error: "missing_pack" }, { status: 400 });
  return json({ cell }, { status: 201 });
}
