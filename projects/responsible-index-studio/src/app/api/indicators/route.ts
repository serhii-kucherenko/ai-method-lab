import { guard, json } from "@/lib/api";
import {
  createIndicator,
  listIndicators,
  type IndicatorKind,
} from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listIndicators({
      packId: url.searchParams.get("packId") ?? undefined,
      countryId: url.searchParams.get("countryId") ?? undefined,
      dimensionId: url.searchParams.get("dimensionId") ?? undefined,
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
    typeof body.countryId !== "string" ||
    typeof body.dimensionId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string" ||
    typeof body.structuredDepth !== "number" ||
    typeof body.checklistCoverage !== "number" ||
    typeof body.indicatorFidelity !== "number" ||
    typeof body.indicatorReadout !== "number"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createIndicator({
    packId: body.packId,
    countryId: body.countryId,
    dimensionId: body.dimensionId,
    label: body.label,
    kind: body.kind as IndicatorKind,
    structuredDepth: body.structuredDepth,
    checklistCoverage: body.checklistCoverage,
    indicatorFidelity: body.indicatorFidelity,
    indicatorReadout: body.indicatorReadout,
    runNotes: typeof body.runNotes === "string" ? body.runNotes : undefined,
  });
  if (!row) return json({ error: "bad_refs" }, { status: 400 });
  return json(row);
}
