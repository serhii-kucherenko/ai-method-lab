import { guard, json } from "@/lib/api";
import { createCourse, listCourses, paginate } from "@/store";
import type { CourseKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listCourses(q), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    kind?: CourseKind;
    vulnComplexity?: number;
    threatCoverage?: number;
    notes?: string;
  };
  if (!body.name?.trim()) {
    return json({ error: "name_required" }, { status: 400 });
  }
  const course = createCourse({
    name: body.name,
    kind: body.kind ?? "web",
    vulnComplexity: body.vulnComplexity ?? 0.5,
    threatCoverage: body.threatCoverage ?? 0.5,
    notes: body.notes ?? "",
  });
  return json(course, { status: 201 });
}
