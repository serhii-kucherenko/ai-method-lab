import { guard, json } from "@/lib/api";
import { archiveDomain, createDomain, listDomains } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listDomains({
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
    const domain = archiveDomain(body.id);
    if (!domain) return json({ error: "not_found" }, { status: 404 });
    return json({ domain });
  }
  const domain = createDomain({
    packId: body.packId,
    label: body.label,
    layout: body.layout ?? "capture_detect",
    layoutHint: body.layoutHint ?? "",
    domainCount: Number(body.domainCount ?? 2),
    coverageFloor: Number(body.coverageFloor ?? 0.4),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!domain) return json({ error: "pack_not_found" }, { status: 400 });
  return json({ domain }, { status: 201 });
}
