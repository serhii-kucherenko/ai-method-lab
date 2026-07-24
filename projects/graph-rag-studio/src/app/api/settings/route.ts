import { guard, json } from "@/lib/api";
import { getOrg, updateOrg } from "@/store";

export function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json(getOrg());
}

export async function PATCH(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as Record<string, unknown>;
  const patch: Record<string, unknown> = {};
  for (const key of [
    "name",
    "webhookUrl",
    "webhookSecret",
    "bearerToken",
    "defaultProfile",
    "rateLimitPerMinute",
  ] as const) {
    if (key in body) patch[key] = body[key];
  }
  return json(updateOrg(patch as Parameters<typeof updateOrg>[0]));
}
