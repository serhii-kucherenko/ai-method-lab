import { guard, json } from "@/lib/api";
import { createPrefRun, listPrefRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listPrefRuns({
      packId: url.searchParams.get("packId") ?? undefined,
      optionId: url.searchParams.get("optionId") ?? undefined,
      countryId: url.searchParams.get("countryId") ?? undefined,
      surveyId: url.searchParams.get("surveyId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const run = createPrefRun({
    packId: body.packId,
    optionId: body.optionId,
    countryId: body.countryId,
    surveyId: body.surveyId,
    safetyPreference: Number(body.safetyPreference),
    oversightSupport: Number(body.oversightSupport),
    coordinationPreference: Number(body.coordinationPreference),
    packReadiness: Number(body.packReadiness),
    runNotes: body.runNotes,
  });
  if (!run) return json({ error: "refs_not_found" }, { status: 400 });
  return json({ run }, { status: 201 });
}
