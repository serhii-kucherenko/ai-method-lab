import type { CoverageDb } from "@/lib/db";
import { DEMO_ORG_ID } from "@/lib/ids";

export type ExportKind = "gaps" | "renewals" | "compares";
export type ExportFormat = "json" | "csv";

function csvEscape(value: unknown): string {
  const s = value == null ? "" : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function rowsToCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]!);
  const lines = [
    headers.map(csvEscape).join(","),
    ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(",")),
  ];
  return `${lines.join("\n")}\n`;
}

function loadRows(
  db: CoverageDb,
  kind: ExportKind,
  orgId = DEMO_ORG_ID,
): Record<string, unknown>[] {
  switch (kind) {
    case "gaps":
      return db
        .prepare(
          `SELECT id, cloud_account_id AS cloudAccountId, kind, gap_usd AS gapUsd,
                  window_start AS windowStart, window_end AS windowEnd, created_at AS createdAt
           FROM gap_findings WHERE org_id = ?
           ORDER BY created_at DESC`,
        )
        .all(orgId) as Record<string, unknown>[];
    case "renewals":
      return db
        .prepare(
          `SELECT id, commitment_id AS commitmentId, cloud_account_id AS cloudAccountId,
                  renew_by AS renewBy, gap_usd AS gapUsd,
                  recommended_action AS recommendedAction, status,
                  linked_gap_ids AS linkedGapIds, created_at AS createdAt
           FROM renewal_cases WHERE org_id = ?
           ORDER BY renew_by ASC`,
        )
        .all(orgId) as Record<string, unknown>[];
    case "compares":
      return db
        .prepare(
          `SELECT id, mode, winner, delta_usd AS deltaUsd,
                  window_start AS windowStart, window_end AS windowEnd,
                  cloud_account_id AS cloudAccountId, created_at AS createdAt
           FROM compare_results WHERE org_id = ?
           ORDER BY created_at DESC`,
        )
        .all(orgId) as Record<string, unknown>[];
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

/** Build JSON or CSV export body for gaps | renewals | compares (D-09). */
export function buildExport(
  db: CoverageDb,
  kind: ExportKind,
  format: ExportFormat,
): { body: string; contentType: string; filename: string } {
  const rows = loadRows(db, kind);
  if (format === "json") {
    return {
      body: JSON.stringify({ softSim: true, kind, rows }, null, 2),
      contentType: "application/json; charset=utf-8",
      filename: `${kind}-export.json`,
    };
  }
  return {
    body: rowsToCsv(rows),
    contentType: "text/csv; charset=utf-8",
    filename: `${kind}-export.csv`,
  };
}
