import { guard, json } from "@/lib/api";
import { createTrajectory, listTrajectories } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listTrajectories({
      outcomeId: url.searchParams.get("outcomeId") ?? undefined,
      cohortId: url.searchParams.get("cohortId") ?? undefined,
      predictorId: url.searchParams.get("predictorId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const trajectory = createTrajectory({
    outcomeId: body.outcomeId,
    cohortId: body.cohortId,
    predictorId: body.predictorId,
    multiDomainCoverage: Number(body.multiDomainCoverage),
    jointClassClarity: Number(body.jointClassClarity),
    trajectorySeparation: Number(body.trajectorySeparation),
    packReadiness: Number(body.packReadiness),
    runNotes: body.runNotes,
  });
  if (!trajectory) return json({ error: "refs_not_found" }, { status: 400 });
  return json({ trajectory }, { status: 201 });
}
