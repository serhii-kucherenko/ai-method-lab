import { guard, json } from "@/lib/api";
import { createAssayRun, listAssayRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listAssayRuns({
      packId: url.searchParams.get("packId") ?? undefined,
      carrierId: url.searchParams.get("carrierId") ?? undefined,
      loadId: url.searchParams.get("loadId") ?? undefined,
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
    packId: body.packId,
    carrierId: body.carrierId,
    loadId: body.loadId,
    label: body.label,
    kind: body.kind,
    orderFidelity: Number(body.orderFidelity),
    chemoEncapsulation: Number(body.chemoEncapsulation),
    photoEncapsulation: Number(body.photoEncapsulation),
    assaySignal: Number(body.assaySignal ?? 0.7),
    runNotes: body.runNotes,
  });
  if (!run) return json({ error: "bad_refs" }, { status: 400 });
  return json({ assay: run }, { status: 201 });
}
