import { guard, json } from "@/lib/api";
import { archiveSurvey, createSurvey, listSurveys } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listSurveys({
      q: url.searchParams.get("q") ?? undefined,
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
    const row = archiveSurvey(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json({ survey: row });
  }
  const row = createSurvey({
    packId: body.packId,
    label: body.label,
    mode: body.mode,
    instrumentHint: body.instrumentHint ?? "",
    itemCount: Number(body.itemCount ?? 10),
    responseFloor: Number(body.responseFloor ?? 0.3),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!row) return json({ error: "bad_request" }, { status: 400 });
  return json({ survey: row }, { status: 201 });
}
