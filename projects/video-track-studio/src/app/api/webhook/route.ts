import { createHmac } from "node:crypto";
import { guard, json } from "@/lib/api";
import { getOrg, receiveWebhook } from "@/store";

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const idem =
    req.headers.get("idempotency-key") ??
    req.headers.get("x-idempotency-key") ??
    "";
  if (!idem) {
    return json({ error: "idempotency_key_required" }, { status: 400 });
  }
  const payload = await req.json();
  const sigHeader = req.headers.get("x-signature");
  const result = receiveWebhook(idem, payload, sigHeader);
  if (!result.ok) {
    return json({ error: result.error }, { status: 401 });
  }
  return json(result, { status: result.duplicate ? 200 : 201 });
}

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const org = getOrg();
  const sample = { ping: true };
  const sig = createHmac("sha256", org.webhookSecret)
    .update(JSON.stringify(sample))
    .digest("hex");
  return json({ samplePayload: sample, sampleSignature: sig });
}
