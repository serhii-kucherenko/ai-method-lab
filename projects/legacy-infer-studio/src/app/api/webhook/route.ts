import { json } from "@/lib/api";
import { ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const rawBody = await req.text();
  let payload: unknown = {};
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return json({ error: "invalid_json" }, { status: 400 });
  }
  const key =
    req.headers.get("idempotency-key") ??
    req.headers.get("x-idempotency-key") ??
    "";
  if (!key) return json({ error: "missing_idempotency_key" }, { status: 400 });
  const result = ingestWebhook(
    key,
    req.headers.get("x-signature") ?? req.headers.get("x-hub-signature-256"),
    rawBody,
    payload,
  );
  if (!result.ok) {
    return json({ error: result.error }, { status: 401 });
  }
  return json(result, { status: result.duplicate ? 200 : 201 });
}
