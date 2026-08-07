import type { CoverageDb } from "@/lib/db";
import { DEMO_ORG_ID } from "@/lib/ids";

export type OrgRow = {
  id: string;
  name: string;
  seat_tier: string;
  webhook_secret: string | null;
  updated_at: string;
  created_at: string;
};

export type OrgPublic = {
  id: string;
  name: string;
  seatTier: string;
  webhookSecretMasked: string | null;
  updatedAt: string;
  createdAt: string;
};

export function maskWebhookSecret(secret: string | null | undefined): string | null {
  if (!secret) return null;
  if (secret.length <= 8) return `${secret.slice(0, 2)}…`;
  return `${secret.slice(0, 6)}…${secret.slice(-4)}`;
}

export function toOrgPublic(row: OrgRow): OrgPublic {
  return {
    id: row.id,
    name: row.name,
    seatTier: row.seat_tier,
    webhookSecretMasked: maskWebhookSecret(row.webhook_secret),
    updatedAt: row.updated_at,
    createdAt: row.created_at,
  };
}

export function getOrg(db: CoverageDb, orgId = DEMO_ORG_ID): OrgRow | null {
  return (
    (db
      .prepare(
        `SELECT id, name, seat_tier, webhook_secret, updated_at, created_at
         FROM orgs WHERE id = ?`,
      )
      .get(orgId) as OrgRow | undefined) ?? null
  );
}

export function updateOrg(
  db: CoverageDb,
  input: {
    orgId?: string;
    name?: string;
    seatTier?: string;
    webhookSecret?: string;
  },
): OrgRow {
  const orgId = input.orgId ?? DEMO_ORG_ID;
  const current = getOrg(db, orgId);
  if (!current) {
    throw new Error(`Org not found: ${orgId}`);
  }

  const name = input.name ?? current.name;
  const seatTier = input.seatTier ?? current.seat_tier;
  const webhookSecret =
    input.webhookSecret !== undefined
      ? input.webhookSecret
      : current.webhook_secret;

  db.prepare(
    `UPDATE orgs
     SET name = ?, seat_tier = ?, webhook_secret = ?, updated_at = datetime('now')
     WHERE id = ?`,
  ).run(name, seatTier, webhookSecret, orgId);

  const updated = getOrg(db, orgId);
  if (!updated) throw new Error(`Org missing after update: ${orgId}`);
  return updated;
}
