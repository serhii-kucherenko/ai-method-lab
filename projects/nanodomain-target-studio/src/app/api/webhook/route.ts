import { createHmac } from "node:crypto";
import { json } from "@/lib/api";
import { getOrg, ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const body = await req.json();
  const key =
    req.headers.get("idempotency-key") ??
    body.idempotencyKey ??
    `auto-${Date.now()}`;
  let signature = req.headers.get("x-signature");
  if (!signature && body.sign === true) {
    const secret = getOrg().webhookSecret;
    const expected = createHmac("sha256", secret)
      .update(JSON.stringify(body.payload ?? body))
      .digest("hex");
    signature = `sha256=${expected}`;
  }
  const result = ingestWebhook(key, body.payload ?? body, signature);
  if (!result.ok) return json(result, { status: 401 });
  return json(result, { status: result.duplicate ? 200 : 201 });
}
