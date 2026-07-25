import { guard, json } from "@/lib/api";
import { listCompares, runCompare } from "@/store";
import type { GateBias } from "@/store";

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
    name: String(body.name ?? "Fail gate compare"),
    caseId: String(body.caseId ?? ""),
    taxonomyId: String(body.taxonomyId ?? ""),
    inspectionId: String(body.inspectionId ?? ""),
    gateBias: body.gateBias as GateBias | undefined,
    answerMatch: body.answerMatch != null ? Number(body.answerMatch) : undefined,
    fluencyScore:
      body.fluencyScore != null ? Number(body.fluencyScore) : undefined,
    harmProximity:
      body.harmProximity != null ? Number(body.harmProximity) : undefined,
    scopeDrift: body.scopeDrift != null ? Number(body.scopeDrift) : undefined,
  });
  if (!compare) return json({ error: "missing_entities" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
