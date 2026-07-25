import { json } from "@/lib/api";
import { ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature");
  const idempotencyKey = req.headers.get("idempotency-key");
  const result = ingestWebhook(rawBody, signature, idempotencyKey);
  if (!result.ok) return json(result, { status: 401 });
  return json(result, { status: result.duplicate ? 200 : 201 });
}
