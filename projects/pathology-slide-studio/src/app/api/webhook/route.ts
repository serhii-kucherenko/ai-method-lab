import { json } from "@/lib/api";
import { ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-signature") ?? "";
  const idempotencyKey =
    req.headers.get("x-idempotency-key") ?? `auto-${Date.now()}`;
  const result = ingestWebhook(body, signature, idempotencyKey);
  if (!result.ok) {
    return json({ error: "invalid_signature" }, { status: 401 });
  }
  return json({
    ok: true,
    duplicate: result.duplicate ?? false,
    event: result.event,
  });
}
