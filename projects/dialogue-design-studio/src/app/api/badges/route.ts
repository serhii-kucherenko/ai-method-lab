import { guard, json } from "@/lib/api";
import { archiveBadge, createBadge, listBadges } from "@/store";
import type { BadgeKind } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listBadges({
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
    const badge = archiveBadge(body.id);
    if (!badge) return json({ error: "not_found" }, { status: 404 });
    return json({ badge });
  }
  const badge = createBadge({
    packId: body.packId,
    label: body.label,
    kind: (body.kind ?? "open_minded") as BadgeKind,
    badgeHint: body.badgeHint ?? "",
    signalCount: Number(body.signalCount ?? 4),
    clarityFloor: Number(body.clarityFloor ?? 0.35),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!badge) return json({ error: "bad_pack" }, { status: 400 });
  return json({ badge }, { status: 201 });
}
