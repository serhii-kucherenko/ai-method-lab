import { json } from "@/lib/api";
import { signWebhook, verifyWebhook } from "@/store";

export async function POST(req: Request) {
  const bodyText = await req.text();
  const sig = req.headers.get("x-grs-signature") ?? "";
  if (!verifyWebhook(bodyText, sig)) {
    return json({ error: "invalid_signature" }, { status: 401 });
  }
  let payload: unknown = null;
  try {
    payload = JSON.parse(bodyText);
  } catch {
    return json({ error: "invalid_json" }, { status: 400 });
  }
  return json({
    ok: true,
    received: payload,
    echoSignature: signWebhook(bodyText),
  });
}
