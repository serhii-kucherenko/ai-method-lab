import { guard, json } from "@/lib/api";
import { archiveRubric, createRubric, listRubrics } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listRubrics({
      q: url.searchParams.get("q") ?? undefined,
      answerChannel: url.searchParams.get("answerChannel") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      packId: url.searchParams.get("packId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  if (body.action === "archive") {
    const rubric = archiveRubric(body.id);
    if (!rubric) return json({ error: "not_found" }, { status: 404 });
    return json({ rubric });
  }
  const rubric = createRubric(body);
  return json({ rubric }, { status: 201 });
}