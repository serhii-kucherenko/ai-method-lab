import { guard, json } from "@/lib/api";
import { createHandoff, listHandoffs } from "@/store";
import type { HandoffKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listHandoffs({
      packId: url.searchParams.get("packId") ?? undefined,
      eventId: url.searchParams.get("eventId") ?? undefined,
      liaisonId: url.searchParams.get("liaisonId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? "1"),
      pageSize: Number(url.searchParams.get("pageSize") ?? "20"),
    }),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as Record<string, unknown>;
  if (
    typeof body.packId !== "string" ||
    typeof body.eventId !== "string" ||
    typeof body.liaisonId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createHandoff({
    packId: body.packId,
    eventId: body.eventId,
    liaisonId: body.liaisonId,
    label: body.label,
    kind: body.kind as HandoffKind,
    pediatricLoad: Number(body.pediatricLoad ?? 0.3),
    handoffLatency: Number(body.handoffLatency ?? 0.3),
    perinatalRisk: Number(body.perinatalRisk ?? 0.25),
    assaySignal: Number(body.assaySignal ?? 0.7),
    runNotes: typeof body.runNotes === "string" ? body.runNotes : undefined,
  });
  if (!row) return json({ error: "deps_not_found" }, { status: 404 });
  return json(row);
}
