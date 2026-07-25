import { guard, json } from "@/lib/api";
import { archivePillar, createPillar, listPillars } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listPillars({
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
    const pillar = archivePillar(body.id);
    if (!pillar) return json({ error: "not_found" }, { status: 404 });
    return json({ pillar });
  }
  const pillar = createPillar({
    packId: body.packId,
    label: body.label,
    kind: body.kind,
    coverageHint: body.coverageHint ?? body.egoHint ?? "",
    caseCount: Number(body.caseCount ?? 4),
    hardnessMin: Number(body.hardnessMin ?? 0.3),
    hardnessMax: Number(body.hardnessMax ?? 0.9),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!pillar) return json({ error: "invalid_pack" }, { status: 400 });
  return json({ pillar }, { status: 201 });
}
