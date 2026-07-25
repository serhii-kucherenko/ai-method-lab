import { guard, json } from "@/lib/api";
import { listCompares, runCompare } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: listCompares() });
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const compare = runCompare({
    name: body.name ?? "compare",
    packId: body.packId,
    optionId: body.optionId,
    countryId: body.countryId,
    surveyId: body.surveyId,
    prefRunId: body.prefRunId,
    prefBias: body.prefBias ?? body.bias,
    innovationAdherence: body.innovationAdherence,
    innovationTunnel: body.innovationTunnel,
    surveyNoise: body.surveyNoise,
    overclaimRisk: body.overclaimRisk,
  });
  if (!compare) return json({ error: "refs_not_found" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
