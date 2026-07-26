import { guard, json } from "@/lib/api";
import {
  archiveEpisode,
  createEpisode,
  listEpisodes,
  type EpisodeKind,
} from "@/store";

const KINDS: EpisodeKind[] = [
  "culture_confirmed_shigella",
  "pcr_confirmed_shigella",
  "clinical_diarrhea",
  "bloody_diarrhea",
  "custom",
];

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listEpisodes({
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
    const row = archiveEpisode(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json(row);
  }
  if (
    typeof body.packId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string" ||
    !KINDS.includes(body.kind as EpisodeKind) ||
    typeof body.modelHint !== "string" ||
    typeof body.antibioticFloor !== "number" ||
    typeof body.confirmationFloor !== "number"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createEpisode({
    packId: body.packId,
    label: body.label,
    kind: body.kind as EpisodeKind,
    modelHint: body.modelHint,
    antibioticFloor: body.antibioticFloor,
    confirmationFloor: body.confirmationFloor,
    metricHint: typeof body.metricHint === "string" ? body.metricHint : undefined,
    notes: typeof body.notes === "string" ? body.notes : undefined,
  });
  if (!row) return json({ error: "pack_not_found" }, { status: 404 });
  return json(row);
}
