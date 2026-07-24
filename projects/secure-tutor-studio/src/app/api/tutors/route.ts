import { guard, json } from "@/lib/api";
import { createTutor, listTutors, setTutorActive } from "@/store";
import type { TutorRoleKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const courseId = url.searchParams.get("courseId") ?? undefined;
  return json({ items: listTutors(courseId) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    courseId?: string;
    name?: string;
    kind?: TutorRoleKind;
    specialization?: number;
    active?: boolean;
  };
  try {
    if (!body.courseId || !body.name?.trim() || !body.kind) {
      return json({ error: "course_name_kind_required" }, { status: 400 });
    }
    const tutor = createTutor({
      courseId: body.courseId,
      name: body.name,
      kind: body.kind,
      specialization: body.specialization ?? 0.6,
      active: body.active,
    });
    return json(tutor, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 400 },
    );
  }
}

export async function PATCH(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as { id?: string; active?: boolean };
  try {
    if (!body.id || body.active == null) {
      return json({ error: "id_active_required" }, { status: 400 });
    }
    return json(setTutorActive(body.id, body.active));
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 400 },
    );
  }
}
