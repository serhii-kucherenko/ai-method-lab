import { guard, json } from "@/lib/api";
import { createTier, listTiers } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const deploymentId = url.searchParams.get("deploymentId") ?? undefined;
  return json({ items: listTiers(deploymentId) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    deploymentId?: string;
    label?: string;
    cachedUsdPerMTok?: number;
    uncachedUsdPerMTok?: number;
    ttlMinutes?: number;
  };
  if (!body.deploymentId || !body.label?.trim()) {
    return json({ error: "deployment_and_label_required" }, { status: 400 });
  }
  try {
    const row = createTier({
      deploymentId: body.deploymentId,
      label: body.label,
      cachedUsdPerMTok: body.cachedUsdPerMTok ?? 0.3,
      uncachedUsdPerMTok: body.uncachedUsdPerMTok ?? 3,
      ttlMinutes: body.ttlMinutes ?? 60,
    });
    return json(row, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
