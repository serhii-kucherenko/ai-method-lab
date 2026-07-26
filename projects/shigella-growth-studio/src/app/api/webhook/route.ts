import { guard, json } from "@/lib/api";
import { ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const idempotencyKey =
    req.headers.get("idempotency-key") ??
    req.headers.get("x-idempotency-key") ??
    "";
  if (!idempotencyKey) {
    return json({ error: "missing_idempotency_key" }, { status: 400 });
  }
  const payload = await req.json();
  const signature =
    req.headers.get("x-signature") ?? req.headers.get("x-hub-signature-256");
  const result = ingestWebhook(idempotencyKey, payload, signature);
  if (!result.ok) {
    return json({ error: result.error }, { status: 401 });
  }
  return json(result);
}
