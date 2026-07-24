import { guard, json } from "@/lib/api";
import { getOrg, updateOrg, type PlanKind, type ScoreMode } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json(getOrg());
}

export async function PATCH(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as Partial<{
    name: string;
    webhookUrl: string;
    webhookSecret: string;
    bearerToken: string;
    defaultPlan: PlanKind;
    defaultMode: ScoreMode;
    rateLimitPerMinute: number;
  }>;
  return json(updateOrg(body));
}
