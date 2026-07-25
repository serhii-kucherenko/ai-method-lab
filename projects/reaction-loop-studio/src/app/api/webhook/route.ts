import { json } from "@/lib/api";
import { ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const body = await req.json();
  const key =
    req.headers.get("idempotency-key") ??
    (typeof body?.idempotencyKey === "string" ? body.idempotencyKey : "");
  if (!key) return json({ error: "missing_idempotency_key" }, { status: 400 });
  const result = ingestWebhook(key, body, req.headers.get("x-signature"));
  if (!result.ok) return json(result, { status: 401 });
  return json(result, { status: result.duplicate ? 200 : 201 });
}
