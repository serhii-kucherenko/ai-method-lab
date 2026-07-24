import { guard, json } from "@/lib/api";
import { createPhenotype, listPhenotypes, type PhenotypeStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const studyId = url.searchParams.get("studyId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listPhenotypes(studyId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    studyId?: string;
    name?: string;
    status?: PhenotypeStatus;
    richness?: number;
    calciumBurden?: number;
    chamberIndex?: number;
    notes?: string;
  };
  if (!body.studyId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createPhenotype({
        studyId: body.studyId,
        name: body.name,
        status: body.status,
        richness: body.richness,
        calciumBurden: body.calciumBurden,
        chamberIndex: body.chamberIndex,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
