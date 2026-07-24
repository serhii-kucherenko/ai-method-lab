import { guard, json } from "@/lib/api";
import {
  createStage,
  listStages,
  type InferStageKind,
  type StageStatus,
} from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listStages(
      url.searchParams.get("deviceId") ?? undefined,
      url.searchParams.get("q") ?? undefined,
    ),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    deviceId?: string;
    name?: string;
    kind?: InferStageKind;
    status?: StageStatus;
    agreement?: number;
    notes?: string;
  };
  if (!body.deviceId || !body.name || !body.kind) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createStage({
        deviceId: body.deviceId,
        name: body.name,
        kind: body.kind,
        status: body.status,
        agreement: body.agreement,
        notes: body.notes,
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
