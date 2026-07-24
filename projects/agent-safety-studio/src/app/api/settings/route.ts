import { guard, json } from "@/lib/api";
import { getOrg, updateOrg, type DeployMode } from "@/store";
import type { MonitorProfile } from "@/domain/types";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json(getOrg());
}

export async function PATCH(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    webhookUrl?: string;
    webhookSecret?: string;
    bearerToken?: string;
    defaultProfile?: MonitorProfile;
    defaultDeployMode?: DeployMode;
    rateLimitPerMinute?: number;
  };
  return json(updateOrg(body));
}
