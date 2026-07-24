import { guard, json } from "@/lib/api";
import { createAnnotation, listAnnotations, type AnnotationStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const studyId = url.searchParams.get("studyId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listAnnotations(studyId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    studyId?: string;
    name?: string;
    status?: AnnotationStatus;
    expertCoverage?: number;
    priority?: number;
    notes?: string;
  };
  if (!body.studyId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createAnnotation({
        studyId: body.studyId,
        name: body.name,
        status: body.status,
        expertCoverage: body.expertCoverage,
        priority: body.priority,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
