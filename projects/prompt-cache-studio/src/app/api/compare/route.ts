import { guard, json } from "@/lib/api";
import { createCompare, listCompares } from "@/store";

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
    deploymentId?: string;
  };
  if (!body.deploymentId) {
    return json({ error: "deployment_required" }, { status: 400 });
  }
  try {
    const row = createCompare({
      name: body.name ?? "Cache-aware vs naive",
      deploymentId: body.deploymentId,
    });
    return json(row, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
