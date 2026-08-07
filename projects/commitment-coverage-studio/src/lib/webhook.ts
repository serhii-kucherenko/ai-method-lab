import { createHmac, timingSafeEqual } from "node:crypto";

/** Resolve org webhook secret or env fallback for soft-sim HMAC (D-08). */
export function resolveWebhookSecret(
  orgSecret: string | null | undefined,
): string | null {
  if (orgSecret && orgSecret.trim()) return orgSecret.trim();
  const env = process.env.CCS_WEBHOOK_SECRET;
  if (env && env.trim()) return env.trim();
  return null;
}

/** HMAC-SHA256 hex digest of raw body. */
export function signPayload(secret: string, rawBody: string): string {
  return createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
}

/**
 * Verify X-CCS-Signature against raw body using timing-safe compare (D-08).
 * Accepts raw hex or sha256=<hex>.
 */
export function verifySignature(
  secret: string,
  rawBody: string,
  headerValue: string | null,
): boolean {
  if (!headerValue) return false;
  const provided = headerValue.trim().replace(/^sha256=/i, "");
  if (!/^[0-9a-f]+$/i.test(provided)) return false;
  const expected = signPayload(secret, rawBody);
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(provided, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
