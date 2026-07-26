import { guard, json } from "@/lib/api";
import { listCompares, runCompare, type TreatmentBias } from "@/store";

const BIASES: TreatmentBias[] = [
  "antibiotic_first",
  "balanced",
  "growth_first",
  "untreated_first",
];

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
    typeof body.cohortId !== "string" ||
    typeof body.episodeId !== "string" ||
    typeof body.growthId !== "string"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const bias =
    typeof body.treatmentBias === "string" &&
    BIASES.includes(body.treatmentBias as TreatmentBias)
      ? (body.treatmentBias as TreatmentBias)
      : undefined;
  const row = runCompare({
    name: body.name,
    packId: body.packId,
    cohortId: body.cohortId,
    episodeId: body.episodeId,
    growthId: body.growthId,
    treatmentBias: bias,
    overclaimRisk:
      typeof body.overclaimRisk === "number" ? body.overclaimRisk : undefined,
    growthVulnerability:
      typeof body.growthVulnerability === "number"
        ? body.growthVulnerability
        : undefined,
    shigellaConfirmation:
      typeof body.shigellaConfirmation === "number"
        ? body.shigellaConfirmation
        : undefined,
    cohortFollowUp:
      typeof body.cohortFollowUp === "number" ? body.cohortFollowUp : undefined,
  });
  if (!row) return json({ error: "refs_not_found" }, { status: 404 });
  return json(row);
}
