import { guard, json } from "@/lib/api";
import { createExam, listExams, type ExamKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "50");
  return json(listExams(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    examKind?: ExamKind;
    viewCount?: number;
    imageQuality?: number;
    notes?: string;
  };
  if (!body.name || !body.examKind || body.viewCount == null || body.imageQuality == null) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  return json(
    createExam({
      name: body.name,
      examKind: body.examKind,
      viewCount: body.viewCount,
      imageQuality: body.imageQuality,
      notes: body.notes,
    }),
    { status: 201 },
  );
}
