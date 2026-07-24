import { json } from "@/lib/api";
import { checkRateLimit, ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const rl = checkRateLimit();
  if (!rl.ok) {
    return json({ error: "rate_limit" }, { status: 429 });
  }
  const body = await req.text();
  const signature = req.headers.get("x-signature");
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
  return json(result, { status: result.duplicate ? 200 : 201 });
}
