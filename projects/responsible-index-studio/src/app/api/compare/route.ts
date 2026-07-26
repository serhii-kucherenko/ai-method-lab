import { guard, json } from "@/lib/api";
import { listCompares, runCompare, type ScoringBias } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ items: listCompares() });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as Record<string, unknown>;
  if (
    typeof body.name !== "string" ||
    typeof body.packId !== "string" ||
    typeof body.countryId !== "string" ||
    typeof body.dimensionId !== "string" ||
    typeof body.indicatorId !== "string"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = runCompare({
    name: body.name,
    packId: body.packId,
    countryId: body.countryId,
    dimensionId: body.dimensionId,
    indicatorId: body.indicatorId,
    scoringBias:
      typeof body.scoringBias === "string"
        ? (body.scoringBias as ScoringBias)
        : undefined,
    overclaimRisk:
      typeof body.overclaimRisk === "number" ? body.overclaimRisk : undefined,
  });
  if (!row) return json({ error: "refs_not_found" }, { status: 404 });
  return json(row);
}
