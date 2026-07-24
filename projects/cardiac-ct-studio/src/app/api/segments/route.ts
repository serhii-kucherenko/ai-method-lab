import { guard, json } from "@/lib/api";
import { createSegment, listSegments, type SegmentStatus, type StructureName } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const studyId = url.searchParams.get("studyId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listSegments(studyId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    studyId?: string;
    name?: string;
    structure?: StructureName;
    status?: SegmentStatus;
    diceEstimate?: number;
    notes?: string;
  };
  if (!body.studyId || !body.name || !body.structure) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createSegment({
        studyId: body.studyId,
        name: body.name,
        structure: body.structure,
        status: body.status,
        diceEstimate: body.diceEstimate,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
