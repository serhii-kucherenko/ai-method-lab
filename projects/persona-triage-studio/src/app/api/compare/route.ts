import { guard, json } from "@/lib/api";
import { listCompares, runCompare } from "@/store";
import type { StyleBias } from "@/store";

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
    name: String(body.name ?? "Style-aware vs idealized"),
    caseId: String(body.caseId ?? ""),
    personaId: String(body.personaId ?? ""),
    urgencyRunId: String(body.urgencyRunId ?? ""),
    styleBias: body.styleBias as StyleBias | undefined,
    articulationScore:
      body.articulationScore != null
        ? Number(body.articulationScore)
        : undefined,
    cooperationScore:
      body.cooperationScore != null ? Number(body.cooperationScore) : undefined,
    ambiguityPressure:
      body.ambiguityPressure != null
        ? Number(body.ambiguityPressure)
        : undefined,
    affectPressure:
      body.affectPressure != null ? Number(body.affectPressure) : undefined,
  });
  if (!compare) return json({ error: "missing_entities" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
