import { guard, json } from "@/lib/api";
import { createCompare, listCompares, type InferInput } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ items: listCompares() });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    deviceId?: string;
    patch?: Partial<InferInput>;
  };
  if (!body.name || !body.deviceId) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createCompare({
        name: body.name,
        deviceId: body.deviceId,
        patch: body.patch,
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
