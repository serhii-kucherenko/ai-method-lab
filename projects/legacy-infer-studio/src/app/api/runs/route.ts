import { guard, json } from "@/lib/api";
import {
  createRun,
  listRuns,
  type PlanKind,
  type ScoreMode,
} from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(listRuns(url.searchParams.get("deviceId") ?? undefined));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    deviceId?: string;
    name?: string;
    mode?: ScoreMode;
    plan?: PlanKind;
  };
  if (!body.deviceId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createRun({
        deviceId: body.deviceId,
        name: body.name,
        mode: body.mode,
        plan: body.plan,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
