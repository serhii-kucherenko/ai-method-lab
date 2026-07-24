import { json } from "@/lib/api";
import { ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-dds-signature") ?? "";
  const idempotencyKey =
    req.headers.get("idempotency-key") ??
    req.headers.get("x-idempotency-key") ??
    "";
  if (!idempotencyKey) {
    return json({ error: "missing_idempotency_key" }, { status: 400 });
  }
  const result = ingestWebhook(body, signature, idempotencyKey);
  if (!result.ok) return json({ error: "invalid_signature" }, { status: 401 });
  return json({
    ok: true,
    duplicate: Boolean(result.duplicate),
    eventId: result.event?.id,
  });
}
