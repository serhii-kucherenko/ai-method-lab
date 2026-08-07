import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it, after } from "node:test";
import {
  scoreCommitMatched,
  scoreOnDemandBlind,
} from "../src/domain/scoring";
import type { ScoreInput } from "../src/domain/types";
import { closeDb, openTestDb } from "../src/lib/db";

const window = {
  start: "2026-01-01T00:00:00Z",
  end: "2026-02-01T00:00:00Z",
};

describe("goldens tracer: A vs B divergence + SQLite", () => {
  it("over-cover: A unusedCommitUsd differs from B (B unused is 0)", () => {
    const input: ScoreInput = {
      window,
      commitments: [
        {
          id: "c-over",
          rateUsd: 1000,
          termMonths: 12,
          lockStart: "2026-01-01T00:00:00Z",
          lockEnd: "2027-01-01T00:00:00Z",
        },
      ],
      usage: [
        {
          windowStart: "2026-01-01T00:00:00Z",
          windowEnd: "2026-02-01T00:00:00Z",
          eligibleSpendUsd: 400,
        },
      ],
    };
    const a = scoreCommitMatched(input);
    const b = scoreOnDemandBlind(input);
    assert.ok(a.unusedCommitUsd > 0, "A should show unused commit dollars");
    assert.equal(b.unusedCommitUsd, 0, "B unused must be 0");
    assert.notEqual(a.unusedCommitUsd, b.unusedCommitUsd);
    assert.ok(Math.abs(a.gapUsd - b.gapUsd) > 0, "gap dollars must diverge");
  });

  it("under-cover: A coveragePct greater than B and spill differs", () => {
    const input: ScoreInput = {
      window,
      commitments: [
        {
          id: "c-under",
          rateUsd: 200,
          termMonths: 12,
          lockStart: "2026-01-01T00:00:00Z",
          lockEnd: "2027-01-01T00:00:00Z",
        },
      ],
      usage: [
        {
          windowStart: "2026-01-01T00:00:00Z",
          windowEnd: "2026-02-01T00:00:00Z",
          eligibleSpendUsd: 800,
        },
      ],
    };
    const a = scoreCommitMatched(input);
    const b = scoreOnDemandBlind(input);
    assert.ok(a.coveragePct > b.coveragePct, "A coverage must beat B (0)");
    assert.notEqual(a.onDemandSpillUsd, b.onDemandSpillUsd);
    assert.ok(a.coveredUsd > 0);
    assert.equal(b.coveredUsd, 0);
  });

  it("SQLite migrate creates commitments and round-trips one row", () => {
    const dir = mkdtempSync(join(tmpdir(), "ccs-db-"));
    const path = join(dir, "coverage.db");
    try {
      const db = openTestDb(path);
      db.prepare(
        `INSERT INTO cloud_accounts (id, org_id, provider, external_key, name)
         VALUES (?, ?, ?, ?, ?)`,
      ).run("acc1", "org_demo", "aws", "111", "AWS Prod");
      db.prepare(
        `INSERT INTO commitments (
          id, org_id, cloud_account_id, name, instrument_type, provider_tag,
          term_months, rate_usd, lock_start, lock_end
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        "cm1",
        "org_demo",
        "acc1",
        "SP compute",
        "SP",
        "aws",
        12,
        500,
        "2026-01-01T00:00:00Z",
        "2027-01-01T00:00:00Z",
      );
      const row = db
        .prepare("SELECT id, rate_usd, lock_start FROM commitments WHERE id = ?")
        .get("cm1") as { id: string; rate_usd: number; lock_start: string };
      assert.equal(row.id, "cm1");
      assert.equal(row.rate_usd, 500);
      assert.equal(row.lock_start, "2026-01-01T00:00:00Z");
      assert.ok(path.includes("coverage.db"));
    } finally {
      closeDb();
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
