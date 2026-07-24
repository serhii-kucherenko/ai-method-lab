import { json } from "@/lib/api";
import { ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-signature") ?? "";
  const idempotencyKey =
    req.headers.get("idempotency-key") ??
    req.headers.get("x-idempotency-key") ??
    "";
  if (!idempotencyKey) {
    return json({ error: "idempotency_key_required" }, { status: 400 });
  }
  const result = ingestWebhook(body, signature, idempotencyKey);
  if (!result.ok) {
    return json({ error: "invalid_signature" }, { status: 401 });
  }
  return json({
    ok: true,
    duplicate: result.duplicate ?? false,
    eventId: result.event?.id,
  });
}
