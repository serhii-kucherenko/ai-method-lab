import { guard, json } from "@/lib/api";
import { createBudget, listBudgets, type KernelOp } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listBudgets(
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
    vramMb?: number;
    efficiency?: number;
    notes?: string;
  };
  if (!body.deviceId || !body.name || !body.op) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createBudget({
        deviceId: body.deviceId,
        name: body.name,
        op: body.op,
        vramMb: body.vramMb,
        efficiency: body.efficiency,
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
