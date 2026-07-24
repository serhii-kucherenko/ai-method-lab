import { createHmac } from "node:crypto";
import { json } from "@/lib/api";
import { getOrg, ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const body = await req.text();
  const signature =
    req.headers.get("x-signature") ?? req.headers.get("x-hub-signature-256");
  const idempotencyKey =
    req.headers.get("idempotency-key") ??
    req.headers.get("x-idempotency-key") ??
    "";
  if (!idempotencyKey) {
    return json({ error: "missing_idempotency_key" }, { status: 400 });
  }
  const result = ingestWebhook(body, signature, idempotencyKey);
  if (!result.ok) {
    return json({ error: result.error }, { status: 401 });
  }
  return json({
    ok: true,
    duplicate: result.duplicate,
    id: result.id,
    org: getOrg().name,
  });
}

/** Helper for local demos — signs a body with the org webhook secret. */
export async function GET() {
  const org = getOrg();
  const sample = JSON.stringify({ event: "trip.updated", tripId: "trip-demo" });
  const sig = createHmac("sha256", org.webhookSecret)
    .update(sample)
    .digest("hex");
  return json({ sample, signature: `sha256=${sig}` });
}
