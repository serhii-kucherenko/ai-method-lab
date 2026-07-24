import { guard, json } from "@/lib/api";
import { getOrg, updateOrg } from "@/store";
import type { TrainingProfile } from "@/domain/types";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json(getOrg());
}

export async function PATCH(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = (await req.json()) as {
    name?: string;
    webhookUrl?: string;
    webhookSecret?: string;
    defaultProfile?: TrainingProfile;
    rateLimitPerMinute?: number;
  };
  return json(updateOrg(body));
}
