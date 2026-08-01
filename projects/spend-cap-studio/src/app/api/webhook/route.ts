import { createHmac } from "crypto";
import { NextResponse } from "next/server";

const seen = new Set<string>();

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-judge-signature") || "";
  const expected = createHmac("sha256", process.env.WEBHOOK_SECRET || "judge-demo")
    .update(body)
    .digest("hex");
  if (signature !== expected) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }
  const id = req.headers.get("idempotency-key") || body;
  const duplicate = seen.has(id);
  seen.add(id);
  return NextResponse.json({ ok: true, duplicate });
}
