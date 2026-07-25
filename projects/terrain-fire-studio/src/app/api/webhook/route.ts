import { createHmac } from "node:crypto";
import { json } from "@/lib/api";
import { getOrg, ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const idempotencyKey =
    req.headers.get("idempotency-key") ??
    String((body as { idempotencyKey?: string }).idempotencyKey ?? "");
  if (!idempotencyKey) {
    return json({ error: "idempotency_key_required" }, { status: 400 });
  }
  let signature = req.headers.get("x-signature");
  if (!signature) {
    const secret = getOrg().webhookSecret;
    const expected = createHmac("sha256", secret)
      .update(JSON.stringify(body ?? {}))
      .digest("hex");
    signature = `sha256=${expected}`;
  }
  const result = ingestWebhook(idempotencyKey, body, signature);
  if (!result.ok) return json(result, { status: 401 });
  return json(result, { status: result.duplicate ? 200 : 201 });
}
