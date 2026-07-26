import { guard, json } from "@/lib/api";
import { listCompares, runCompare } from "@/store";

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
    typeof body.programId !== "string" ||
    typeof body.outcomeId !== "string"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = runCompare({
    name: body.name,
    packId: body.packId,
    countryId: body.countryId,
    programId: body.programId,
    outcomeId: body.outcomeId,
    programBias: body.programBias as never,
    overclaimRisk:
      typeof body.overclaimRisk === "number" ? body.overclaimRisk : undefined,
    hospitalPressure:
      typeof body.hospitalPressure === "number"
        ? body.hospitalPressure
        : undefined,
    policyStickiness:
      typeof body.policyStickiness === "number"
        ? body.policyStickiness
        : undefined,
    nordicParity:
      typeof body.nordicParity === "number" ? body.nordicParity : undefined,
  });
  if (!row) return json({ error: "bad_refs" }, { status: 400 });
  return json(row);
}
