import { guard, json } from "@/lib/api";
import { createKernel, listKernels, type KernelOp } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listKernels(
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
    op?: KernelOp;
    rewriteSummary?: string;
    speedupHint?: number;
    notes?: string;
  };
  if (!body.deviceId || !body.name || !body.op || !body.rewriteSummary) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createKernel({
        deviceId: body.deviceId,
        name: body.name,
        op: body.op,
        rewriteSummary: body.rewriteSummary,
        speedupHint: body.speedupHint,
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
