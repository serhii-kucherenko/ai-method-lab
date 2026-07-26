import { guard, json } from "@/lib/api";
import { archiveScreen, createScreen, listScreens } from "@/store";
import type { ScreenKind } from "@/domain/types";

const KINDS: ScreenKind[] = [
  "docking_pharmacophore",
  "pf_dhodh_pocket",
  "parasite_selective_panel",
  "screen_cohort",
  "composite_pack",
  "custom",
];

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listScreens({
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
    const row = archiveScreen(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json(row);
  }
  if (
    typeof body.packId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string" ||
    typeof body.pocketHint !== "string" ||
    typeof body.coverageFloor !== "number" ||
    typeof body.fidelityFloor !== "number" ||
    !KINDS.includes(body.kind as ScreenKind)
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createScreen({
    packId: body.packId,
    label: body.label,
    kind: body.kind as ScreenKind,
    pocketHint: body.pocketHint,
    coverageFloor: body.coverageFloor,
    fidelityFloor: body.fidelityFloor,
    metricHint: typeof body.metricHint === "string" ? body.metricHint : undefined,
    notes: typeof body.notes === "string" ? body.notes : undefined,
  });
  if (!row) return json({ error: "pack_not_found" }, { status: 404 });
  return json(row);
}
