import { guard, json } from "@/lib/api";
import { createStudy, listStudies, type StudyKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "50");
  return json(listStudies(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    studyKind?: StudyKind;
    sliceCount?: number;
    contrastQuality?: number;
    notes?: string;
  };
  if (!body.name || !body.studyKind || body.sliceCount == null || body.contrastQuality == null) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  return json(
    createStudy({
      name: body.name,
      studyKind: body.studyKind,
      sliceCount: body.sliceCount,
      contrastQuality: body.contrastQuality,
      notes: body.notes,
    }),
    { status: 201 },
  );
}
