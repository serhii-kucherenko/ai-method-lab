import { guard, json } from "@/lib/api";
import { archiveSite, createSite, listSites } from "@/store";
import type { SiteKind } from "@/domain/types";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listSites({
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
    const site = archiveSite(body.id);
    if (!site) return json({ error: "not_found" }, { status: 404 });
    return json({ site });
  }
  const site = createSite({
    packId: body.packId,
    label: body.label,
    kind: body.kind as SiteKind,
    regionHint: body.regionHint ?? "",
    examinerCount: Number(body.examinerCount ?? 1),
    consistencyMin: Number(body.consistencyMin ?? 0.3),
    consistencyMax: Number(body.consistencyMax ?? 0.9),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!site) return json({ error: "pack_not_found" }, { status: 400 });
  return json({ site }, { status: 201 });
}
