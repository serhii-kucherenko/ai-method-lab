import { createHmac } from "node:crypto";
import { json } from "@/lib/api";
import { getOrg, ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const idempotencyKey =
    req.headers.get("x-idempotency-key") ??
    (typeof body === "object" &&
    body &&
    "idempotencyKey" in body &&
    typeof (body as { idempotencyKey?: string }).idempotencyKey === "string"
      ? (body as { idempotencyKey: string }).idempotencyKey
      : crypto.randomUUID());

  const auth = req.headers.get("authorization");
  const org = getOrg();
  if (
    body &&
    typeof body === "object" &&
    "demo" in body &&
    (body as { demo?: boolean }).demo === true &&
    auth === `Bearer ${org.bearerToken}`
  ) {
    const payload = (body as { payload?: unknown }).payload ?? {
      event: "pack.soft_sim",
      at: new Date().toISOString(),
    };
    const signature = `sha256=${createHmac("sha256", org.webhookSecret)
      .update(JSON.stringify(payload))
      .digest("hex")}`;
    const result = ingestWebhook(String(idempotencyKey), payload, signature);
    if (!result.ok) {
      return json({ error: result.error }, { status: 401 });
    }
    return json(result, { status: result.duplicate ? 200 : 201 });
  }

  const signature = req.headers.get("x-signature");
  const result = ingestWebhook(String(idempotencyKey), body, signature);
  if (!result.ok) {
    return json({ error: result.error }, { status: 401 });
  }
  return json(result, { status: result.duplicate ? 200 : 201 });
}
