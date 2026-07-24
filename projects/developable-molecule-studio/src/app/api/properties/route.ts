import { guard, json } from "@/lib/api";
import { createPropertyEntry, listProperties } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listProperties(
      url.searchParams.get("candidateId") ?? undefined,
      url.searchParams.get("q") ?? undefined,
    ),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    candidateId?: string;
    name?: string;
    solubility?: number;
    clearanceRisk?: number;
    toxicityRisk?: number;
    synthesizability?: number;
    lipophilicity?: number;
    notes?: string;
  };
  if (!body.candidateId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createPropertyEntry({
        candidateId: body.candidateId,
        name: body.name,
        solubility: body.solubility,
        clearanceRisk: body.clearanceRisk,
        toxicityRisk: body.toxicityRisk,
        synthesizability: body.synthesizability,
        lipophilicity: body.lipophilicity,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
