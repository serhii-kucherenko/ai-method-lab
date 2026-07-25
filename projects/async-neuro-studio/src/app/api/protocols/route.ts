import { guard, json } from "@/lib/api";
import { archiveProtocol, createProtocol, listProtocols } from "@/store";
import type { ProtocolKind } from "@/domain/types";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listProtocols({
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
    const protocol = archiveProtocol(body.id);
    if (!protocol) return json({ error: "not_found" }, { status: 404 });
    return json({ protocol });
  }
  const protocol = createProtocol({
    packId: body.packId,
    label: body.label,
    kind: body.kind as ProtocolKind,
    fidelityHint: body.fidelityHint ?? "",
    stepCount: Number(body.stepCount ?? 1),
    severityFloor: Number(body.severityFloor ?? 0.3),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!protocol) return json({ error: "pack_not_found" }, { status: 400 });
  return json({ protocol }, { status: 201 });
}
