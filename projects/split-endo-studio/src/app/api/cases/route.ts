import { guard, json } from "@/lib/api";
import { archiveCase, createCase, listCases } from "@/store";
import type { CaseKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listCases({
      q: url.searchParams.get("q") ?? undefined,
      packId: url.searchParams.get("packId") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      page: Number(url.searchParams.get("page") ?? "1"),
      pageSize: Number(url.searchParams.get("pageSize") ?? "20"),
    }),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as Record<string, unknown>;
  if (body.action === "archive" && typeof body.id === "string") {
    const row = archiveCase(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json(row);
  }
  if (
    typeof body.packId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string" ||
    typeof body.levelHint !== "string" ||
    typeof body.bloodLossCeiling !== "number" ||
    typeof body.stayCeiling !== "number"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createCase({
    packId: body.packId,
    label: body.label,
    kind: body.kind as CaseKind,
    levelHint: body.levelHint,
    bloodLossCeiling: body.bloodLossCeiling,
    stayCeiling: body.stayCeiling,
    metricHint: typeof body.metricHint === "string" ? body.metricHint : undefined,
    notes: typeof body.notes === "string" ? body.notes : undefined,
  });
  if (!row) return json({ error: "pack_not_found" }, { status: 404 });
  return json(row);
}
