import { guard, json } from "@/lib/api";
import { getOrg, updateOrg } from "@/store";
import type { CompressProfile, ScoreMode } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json(getOrg());
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    webhookUrl?: string;
    webhookSecret?: string;
    defaultProfile?: CompressProfile;
    defaultMode?: ScoreMode;
    rateLimitPerMinute?: number;
  };
  const org = updateOrg(body);
  return json(org);
}
