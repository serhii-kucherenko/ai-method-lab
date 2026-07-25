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
    name: body.name != null ? String(body.name) : undefined,
    webhookUrl: body.webhookUrl != null ? String(body.webhookUrl) : undefined,
    webhookSecret:
      body.webhookSecret != null ? String(body.webhookSecret) : undefined,
    rateLimitPerMinute:
      body.rateLimitPerMinute != null
        ? Number(body.rateLimitPerMinute)
        : undefined,
    defaultHorizonBias: body.defaultHorizonBias,
    defaultMode: body.defaultMode,
  });
  return json({ org });
}
