import { guard, json } from "@/lib/api";
import { getOrg, updateOrg } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ org: getOrg() });
}

export async function PATCH(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const org = updateOrg({
    ...(body.name != null ? { name: String(body.name) } : {}),
    ...(body.webhookUrl != null
      ? { webhookUrl: String(body.webhookUrl) }
      : {}),
    ...(body.webhookSecret != null
      ? { webhookSecret: String(body.webhookSecret) }
      : {}),
    ...(body.rateLimitPerMinute != null
      ? { rateLimitPerMinute: Number(body.rateLimitPerMinute) }
      : {}),
    ...(body.defaultMemoryBias != null
      ? { defaultMemoryBias: body.defaultMemoryBias }
      : {}),
    ...(body.defaultMode != null ? { defaultMode: body.defaultMode } : {}),
    ...(body.honestyAckedAt != null
      ? { honestyAckedAt: String(body.honestyAckedAt) }
      : {}),
  });
  return json({ org });
}
