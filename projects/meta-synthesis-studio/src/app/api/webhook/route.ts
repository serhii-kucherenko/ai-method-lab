import { json } from "@/lib/api";
import { ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const body = await req.text();
  const signature =
    req.headers.get("x-signature") ?? req.headers.get("x-hub-signature-256");
  const idempotencyKey = req.headers.get("idempotency-key") ?? "missing";
  const result = ingestWebhook(body, signature, idempotencyKey);
  if (!result.ok) return json(result, { status: 401 });
  return json(result, { status: result.duplicate ? 200 : 201 });
}
