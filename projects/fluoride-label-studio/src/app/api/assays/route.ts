import { guard, json } from "@/lib/api";
import { createAssayRun, listAssayRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listAssayRuns({
      packId: url.searchParams.get("packId") ?? undefined,
      precursorId: url.searchParams.get("precursorId") ?? undefined,
      exchangeId: url.searchParams.get("exchangeId") ?? undefined,
      tracerId: url.searchParams.get("tracerId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const run = createAssayRun({
    packId: body.packId ?? "pack-demo",
    precursorId: body.precursorId ?? "precursor-demo",
    exchangeId: body.exchangeId ?? "exchange-demo",
    tracerId: body.tracerId ?? "tracer-demo",
    exchangeRate: Number(body.exchangeRate ?? 0.6),
    precursorPurity: Number(body.precursorPurity ?? 0.7),
    leavingGroupEase: Number(body.leavingGroupEase ?? 0.7),
    amineAvailability: Number(body.amineAvailability ?? 0.65),
    runNotes: body.runNotes,
  });
  if (!run) return json({ error: "bad_refs" }, { status: 400 });
  return json({ assay: run }, { status: 201 });
}
