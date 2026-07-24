import { guard, json } from "@/lib/api";
import {
  createFinding,
  listFindings,
  type DiseaseLabel,
  type FindingStatus,
} from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const examId = url.searchParams.get("examId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listFindings(examId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    examId?: string;
    name?: string;
    disease?: DiseaseLabel;
    status?: FindingStatus;
    confidence?: number;
    notes?: string;
  };
  if (!body.examId || !body.name || !body.disease) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createFinding({
        examId: body.examId,
        name: body.name,
        disease: body.disease,
        status: body.status,
        confidence: body.confidence,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
