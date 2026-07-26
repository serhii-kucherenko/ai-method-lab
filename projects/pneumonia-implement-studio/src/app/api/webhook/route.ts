import { json } from "@/lib/api";
import { ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const body = (await req.json()) as Record<string, unknown>;
  const idempotencyKey =
    req.headers.get("idempotency-key") ??
    (typeof body.idempotencyKey === "string" ? body.idempotencyKey : null);
  if (!idempotencyKey) {
    return json({ error: "missing_idempotency_key" }, { status: 400 });
  }
  const result = ingestWebhook(
    idempotencyKey,
    body,
    req.headers.get("x-signature"),
  );
  if (!result.ok) {
    return json({ error: result.error ?? "ingest_failed" }, { status: 401 });
  }
  return json(result);
}
