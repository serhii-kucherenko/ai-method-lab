import { json } from "@/lib/api";
import { ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const body = (await req.json()) as unknown;
  const idempotencyKey =
    req.headers.get("idempotency-key") ??
    (typeof body === "object" &&
    body &&
    "idempotencyKey" in body &&
    typeof (body as { idempotencyKey: unknown }).idempotencyKey === "string"
      ? (body as { idempotencyKey: string }).idempotencyKey
      : null);
  if (!idempotencyKey) {
    return json({ error: "missing_idempotency_key" }, { status: 400 });
  }
  const result = ingestWebhook(
    idempotencyKey,
    body,
    req.headers.get("x-signature"),
  );
  if (!result.ok) {
    return json({ error: result.error }, { status: 401 });
  }
  return json(result);
}
