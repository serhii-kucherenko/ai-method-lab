import { guard, json } from "@/lib/api";
import { archiveObserver, createObserver, listObservers } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listObservers({
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
    const observer = archiveObserver(body.id);
    if (!observer) return json({ error: "not_found" }, { status: 404 });
    return json({ observer });
  }
  const observer = createObserver({
    packId: body.packId,
    label: body.label,
    kind: body.kind,
    exoHint: body.exoHint ?? "",
    viewCount: Number(body.viewCount ?? 1),
    baselineMeters: Number(body.baselineMeters ?? 2),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!observer) return json({ error: "invalid_pack" }, { status: 400 });
  return json({ observer }, { status: 201 });
}
