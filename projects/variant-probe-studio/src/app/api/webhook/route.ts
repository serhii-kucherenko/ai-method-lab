import { json } from "@/lib/api";
import { ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const body = await req.json();
  const idempotencyKey =
    req.headers.get("idempotency-key") ??
    (typeof body?.idempotencyKey === "string"
      ? body.idempotencyKey
      : "missing");
  const signature = req.headers.get("x-signature");
  const result = ingestWebhook(idempotencyKey, body, signature);
  if (!result.ok) {
    return json({ error: result.error }, { status: 401 });
  }
  return json(result, { status: result.duplicate ? 200 : 201 });
}
