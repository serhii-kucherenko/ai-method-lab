import { randomUUID } from "node:crypto";
import { z } from "zod";
import type { CoverageDb } from "@/lib/db";
import { DEMO_ORG_ID } from "@/lib/ids";

export const MAX_IMPORT_ROWS = 500;

export const usageRowSchema = z.object({
  accountKey: z.string().min(1).optional(),
  cloudAccountId: z.string().min(1).optional(),
  provider: z.enum(["aws", "gcp", "azure"]).optional(),
  windowStart: z.string().min(1),
  windowEnd: z.string().min(1),
  eligibleSpendUsd: z.number().nonnegative(),
  family: z.string().optional(),
});

export const importBatchSchema = z.object({
  clientKey: z.string().min(1).optional(),
  sourceKind: z.string().default("usage_json"),
  rows: z.array(usageRowSchema).min(1),
});

export type ImportBatchRow = {
  id: string;
  org_id: string;
  client_key: string | null;
  status: string;
  source_kind: string;
  row_count: number;
  accepted_count: number;
  failed_count: number;
  error_detail: string | null;
  created_at: string;
};

export type ImportResult = {
  batch: ImportBatchRow;
  status: "accepted" | "failed";
};

function resolveAccountId(
  db: CoverageDb,
  row: z.infer<typeof usageRowSchema>,
  orgId: string,
): string | null {
  if (row.cloudAccountId) {
    const found = db
      .prepare("SELECT id FROM cloud_accounts WHERE id = ? AND org_id = ?")
      .get(row.cloudAccountId, orgId) as { id: string } | undefined;
    return found?.id ?? null;
  }
  if (row.accountKey && row.provider) {
    const found = db
      .prepare(
        `SELECT id FROM cloud_accounts
         WHERE org_id = ? AND account_key = ? AND provider = ?`,
      )
      .get(orgId, row.accountKey, row.provider) as { id: string } | undefined;
    return found?.id ?? null;
  }
  return null;
}

export function getImportBatch(
  db: CoverageDb,
  id: string,
): ImportBatchRow | undefined {
  return db
    .prepare("SELECT * FROM import_batches WHERE id = ?")
    .get(id) as ImportBatchRow | undefined;
}

export function listImportBatches(
  db: CoverageDb,
  orgId = DEMO_ORG_ID,
): ImportBatchRow[] {
  return db
    .prepare(
      "SELECT * FROM import_batches WHERE org_id = ? ORDER BY created_at DESC",
    )
    .all(orgId) as ImportBatchRow[];
}

/**
 * ImportOrchestrator — parse validated usage rows into UsageSlice persistence.
 * Soft-sim only; not a live billing system of record.
 */
export function runImportBatch(
  db: CoverageDb,
  input: z.infer<typeof importBatchSchema>,
  orgId = DEMO_ORG_ID,
): ImportResult {
  if (input.rows.length > MAX_IMPORT_ROWS) {
    const id = randomUUID();
    db.prepare(
      `INSERT INTO import_batches (
        id, org_id, client_key, status, source_kind, row_count,
        accepted_count, failed_count, error_detail
      ) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)`,
    ).run(
      id,
      orgId,
      input.clientKey ?? null,
      "failed",
      input.sourceKind,
      input.rows.length,
      input.rows.length,
      `Batch exceeds max ${MAX_IMPORT_ROWS} rows (soft-sim)`,
    );
    return { batch: getImportBatch(db, id)!, status: "failed" };
  }

  if (input.clientKey) {
    const existing = db
      .prepare(
        "SELECT * FROM import_batches WHERE org_id = ? AND client_key = ?",
      )
      .get(orgId, input.clientKey) as ImportBatchRow | undefined;
    if (existing) {
      const err = new Error("idempotency_conflict");
      (err as Error & { batch?: ImportBatchRow }).batch = existing;
      throw err;
    }
  }

  const id = randomUUID();
  const errors: string[] = [];
  let accepted = 0;

  const insertSlice = db.prepare(
    `INSERT INTO usage_slices (
      id, org_id, import_batch_id, cloud_account_id,
      window_start, window_end, eligible_spend_usd, family
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  );

  const tx = db.transaction(() => {
    db.prepare(
      `INSERT INTO import_batches (
        id, org_id, client_key, status, source_kind, row_count,
        accepted_count, failed_count, error_detail
      ) VALUES (?, ?, ?, 'accepted', ?, ?, 0, 0, NULL)`,
    ).run(
      id,
      orgId,
      input.clientKey ?? null,
      input.sourceKind,
      input.rows.length,
    );

    for (let i = 0; i < input.rows.length; i += 1) {
      const row = input.rows[i];
      if (Date.parse(row.windowStart) >= Date.parse(row.windowEnd)) {
        errors.push(`row[${i}]: windowStart must be before windowEnd`);
        continue;
      }
      const accountId = resolveAccountId(db, row, orgId);
      if (!accountId) {
        errors.push(
          `row[${i}]: unknown cloud account (soft-sim — provide cloudAccountId or accountKey+provider)`,
        );
        continue;
      }
      insertSlice.run(
        randomUUID(),
        orgId,
        id,
        accountId,
        row.windowStart,
        row.windowEnd,
        row.eligibleSpendUsd,
        row.family ?? null,
      );
      accepted += 1;
    }

    const failed = input.rows.length - accepted;
    const status = accepted === 0 ? "failed" : "accepted";
    db.prepare(
      `UPDATE import_batches SET
        status = ?, accepted_count = ?, failed_count = ?, error_detail = ?
       WHERE id = ?`,
    ).run(
      status,
      accepted,
      failed,
      errors.length ? errors.join("; ") : null,
      id,
    );
  });

  tx();
  const batch = getImportBatch(db, id)!;
  return {
    batch,
    status: batch.status === "accepted" ? "accepted" : "failed",
  };
}
