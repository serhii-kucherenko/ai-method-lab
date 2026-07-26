import { guard, json } from "@/lib/api";
import {
  createGrowth,
  listGrowth,
  type GrowthAssayKind,
} from "@/store";

const KINDS: GrowthAssayKind[] = [
  "haz_delta",
  "linear_growth_velocity",
  "wasting_risk",
  "catchup_potential",
  "custom",
];

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listGrowth({
      packId: url.searchParams.get("packId") ?? undefined,
      cohortId: url.searchParams.get("cohortId") ?? undefined,
      episodeId: url.searchParams.get("episodeId") ?? undefined,
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
    typeof body.cohortId !== "string" ||
    typeof body.episodeId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string" ||
    !KINDS.includes(body.kind as GrowthAssayKind) ||
    typeof body.antibioticCoverage !== "number" ||
    typeof body.episodeSeverity !== "number" ||
    typeof body.untreatedDuration !== "number" ||
    typeof body.growthAssaySignal !== "number"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createGrowth({
    packId: body.packId,
    cohortId: body.cohortId,
    episodeId: body.episodeId,
    label: body.label,
    kind: body.kind as GrowthAssayKind,
    antibioticCoverage: body.antibioticCoverage,
    episodeSeverity: body.episodeSeverity,
    untreatedDuration: body.untreatedDuration,
    growthAssaySignal: body.growthAssaySignal,
    runNotes: typeof body.runNotes === "string" ? body.runNotes : undefined,
  });
  if (!row) return json({ error: "refs_not_found" }, { status: 404 });
  return json(row);
}
