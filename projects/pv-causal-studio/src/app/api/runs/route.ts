import { guard, json } from "@/lib/api";
import { createRun, listRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listRuns({
      exposureId: url.searchParams.get("exposureId") ?? undefined,
      cohortId: url.searchParams.get("cohortId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const run = createRun({
    exposureId: body.exposureId,
    cohortId: body.cohortId,
    cohortCoverage: body.cohortCoverage,
    exposureFidelity: body.exposureFidelity,
    confounderControl: body.confounderControl,
    packCompleteness: body.packCompleteness,
    runNotes: body.runNotes,
  });
  if (!run) return json({ error: "invalid_refs" }, { status: 400 });
  return json({ run }, { status: 201 });
}
