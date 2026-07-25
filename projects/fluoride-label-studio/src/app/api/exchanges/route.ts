import { guard, json } from "@/lib/api";
import { archiveExchange, createExchange, listExchanges } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listExchanges({
      q: url.searchParams.get("q") ?? undefined,
      packId: url.searchParams.get("packId") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
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
    const row = archiveExchange(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json({ exchange: row });
  }
  const exchange = createExchange({
    packId: body.packId ?? "pack-demo",
    label: body.label,
    kind: body.kind ?? "isotopic_18f_swap",
    exchangeHint: body.exchangeHint ?? "",
    cycleMinutes: Number(body.cycleMinutes ?? 12),
    exchangeFloor: Number(body.exchangeFloor ?? 0.4),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!exchange) return json({ error: "bad_pack" }, { status: 400 });
  return json({ exchange }, { status: 201 });
}
