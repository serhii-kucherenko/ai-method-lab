import { guard, json } from "@/lib/api";
import { getOrg, updateOrg } from "@/store";
import type { PlanKind, ScoreMode } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json({ org: getOrg() });
}

export async function PATCH(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    webhookUrl?: string;
    webhookSecret?: string;
    defaultPlan?: PlanKind;
    defaultMode?: ScoreMode;
    rateLimitPerMinute?: number;
  };
  const org = updateOrg(body);
  return json({ org });
}
