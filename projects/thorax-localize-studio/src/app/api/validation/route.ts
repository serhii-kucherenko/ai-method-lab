import { guard, json } from "@/lib/api";
import {
  createValidation,
  listValidations,
  type ValidationStatus,
} from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const examId = url.searchParams.get("examId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listValidations(examId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    examId?: string;
    name?: string;
    status?: ValidationStatus;
    confidence?: number;
    priority?: number;
    notes?: string;
  };
  if (!body.examId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createValidation({
        examId: body.examId,
        name: body.name,
        status: body.status,
        confidence: body.confidence,
        priority: body.priority,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
