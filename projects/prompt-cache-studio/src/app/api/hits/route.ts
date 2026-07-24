import { guard, json } from "@/lib/api";
import { listHits, recordHit } from "@/store";
import type { HitOutcome } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const deploymentId = url.searchParams.get("deploymentId") ?? undefined;
  return json({ items: listHits(deploymentId) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    deploymentId?: string;
    policyId?: string;
    outcome?: HitOutcome;
    prefixHash?: string;
    detail?: string;
  };
  if (!body.deploymentId || !body.policyId || !body.outcome) {
    return json({ error: "deployment_policy_outcome_required" }, { status: 400 });
  }
  try {
    const row = recordHit({
      deploymentId: body.deploymentId,
      policyId: body.policyId,
      outcome: body.outcome,
      prefixHash: body.prefixHash,
      detail: body.detail,
    });
    return json(row, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
