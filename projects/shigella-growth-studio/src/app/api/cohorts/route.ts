import { guard, json } from "@/lib/api";
import {
  archiveCohort,
  createCohort,
  listCohorts,
  type CohortKind,
} from "@/store";

const KINDS: CohortKind[] = [
  "infant_under_12m",
  "toddler_12_24m",
  "preschool_24_59m",
  "mixed_under_5",
  "custom",
];

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listCohorts({
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
    const row = archiveCohort(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json(row);
  }
  if (
    typeof body.packId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string" ||
    !KINDS.includes(body.kind as CohortKind) ||
    typeof body.siteHint !== "string" ||
    typeof body.severityCeiling !== "number" ||
    typeof body.followUpFloor !== "number"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createCohort({
    packId: body.packId,
    label: body.label,
    kind: body.kind as CohortKind,
    siteHint: body.siteHint,
    severityCeiling: body.severityCeiling,
    followUpFloor: body.followUpFloor,
    metricHint: typeof body.metricHint === "string" ? body.metricHint : undefined,
    notes: typeof body.notes === "string" ? body.notes : undefined,
  });
  if (!row) return json({ error: "pack_not_found" }, { status: 404 });
  return json(row);
}
