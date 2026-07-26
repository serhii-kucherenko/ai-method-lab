import { guard, json } from "@/lib/api";
import { ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const result = ingestWebhook(
    req.headers.get("idempotency-key") ?? body.idempotencyKey ?? "",
    body.payload ?? body,
    req.headers.get("x-signature"),
  );
  if (!result.ok) return json(result, { status: 400 });
  return json(result, { status: result.duplicate ? 200 : 201 });
}
