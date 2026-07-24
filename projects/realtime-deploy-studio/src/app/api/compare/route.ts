import { guard, json } from "@/lib/api";
import { createCompare, listCompares } from "@/store";
import type { DeployInput } from "@/domain/types";

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
    appId?: string;
    deployInput?: DeployInput;
  };
  if (!body.name?.trim() || !body.appId || !body.deployInput) {
    return json({ error: "fields_required" }, { status: 400 });
  }
  try {
    const row = createCompare({
      name: body.name,
      appId: body.appId,
      deployInput: body.deployInput,
    });
    return json(row, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 400 },
    );
  }
}
