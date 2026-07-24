import { guard, json } from "@/lib/api";
import { createRun, listRuns, type PlanKind, type RunStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const cohortId = url.searchParams.get("cohortId") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listRuns(cohortId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    cohortId?: string;
    name?: string;
    status?: RunStatus;
    plan?: PlanKind;
    calibrationPrior?: number;
    notes?: string;
  };
  if (!body.cohortId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createRun({
        cohortId: body.cohortId,
        name: body.name,
        status: body.status,
        plan: body.plan,
        calibrationPrior: body.calibrationPrior,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
