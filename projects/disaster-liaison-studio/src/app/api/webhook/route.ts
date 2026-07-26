import { guard, json } from "@/lib/api";
import { ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json();
  const key =
    req.headers.get("idempotency-key") ??
    `auto-${Date.now()}`;
  const result = ingestWebhook(
    key,
    body,
    req.headers.get("x-signature"),
  );
  if (!result.ok) {
    return json({ error: result.error }, { status: 400 });
  }
  return json(result);
}
