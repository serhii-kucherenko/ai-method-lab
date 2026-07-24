import { json } from "@/lib/api";
import { receiveWebhook } from "@/store";

export async function POST(req: Request) {
  const idempotencyKey =
    req.headers.get("idempotency-key") ?? req.headers.get("x-idempotency-key");
  if (!idempotencyKey) {
    return json({ error: "missing_idempotency_key" }, { status: 400 });
  }
  const signature =
    req.headers.get("x-signature") ?? req.headers.get("x-hub-signature-256");
  const payload = await req.json().catch(() => ({}));
  const result = receiveWebhook(idempotencyKey, payload, signature);
  if (!result.ok) {
    return json({ error: result.error }, { status: 401 });
  }
  return json(result, { status: result.duplicate ? 200 : 201 });
}
