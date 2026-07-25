import { guard, json } from "@/lib/api";
import { archiveScreen, createScreen, listScreens } from "@/store";
import type { ScreenKind } from "@/domain/types";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(listScreens({
    q: url.searchParams.get("q") ?? undefined,
    packId: url.searchParams.get("packId") ?? undefined,
    status: url.searchParams.get("status") ?? undefined,
    page: Number(url.searchParams.get("page") ?? 1),
    pageSize: Number(url.searchParams.get("pageSize") ?? 20),
  }));
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  if (body.action === "archive") {
    const screen = archiveScreen(body.id);
    if (!screen) return json({ error: "not_found" }, { status: 404 });
    return json({ screen });
  }
  const screen = createScreen({
    packId: body.packId,
    label: body.label,
    kind: body.kind as ScreenKind,
    fidelityHint: body.fidelityHint ?? "",
    itemCount: Number(body.itemCount ?? 8),
    sensitivityFloor: Number(body.sensitivityFloor ?? 0.3),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!screen) return json({ error: "pack_not_found" }, { status: 400 });
  return json({ screen }, { status: 201 });
}
