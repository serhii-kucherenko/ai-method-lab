import { guard, json } from "@/lib/api";
import {
  createDiffusionRun,
  listDiffusionRuns,
  type DiffusionStatus,
} from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listDiffusionRuns(
      url.searchParams.get("pocketId") ?? undefined,
      url.searchParams.get("q") ?? undefined,
    ),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    pocketId?: string;
    name?: string;
    status?: DiffusionStatus;
    steps?: number;
    pocketConditioning?: number;
    notes?: string;
  };
  if (!body.pocketId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createDiffusionRun({
        pocketId: body.pocketId,
        name: body.name,
        status: body.status,
        steps: body.steps,
        pocketConditioning: body.pocketConditioning,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
