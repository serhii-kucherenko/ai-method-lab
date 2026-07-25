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
  const body = await req.json();
  const key =
    req.headers.get("idempotency-key") ??
    body.idempotencyKey ??
    `auto-${Date.now()}`;
  const result = ingestWebhook(
    key,
    body,
    req.headers.get("x-signature") ?? body.signature ?? null,
  );
  if (!result.ok) {
    return json({ error: result.error }, { status: 401 });
  }
  return json(result, { status: result.duplicate ? 200 : 201 });
}
