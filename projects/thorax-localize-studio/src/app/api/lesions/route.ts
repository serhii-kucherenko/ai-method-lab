import { guard, json } from "@/lib/api";
import { createLesion, listLesions, type LesionStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const examId = url.searchParams.get("examId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listLesions(examId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    examId?: string;
    findingId?: string;
    name?: string;
    status?: LesionStatus;
    boundaryClarity?: number;
    laterality?: "left" | "right" | "bilateral" | "midline";
    notes?: string;
  };
  if (!body.examId || !body.findingId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createLesion({
        examId: body.examId,
        findingId: body.findingId,
        name: body.name,
        status: body.status,
        boundaryClarity: body.boundaryClarity,
        laterality: body.laterality,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
