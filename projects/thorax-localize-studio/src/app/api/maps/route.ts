import { guard, json } from "@/lib/api";
import { createMap, listMaps, type MapStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const examId = url.searchParams.get("examId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listMaps(examId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    examId?: string;
    lesionId?: string;
    name?: string;
    status?: MapStatus;
    peakStrength?: number;
    coherence?: number;
    notes?: string;
  };
  if (!body.examId || !body.lesionId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createMap({
        examId: body.examId,
        lesionId: body.lesionId,
        name: body.name,
        status: body.status,
        peakStrength: body.peakStrength,
        coherence: body.coherence,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
