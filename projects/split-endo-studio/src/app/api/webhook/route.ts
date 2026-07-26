import { randomUUID } from "node:crypto";
import { guard, json } from "@/lib/api";
import { ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  const key =
    req.headers.get("idempotency-key") ??
    (typeof body === "object" && body && "idempotencyKey" in body
      ? String((body as { idempotencyKey: string }).idempotencyKey)
      : randomUUID());
  const sig = req.headers.get("x-signature");
  const result = ingestWebhook(key, body, sig);
  if (!result.ok) return json(result, { status: 400 });
  return json(result);
}
