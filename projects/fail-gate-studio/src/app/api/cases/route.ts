import { guard, json } from "@/lib/api";
import { createCase, listCases } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listCases({
      q: url.searchParams.get("q") ?? undefined,
      specialty: url.searchParams.get("specialty") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const failCase = createCase({
    packId: body.packId ? String(body.packId) : undefined,
    label: String(body.label ?? "Untitled fail case"),
    specialty: String(body.specialty ?? "general"),
    promptHash: String(body.promptHash ?? ""),
    modelAnswerHash: String(body.modelAnswerHash ?? ""),
    severityHint: Number(body.severityHint ?? 0.5),
    notes: body.notes ? String(body.notes) : "",
  });
  return json({ case: failCase }, { status: 201 });
}
