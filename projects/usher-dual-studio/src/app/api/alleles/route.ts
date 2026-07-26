import { guard, json } from "@/lib/api";
import { archiveAllele, createAllele, listAlleles } from "@/store";
import type { AlleleKind } from "@/domain/types";

const KINDS: AlleleKind[] = [
  "myo7a_null",
  "usher1b_panel",
  "sensory_cohort",
  "research_panel",
  "composite_pack",
  "custom",
];

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listAlleles({
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
    const row = archiveAllele(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json(row);
  }
  if (
    typeof body.packId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string" ||
    typeof body.locusHint !== "string" ||
    typeof body.coverageFloor !== "number" ||
    typeof body.fidelityFloor !== "number" ||
    !KINDS.includes(body.kind as AlleleKind)
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createAllele({
    packId: body.packId,
    label: body.label,
    kind: body.kind as AlleleKind,
    locusHint: body.locusHint,
    coverageFloor: body.coverageFloor,
    fidelityFloor: body.fidelityFloor,
    metricHint: typeof body.metricHint === "string" ? body.metricHint : undefined,
    notes: typeof body.notes === "string" ? body.notes : undefined,
  });
  if (!row) return json({ error: "pack_not_found" }, { status: 404 });
  return json(row);
}
