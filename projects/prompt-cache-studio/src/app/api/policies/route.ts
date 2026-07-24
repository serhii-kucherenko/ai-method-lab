import { guard, json } from "@/lib/api";
import { createPolicy, listPolicies } from "@/store";
import type { CompressProfile, ScoreMode } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const deploymentId = url.searchParams.get("deploymentId") ?? undefined;
  return json({ items: listPolicies(deploymentId) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    deploymentId?: string;
    name?: string;
    mode?: ScoreMode;
    profile?: CompressProfile;
  };
  if (!body.deploymentId || !body.name?.trim()) {
    return json({ error: "deployment_and_name_required" }, { status: 400 });
  }
  try {
    const row = createPolicy({
      deploymentId: body.deploymentId,
      name: body.name,
      mode: body.mode,
      profile: body.profile,
    });
    return json(row, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
