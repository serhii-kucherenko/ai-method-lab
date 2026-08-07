import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, describe, it } from "node:test";
import {
  scoreCommitMatched,
  scoreOnDemandBlind,
} from "../src/domain/scoring";
import type { ScoreInput } from "../src/domain/types";
import { GOLDENS } from "../src/goldens";
import { closeDb, migrate, openDb } from "../src/lib/db";

const overCover: ScoreInput = {
  window: { start: "2026-01-01", end: "2026-02-01" },
  commitments: [
    {
      id: "c-over",
      rateUsd: 1000,
      termMonths: 12,
      lockStart: "2026-01-01",
      lockEnd: "2026-02-01",
      family: "compute",
    },
  ],
  usage: [
    {
      windowStart: "2026-01-01",
      windowEnd: "2026-02-01",
      eligibleSpendUsd: 400,
      family: "compute",
    },
  ],
};

const underCover: ScoreInput = {
  window: { start: "2026-01-01", end: "2026-02-01" },
  commitments: [
    {
      id: "c-under",
      rateUsd: 200,
      termMonths: 12,
      lockStart: "2026-01-01",
      lockEnd: "2026-02-01",
      family: "compute",
    },
  ],
  usage: [
    {
      windowStart: "2026-01-01",
      windowEnd: "2026-02-01",
      eligibleSpendUsd: 800,
      family: "compute",
    },
  ],
};

describe("tracer: dual scorers diverge", () => {
  it("over-cover: A unusedCommitUsd differs from B (B unused is 0)", () => {
    const a = scoreCommitMatched(overCover);
    const b = scoreOnDemandBlind(overCover);
    assert.ok(a.unusedCommitUsd > 0, "A should have unused commit dollars");
    assert.equal(b.unusedCommitUsd, 0);
    assert.notEqual(a.unusedCommitUsd, b.unusedCommitUsd);
    assert.ok(Math.abs(a.gapUsd - b.gapUsd) > 0);
  });

  it("under-cover: A coveragePct greater than B; spill narratives differ", () => {
    const a = scoreCommitMatched(underCover);
    const b = scoreOnDemandBlind(underCover);
    assert.ok(a.coveragePct > b.coveragePct);
    assert.ok(a.onDemandSpillUsd < b.onDemandSpillUsd);
    assert.notEqual(a.gapUsd, b.gapUsd);
  });
});

describe("tracer: sqlite migrate round-trip", () => {
  const dir = mkdtempSync(join(tmpdir(), "ccs-db-"));
  const dbPath = join(dir, "coverage.db");

  after(() => {
    closeDb();
    rmSync(dir, { recursive: true, force: true });
  });

  it("creates commitments table and round-trips one row", () => {
    const db = openDb(dbPath);
    migrate(db);
    db.prepare(
      `INSERT INTO cloud_accounts (id, org_id, provider, account_key, display_name)
       VALUES (?, ?, ?, ?, ?)`,
    ).run("acc-1", "org-demo", "aws", "111", "AWS Prod");
    db.prepare(
      `INSERT INTO commitments (
         id, org_id, cloud_account_id, name, instrument_type, provider,
         term_months, rate_usd, lock_start, lock_end, family
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      "cm-1",
      "org-demo",
      "acc-1",
      "SP compute",
      "SP",
      "aws",
      12,
      500,
      "2026-01-01",
      "2027-01-01",
      "compute",
    );
    const row = db
      .prepare("SELECT id, rate_usd, lock_start FROM commitments WHERE id = ?")
      .get("cm-1") as { id: string; rate_usd: number; lock_start: string };
    assert.equal(row.id, "cm-1");
    assert.equal(row.rate_usd, 500);
    assert.equal(row.lock_start, "2026-01-01");
    db.close();
  });
});

describe("goldens catalog ≥30 dual-impl fixtures", () => {
  it("GOLDENS length is at least 30", () => {
    assert.ok(GOLDENS.length >= 30, `expected ≥30, got ${GOLDENS.length}`);
  });

  it("every golden stores A and B from scorers; B is not a copy of A", () => {
    for (const g of GOLDENS) {
      const a = scoreCommitMatched(g.input);
      const b = scoreOnDemandBlind(g.input);
      assert.deepEqual(g.pathA, a);
      assert.deepEqual(g.pathB, b);
      assert.notDeepEqual(
        g.pathA,
        g.pathB,
        `${g.id} must not treat B as a copy of A`,
      );
      assert.equal(b.unusedCommitUsd, 0);
      assert.equal(b.coveredUsd, 0);
    }
  });

  it("at least 10 fixtures assert non-zero abs(A.gapUsd - B.gapUsd)", () => {
    const divergent = GOLDENS.filter(
      (g) => Math.abs(g.pathA.gapUsd - g.pathB.gapUsd) > 0,
    );
    assert.ok(
      divergent.length >= 10,
      `need ≥10 dollar-divergent goldens, got ${divergent.length}`,
    );
    for (const g of divergent) {
      assert.ok(Math.abs(g.deltaUsd) > 0);
    }
  });
});
