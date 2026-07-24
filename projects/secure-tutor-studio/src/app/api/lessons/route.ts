import { guard, json } from "@/lib/api";
import {
  createLesson,
  exportLessonsJson,
  listLessons,
  paginate,
} from "@/store";
import type { ScoreMode, TutorInput, TutorProfile } from "@/domain/types";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  if (url.searchParams.get("format") === "json") {
    const courseId = url.searchParams.get("courseId") ?? undefined;
    return new Response(exportLessonsJson(courseId ?? undefined), {
      headers: { "content-type": "application/json" },
    });
  }
  const courseId = url.searchParams.get("courseId") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listLessons(courseId ?? undefined), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    courseId?: string;
    mode?: ScoreMode;
    profile?: TutorProfile;
    courseLabel?: string;
    tutorInput?: Partial<TutorInput>;
  };
  if (!body.courseId) {
    return json({ error: "course_required" }, { status: 400 });
  }
  try {
    const lesson = createLesson({
      courseId: body.courseId,
      mode: body.mode,
      profile: body.profile,
      courseLabel: body.courseLabel,
      tutorInput: body.tutorInput,
    });
    return json(lesson, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 400 },
    );
  }
}
