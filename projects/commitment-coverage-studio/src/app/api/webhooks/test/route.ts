import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import type { CoverageDb } from "@/lib/db";
import { getDb } from "@/lib/db";
import { DEMO_ORG_ID } from "@/lib/ids";
import {
  resolveWebhookSecret,
  verifySignature,
} from "@/lib/webhook";
import { appendAudit } from "@/services/audit";
import { getOrg } from "@/services/org";

function findDelivery(
  db: CoverageDb,
  orgId: string,
  idempotencyKey: string,
): { id: string } | undefined {
  return db
    .prepare(
      `SELECT id FROM webhook_deliveries
       WHERE org_id = ? AND idempotency_key = ?`,
    )
    .get(orgId, idempotencyKey) as { id: string } | undefined;
}

/**
 * Soft-sim webhook ingress — HMAC body verify + Idempotency-Key (PLT-02, D-08).
 */
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-ccs-signature");
  const idempotencyKey = req.headers.get("idempotency-key")?.trim() ?? "";

  const db = getDb();
  const org = getOrg(db);
  if (!org) {
    return NextResponse.json(
      { error: "not_found", message: "Demo org missing (soft-sim)" },
      { status: 404 },
    );
  }

  const secret = resolveWebhookSecret(org.webhook_secret);
  if (!secret) {
    return NextResponse.json(
      {
        error: "misconfigured",
        message: "Webhook secret not set on org or CCS_WEBHOOK_SECRET (soft-sim)",
      },
      { status: 503 },
    );
  }

  const ok = verifySignature(secret, rawBody, signature);
  if (!ok) {
    return NextResponse.json(
      {
        error: "unauthorized",
        message: "Invalid or missing X-CCS-Signature (soft-sim HMAC)",
      },
      { status: 401 },
    );
  }

  if (!idempotencyKey) {
    return NextResponse.json(
      {
        error: "validation",
        message: "Idempotency-Key header required (soft-sim)",
      },
      { status: 422 },
    );
  }

  const existing = findDelivery(db, DEMO_ORG_ID, idempotencyKey);
  if (existing) {
    return NextResponse.json(
      {
        error: "conflict",
        message: "Idempotency-Key already accepted (soft-sim)",
        deliveryId: existing.id,
      },
      { status: 409 },
    );
  }

  let payloadJson = rawBody;
  try {
    if (rawBody.trim()) JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "Soft-sim expects JSON body" },
      { status: 422 },
    );
  }
  if (!payloadJson.trim()) payloadJson = "{}";

  const id = randomUUID();
  try {
    db.prepare(
      `INSERT INTO webhook_deliveries (
        id, org_id, idempotency_key, signature_ok, payload_json
      ) VALUES (?, ?, ?, 1, ?)`,
    ).run(id, DEMO_ORG_ID, idempotencyKey, payloadJson);
  } catch (err) {
    const message = err instanceof Error ? err.message : "insert failed";
    if (/UNIQUE/i.test(message)) {
      return NextResponse.json(
        {
          error: "conflict",
          message: "Idempotency-Key already accepted (soft-sim)",
        },
        { status: 409 },
      );
    }
    throw err;
  }

  appendAudit(db, {
    actor: "soft-sim:webhook",
    action: "webhook.accepted",
    entityType: "webhook_delivery",
    entityId: id,
    detail: { idempotencyKey },
  });

  return NextResponse.json(
    {
      softSim: true,
      accepted: true,
      deliveryId: id,
      message: "Soft-sim webhook delivery accepted",
    },
    { status: 200 },
  );
}
