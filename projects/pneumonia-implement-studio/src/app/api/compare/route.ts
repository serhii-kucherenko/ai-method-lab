import { guard, json } from "@/lib/api";
import { listCompares, runCompare, type ImplementationBias } from "@/store";

const BIASES: ImplementationBias[] = [
  "codesign_first",
  "balanced",
  "fidelity_first",
  "status_quo_first",
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
    typeof body.districtId !== "string" ||
    typeof body.pathwayId !== "string" ||
    typeof body.fidelityId !== "string"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const bias =
    typeof body.implementationBias === "string" &&
    BIASES.includes(body.implementationBias as ImplementationBias)
      ? (body.implementationBias as ImplementationBias)
      : undefined;
  const row = runCompare({
    name: body.name,
    packId: body.packId,
    districtId: body.districtId,
    pathwayId: body.pathwayId,
    fidelityId: body.fidelityId,
    implementationBias: bias,
    overclaimRisk:
      typeof body.overclaimRisk === "number" ? body.overclaimRisk : undefined,
    pathwayClarity:
      typeof body.pathwayClarity === "number" ? body.pathwayClarity : undefined,
    communityEngagement:
      typeof body.communityEngagement === "number"
        ? body.communityEngagement
        : undefined,
    districtCoverage:
      typeof body.districtCoverage === "number"
        ? body.districtCoverage
        : undefined,
  });
  if (!row) return json({ error: "refs_not_found" }, { status: 404 });
  return json(row);
}
