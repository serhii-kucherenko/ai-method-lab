import { json } from "@/lib/api";
import { checkBearer, checkRateLimit, ingestWebhook } from "@/store";

export async function POST(req: Request) {
  if (!checkBearer(req.headers.get("authorization"))) {
    return json({ error: "unauthorized" }, { status: 401 });
  }
  const rl = checkRateLimit();
  if (!rl.ok) {
    return json({ error: "rate_limit" }, { status: 429 });
  }
  const idempotencyKey =
    req.headers.get("idempotency-key") ??
    req.headers.get("x-idempotency-key") ??
    "";
  if (!idempotencyKey) {
    return json({ error: "missing_idempotency_key" }, { status: 400 });
  }
  const payload = await req.json();
  const result = ingestWebhook(
    idempotencyKey,
    payload,
    req.headers.get("x-signature") ?? req.headers.get("x-hub-signature-256"),
  );
  if (!result.ok) {
    return json({ error: result.error }, { status: 401 });
  }
  return json(result, { status: result.duplicate ? 200 : 201 });
}
