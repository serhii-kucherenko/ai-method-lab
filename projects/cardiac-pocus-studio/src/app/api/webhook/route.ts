import { json } from "@/lib/api";
import { ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const body = await req.json();
  const key =
    req.headers.get("idempotency-key") ??
    (typeof body === "object" &&
    body &&
    "idempotencyKey" in body &&
    typeof (body as { idempotencyKey: unknown }).idempotencyKey === "string"
      ? (body as { idempotencyKey: string }).idempotencyKey
      : null);
  if (!key) return json({ error: "missing_idempotency_key" }, { status: 400 });
  const result = ingestWebhook(
    key,
    body,
    req.headers.get("x-signature") ?? req.headers.get("x-hub-signature-256"),
  );
  if (!result.ok) return json(result, { status: 401 });
  return json(result, { status: result.duplicate ? 200 : 201 });
}
