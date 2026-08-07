import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import { DEMO_BEARER_TOKEN } from "../src/lib/auth";
import { closeDb, resetDbForTests } from "../src/lib/db";
import { seedMultiCloud } from "../src/lib/repos";

const auth = { Authorization: `Bearer ${DEMO_BEARER_TOKEN}` };

function jsonReq(
  url: string,
  init: RequestInit & { json?: unknown } = {},
): Request {
  const headers = new Headers(init.headers);
  if (init.json !== undefined) {
    headers.set("content-type", "application/json");
  }
  return new Request(url, {
    ...init,
    headers,
    body: init.json !== undefined ? JSON.stringify(init.json) : init.body,
  });
}

describe("domain-api: accounts + commitments inventory", () => {
  const dir = mkdtempSync(join(tmpdir(), "ccs-api-"));
  const dbPath = join(dir, "coverage.db");

  before(() => {
    process.env.CCS_DB_PATH = dbPath;
    closeDb();
    resetDbForTests(dbPath);
  });

  after(() => {
    closeDb();
    rmSync(dir, { recursive: true, force: true });
    delete process.env.CCS_DB_PATH;
  });

  it("POST /api/accounts without Bearer returns 401", async () => {
    const { POST } = await import("../src/app/api/accounts/route");
    const res = await POST(
      jsonReq("http://local/api/accounts", {
        method: "POST",
        json: { provider: "aws", accountKey: "x", displayName: "X" },
      }),
    );
    assert.equal(res.status, 401);
  });

  it("with Bearer: create aws account then commitment; GET list returns it", async () => {
    const accounts = await import("../src/app/api/accounts/route");
    const commitments = await import("../src/app/api/commitments/route");

    const accRes = await accounts.POST(
      jsonReq("http://local/api/accounts", {
        method: "POST",
        headers: auth,
        json: {
          provider: "aws",
          accountKey: "aws-prod-1",
          displayName: "AWS Prod",
        },
      }),
    );
    assert.equal(accRes.status, 201);
    const { account } = await accRes.json();

    const cmRes = await commitments.POST(
      jsonReq("http://local/api/commitments", {
        method: "POST",
        headers: auth,
        json: {
          cloudAccountId: account.id,
          name: "SP compute",
          instrumentType: "SP",
          provider: "aws",
          termMonths: 12,
          rateUsd: 500,
          lockStart: "2026-01-01",
          lockEnd: "2027-01-01",
          family: "compute",
          tags: ["prod"],
        },
      }),
    );
    assert.equal(cmRes.status, 201);

    const listRes = await commitments.GET(
      jsonReq("http://local/api/commitments", { headers: auth }),
    );
    const list = await listRes.json();
    assert.ok(list.commitments.some((c: { name: string }) => c.name === "SP compute"));
  });

  it("seed path creates at least two providers (aws + gcp)", () => {
    const db = resetDbForTests(dbPath);
    const { aws, gcp } = seedMultiCloud(db);
    assert.equal(aws.provider, "aws");
    assert.equal(gcp.provider, "gcp");
  });
});

describe("domain-api: commitment search, update, archive", () => {
  const dir = mkdtempSync(join(tmpdir(), "ccs-cm-"));
  const dbPath = join(dir, "coverage.db");
  let commitmentId = "";

  before(async () => {
    process.env.CCS_DB_PATH = dbPath;
    closeDb();
    const db = resetDbForTests(dbPath);
    const { aws } = seedMultiCloud(db);
    const commitments = await import("../src/app/api/commitments/route");
    const res = await commitments.POST(
      jsonReq("http://local/api/commitments", {
        method: "POST",
        headers: auth,
        json: {
          cloudAccountId: aws.id,
          name: "CUD search-me",
          instrumentType: "CUD",
          provider: "gcp",
          termMonths: 36,
          rateUsd: 300,
          lockStart: "2026-01-01",
          lockEnd: "2029-01-01",
          tags: ["analytics"],
        },
      }),
    );
    const body = await res.json();
    commitmentId = body.commitment.id;
  });

  after(() => {
    closeDb();
    rmSync(dir, { recursive: true, force: true });
    delete process.env.CCS_DB_PATH;
  });

  it("GET /api/commitments search matches name or tag/provider", async () => {
    const { GET } = await import("../src/app/api/commitments/route");
    const byName = await GET(
      jsonReq("http://local/api/commitments?search=search-me", {
        headers: auth,
      }),
    );
    const named = await byName.json();
    assert.ok(named.commitments.length >= 1);

    const byProvider = await GET(
      jsonReq("http://local/api/commitments?search=gcp", { headers: auth }),
    );
    const providers = await byProvider.json();
    assert.ok(providers.commitments.length >= 1);
  });

  it("PATCH updates rate and can archive; archived excluded by default", async () => {
    const detail = await import("../src/app/api/commitments/[id]/route");
    const list = await import("../src/app/api/commitments/route");

    const patchRes = await detail.PATCH(
      jsonReq(`http://local/api/commitments/${commitmentId}`, {
        method: "PATCH",
        headers: auth,
        json: { rateUsd: 350, archive: true },
      }),
      { params: Promise.resolve({ id: commitmentId }) },
    );
    assert.equal(patchRes.status, 200);
    const patched = await patchRes.json();
    assert.equal(patched.commitment.rate_usd, 350);
    assert.ok(patched.commitment.archived_at);

    const defaultList = await list.GET(
      jsonReq("http://local/api/commitments", { headers: auth }),
    );
    const def = await defaultList.json();
    assert.ok(
      !def.commitments.some((c: { id: string }) => c.id === commitmentId),
    );

    const withArchived = await list.GET(
      jsonReq("http://local/api/commitments?includeArchived=true", {
        headers: auth,
      }),
    );
    const arch = await withArchived.json();
    assert.ok(arch.commitments.some((c: { id: string }) => c.id === commitmentId));
  });

  it("rejects lock window with lockStart after lockEnd", async () => {
    const detail = await import("../src/app/api/commitments/[id]/route");
    const res = await detail.PATCH(
      jsonReq(`http://local/api/commitments/${commitmentId}`, {
        method: "PATCH",
        headers: auth,
        json: { lockStart: "2027-01-01", lockEnd: "2026-01-01" },
      }),
      { params: Promise.resolve({ id: commitmentId }) },
    );
    assert.equal(res.status, 422);
  });
});

describe("domain-api: import batches", () => {
  const dir = mkdtempSync(join(tmpdir(), "ccs-imp-"));
  const dbPath = join(dir, "coverage.db");
  let awsId = "";
  let gcpId = "";

  before(() => {
    process.env.CCS_DB_PATH = dbPath;
    closeDb();
    const db = resetDbForTests(dbPath);
    const seeded = seedMultiCloud(db);
    awsId = seeded.aws.id;
    gcpId = seeded.gcp.id;
  });

  after(() => {
    closeDb();
    rmSync(dir, { recursive: true, force: true });
    delete process.env.CCS_DB_PATH;
  });

  it("POST /api/imports accepts multi-provider usage and writes UsageSlices", async () => {
    const imports = await import("../src/app/api/imports/route");
    const res = await imports.POST(
      jsonReq("http://local/api/imports", {
        method: "POST",
        headers: auth,
        json: {
          clientKey: "batch-1",
          rows: [
            {
              cloudAccountId: awsId,
              windowStart: "2026-01-01",
              windowEnd: "2026-02-01",
              eligibleSpendUsd: 400,
              family: "compute",
            },
            {
              cloudAccountId: gcpId,
              windowStart: "2026-01-01",
              windowEnd: "2026-02-01",
              eligibleSpendUsd: 200,
              family: "storage",
            },
          ],
        },
      }),
    );
    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.status, "accepted");
    assert.equal(body.batch.accepted_count, 2);

    const { getDb } = await import("../src/lib/db");
    const slices = getDb()
      .prepare("SELECT cloud_account_id FROM usage_slices WHERE import_batch_id = ?")
      .all(body.batchId) as { cloud_account_id: string }[];
    assert.equal(slices.length, 2);
    const providers = new Set(slices.map((s) => s.cloud_account_id));
    assert.ok(providers.has(awsId) && providers.has(gcpId));
  });

  it("duplicate clientKey returns 409", async () => {
    const imports = await import("../src/app/api/imports/route");
    const res = await imports.POST(
      jsonReq("http://local/api/imports", {
        method: "POST",
        headers: auth,
        json: {
          clientKey: "batch-1",
          rows: [
            {
              cloudAccountId: awsId,
              windowStart: "2026-02-01",
              windowEnd: "2026-03-01",
              eligibleSpendUsd: 10,
            },
          ],
        },
      }),
    );
    assert.equal(res.status, 409);
  });

  it("failed rows surface error detail on GET /api/imports/:id", async () => {
    const imports = await import("../src/app/api/imports/route");
    const detail = await import("../src/app/api/imports/[id]/route");
    const create = await imports.POST(
      jsonReq("http://local/api/imports", {
        method: "POST",
        headers: auth,
        json: {
          clientKey: "batch-fail",
          rows: [
            {
              cloudAccountId: "missing-account",
              windowStart: "2026-01-01",
              windowEnd: "2026-02-01",
              eligibleSpendUsd: 50,
            },
          ],
        },
      }),
    );
    assert.equal(create.status, 422);
    const created = await create.json();
    const get = await detail.GET(
      jsonReq(`http://local/api/imports/${created.batchId}`, {
        headers: auth,
      }),
      { params: Promise.resolve({ id: created.batchId }) },
    );
    const body = await get.json();
    assert.ok(body.errorDetail || body.batch.error_detail);
  });

  it("oversized batch returns 422", async () => {
    const imports = await import("../src/app/api/imports/route");
    const rows = Array.from({ length: 501 }, (_, i) => ({
      cloudAccountId: awsId,
      windowStart: "2026-01-01",
      windowEnd: "2026-02-01",
      eligibleSpendUsd: i,
    }));
    const res = await imports.POST(
      jsonReq("http://local/api/imports", {
        method: "POST",
        headers: auth,
        json: { rows },
      }),
    );
    assert.equal(res.status, 422);
  });
});

describe("domain-api: coverage, gaps, compare", () => {
  const dir = mkdtempSync(join(tmpdir(), "ccs-cov-"));
  const dbPath = join(dir, "coverage.db");
  let overAccountId = "";
  let underAccountId = "";

  before(async () => {
    process.env.CCS_DB_PATH = dbPath;
    closeDb();
    const db = resetDbForTests(dbPath);
    const { aws, gcp } = seedMultiCloud(db);

    const commitments = await import("../src/app/api/commitments/route");
    const imports = await import("../src/app/api/imports/route");

    // Over-cover on aws: high commit, low usage
    await commitments.POST(
      jsonReq("http://local/api/commitments", {
        method: "POST",
        headers: auth,
        json: {
          cloudAccountId: aws.id,
          name: "SP over",
          instrumentType: "SP",
          provider: "aws",
          termMonths: 12,
          rateUsd: 1000,
          lockStart: "2026-01-01",
          lockEnd: "2026-02-01",
          family: "compute",
        },
      }),
    );
    await imports.POST(
      jsonReq("http://local/api/imports", {
        method: "POST",
        headers: auth,
        json: {
          clientKey: "cov-over",
          rows: [
            {
              cloudAccountId: aws.id,
              windowStart: "2026-01-01",
              windowEnd: "2026-02-01",
              eligibleSpendUsd: 400,
              family: "compute",
            },
          ],
        },
      }),
    );
    overAccountId = aws.id;

    // Under-cover on gcp: low commit, high usage
    await commitments.POST(
      jsonReq("http://local/api/commitments", {
        method: "POST",
        headers: auth,
        json: {
          cloudAccountId: gcp.id,
          name: "CUD under",
          instrumentType: "CUD",
          provider: "gcp",
          termMonths: 12,
          rateUsd: 200,
          lockStart: "2026-01-01",
          lockEnd: "2026-02-01",
          family: "compute",
        },
      }),
    );
    await imports.POST(
      jsonReq("http://local/api/imports", {
        method: "POST",
        headers: auth,
        json: {
          clientKey: "cov-under",
          rows: [
            {
              cloudAccountId: gcp.id,
              windowStart: "2026-01-01",
              windowEnd: "2026-02-01",
              eligibleSpendUsd: 800,
              family: "compute",
            },
          ],
        },
      }),
    );
    underAccountId = gcp.id;
  });

  after(() => {
    closeDb();
    rmSync(dir, { recursive: true, force: true });
    delete process.env.CCS_DB_PATH;
  });

  it("POST coverage returns A-only snapshot; missing usage yields 422", async () => {
    const coverage = await import("../src/app/api/coverage/route");
    const ok = await coverage.POST(
      jsonReq("http://local/api/coverage", {
        method: "POST",
        headers: auth,
        json: {
          cloudAccountId: overAccountId,
          windowStart: "2026-01-01",
          windowEnd: "2026-02-01",
        },
      }),
    );
    assert.equal(ok.status, 201);
    const body = await ok.json();
    assert.ok(body.snapshot.coverage_pct >= 0);
    assert.ok(body.snapshot.unused_commit_usd > 0);

    const missing = await coverage.POST(
      jsonReq("http://local/api/coverage", {
        method: "POST",
        headers: auth,
        json: {
          cloudAccountId: overAccountId,
          windowStart: "2025-01-01",
          windowEnd: "2025-02-01",
        },
      }),
    );
    assert.equal(missing.status, 422);
    const err = await missing.json();
    assert.match(err.message, /soft-sim/i);
  });

  it("GET gaps exposes unused_commit and ondemand_spill findings", async () => {
    const coverage = await import("../src/app/api/coverage/route");
    const gaps = await import("../src/app/api/gaps/route");

    await coverage.POST(
      jsonReq("http://local/api/coverage", {
        method: "POST",
        headers: auth,
        json: {
          cloudAccountId: underAccountId,
          windowStart: "2026-01-01",
          windowEnd: "2026-02-01",
        },
      }),
    );

    const overGaps = await gaps.GET(
      jsonReq(
        `http://local/api/gaps?cloudAccountId=${overAccountId}&windowStart=2026-01-01&windowEnd=2026-02-01`,
        { headers: auth },
      ),
    );
    const overBody = await overGaps.json();
    assert.ok(
      overBody.gaps.some(
        (g: { kind: string }) => g.kind === "unused_commit",
      ),
    );

    const underGaps = await gaps.GET(
      jsonReq(
        `http://local/api/gaps?cloudAccountId=${underAccountId}&windowStart=2026-01-01&windowEnd=2026-02-01`,
        { headers: auth },
      ),
    );
    const underBody = await underGaps.json();
    assert.ok(
      underBody.gaps.some(
        (g: { kind: string }) => g.kind === "ondemand_spill",
      ),
    );
  });

  it("POST compares returns material A vs B deltaUsd", async () => {
    const compares = await import("../src/app/api/compares/route");
    const detail = await import("../src/app/api/compares/[id]/route");

    const res = await compares.POST(
      jsonReq("http://local/api/compares", {
        method: "POST",
        headers: auth,
        json: {
          mode: "commit_vs_ondemand",
          cloudAccountId: overAccountId,
          windowStart: "2026-01-01",
          windowEnd: "2026-02-01",
        },
      }),
    );
    assert.equal(res.status, 201);
    const body = await res.json();
    assert.ok(Math.abs(body.deltaUsd) > 0);
    assert.ok(body.pathA);
    assert.ok(body.pathB);
    assert.notDeepEqual(body.pathA, body.pathB);

    const get = await detail.GET(
      jsonReq(`http://local/api/compares/${body.compare.id}`, {
        headers: auth,
      }),
      { params: Promise.resolve({ id: body.compare.id }) },
    );
    assert.equal(get.status, 200);
    const stored = await get.json();
    assert.ok(Math.abs(stored.deltaUsd) > 0);

    const badMode = await compares.POST(
      jsonReq("http://local/api/compares", {
        method: "POST",
        headers: auth,
        json: {
          mode: "twin_equivalence",
          cloudAccountId: overAccountId,
          windowStart: "2026-01-01",
          windowEnd: "2026-02-01",
        },
      }),
    );
    assert.equal(badMode.status, 422);
  });

  it("GET /api/scoreboard returns account gap rows ranked by gapUsd", async () => {
    const { GET } = await import("../src/app/api/scoreboard/route");
    const res = await GET(
      jsonReq("http://local/api/scoreboard", { headers: auth }),
    );
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.scoreboard));
    assert.ok(body.scoreboard.length >= 1);
    const row = body.scoreboard[0];
    assert.ok("gapUsd" in row);
    assert.ok("unusedCommitUsd" in row);
    assert.ok("ondemandSpillUsd" in row);
    assert.ok("provider" in row);
    for (let i = 1; i < body.scoreboard.length; i += 1) {
      assert.ok(body.scoreboard[i - 1].gapUsd >= body.scoreboard[i].gapUsd);
    }
  });
});

describe("domain-api: scoreboard empty org", () => {
  const dir = mkdtempSync(join(tmpdir(), "ccs-score-empty-"));
  const dbPath = join(dir, "coverage.db");

  before(() => {
    process.env.CCS_DB_PATH = dbPath;
    closeDb();
    resetDbForTests(dbPath);
  });

  after(() => {
    closeDb();
    rmSync(dir, { recursive: true, force: true });
    delete process.env.CCS_DB_PATH;
  });

  it("GET /api/scoreboard empty org yields empty array", async () => {
    const { GET } = await import("../src/app/api/scoreboard/route");
    const res = await GET(
      jsonReq("http://local/api/scoreboard", { headers: auth }),
    );
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body.scoreboard, []);
  });
});

describe("domain-api: renewals pack", () => {
  const dir = mkdtempSync(join(tmpdir(), "ccs-renew-"));
  const dbPath = join(dir, "coverage.db");
  let overAccountId = "";
  let underAccountId = "";

  before(async () => {
    process.env.CCS_DB_PATH = dbPath;
    closeDb();
    const db = resetDbForTests(dbPath);
    const { aws, gcp } = seedMultiCloud(db);
    overAccountId = aws.id;
    underAccountId = gcp.id;

    const commitments = await import("../src/app/api/commitments/route");
    const imports = await import("../src/app/api/imports/route");
    const coverage = await import("../src/app/api/coverage/route");

    await commitments.POST(
      jsonReq("http://local/api/commitments", {
        method: "POST",
        headers: auth,
        json: {
          cloudAccountId: aws.id,
          name: "SP over renew",
          instrumentType: "SP",
          provider: "aws",
          termMonths: 12,
          rateUsd: 1000,
          lockStart: "2026-01-01",
          lockEnd: "2026-02-01",
          family: "compute",
        },
      }),
    );
    await imports.POST(
      jsonReq("http://local/api/imports", {
        method: "POST",
        headers: auth,
        json: {
          clientKey: "renew-over",
          rows: [
            {
              cloudAccountId: aws.id,
              windowStart: "2026-01-01",
              windowEnd: "2026-02-01",
              eligibleSpendUsd: 400,
              family: "compute",
            },
          ],
        },
      }),
    );
    await coverage.POST(
      jsonReq("http://local/api/coverage", {
        method: "POST",
        headers: auth,
        json: {
          cloudAccountId: aws.id,
          windowStart: "2026-01-01",
          windowEnd: "2026-02-01",
        },
      }),
    );

    await commitments.POST(
      jsonReq("http://local/api/commitments", {
        method: "POST",
        headers: auth,
        json: {
          cloudAccountId: gcp.id,
          name: "CUD under renew",
          instrumentType: "CUD",
          provider: "gcp",
          termMonths: 12,
          rateUsd: 200,
          lockStart: "2026-01-01",
          lockEnd: "2026-02-01",
          family: "compute",
        },
      }),
    );
    await imports.POST(
      jsonReq("http://local/api/imports", {
        method: "POST",
        headers: auth,
        json: {
          clientKey: "renew-under",
          rows: [
            {
              cloudAccountId: gcp.id,
              windowStart: "2026-01-01",
              windowEnd: "2026-02-01",
              eligibleSpendUsd: 800,
              family: "compute",
            },
          ],
        },
      }),
    );
    await coverage.POST(
      jsonReq("http://local/api/coverage", {
        method: "POST",
        headers: auth,
        json: {
          cloudAccountId: gcp.id,
          windowStart: "2026-01-01",
          windowEnd: "2026-02-01",
        },
      }),
    );
  });

  after(() => {
    closeDb();
    rmSync(dir, { recursive: true, force: true });
    delete process.env.CCS_DB_PATH;
  });

  it("POST /api/renewals without Bearer returns 401", async () => {
    const { POST } = await import("../src/app/api/renewals/route");
    const res = await POST(
      jsonReq("http://local/api/renewals", { method: "POST", json: {} }),
    );
    assert.equal(res.status, 401);
  });

  it("POST pack returns cases with recommendedAction buy|reduce|hold tied to gap $", async () => {
    const renewals = await import("../src/app/api/renewals/route");
    const res = await renewals.POST(
      jsonReq("http://local/api/renewals", {
        method: "POST",
        headers: auth,
        json: {},
      }),
    );
    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.softSim, true);
    assert.ok(Array.isArray(body.cases));
    assert.ok(body.cases.length >= 1);
    for (const c of body.cases) {
      assert.ok(
        ["buy", "reduce", "hold"].includes(c.recommendedAction),
        `unexpected recommendedAction ${c.recommendedAction}`,
      );
      assert.ok(typeof c.gapUsd === "number");
      assert.ok(c.renewBy);
      assert.equal(c.status, "open");
    }
    const overCase = body.cases.find(
      (c: { cloudAccountId: string }) => c.cloudAccountId === overAccountId,
    );
    const underCase = body.cases.find(
      (c: { cloudAccountId: string }) => c.cloudAccountId === underAccountId,
    );
    assert.ok(overCase, "expected unused-dominant reduce case");
    assert.equal(overCase.recommendedAction, "reduce");
    assert.ok(underCase, "expected spill-dominant buy case");
    assert.equal(underCase.recommendedAction, "buy");

    const listed = await renewals.GET(
      jsonReq("http://local/api/renewals", { headers: auth }),
    );
    assert.equal(listed.status, 200);
    const listBody = await listed.json();
    assert.equal(listBody.softSim, true);
    assert.ok(Array.isArray(listBody.cases));
    assert.ok(listBody.cases.length >= 1);
    assert.ok(
      listBody.cases.some(
        (c: { recommendedAction: string }) =>
          c.recommendedAction === "buy" ||
          c.recommendedAction === "reduce" ||
          c.recommendedAction === "hold",
      ),
    );
  });

  it("PATCH act/dismiss updates status and writes audit entry", async () => {
    const renewals = await import("../src/app/api/renewals/route");
    const detail = await import("../src/app/api/renewals/[id]/route");
    const packed = await renewals.POST(
      jsonReq("http://local/api/renewals", {
        method: "POST",
        headers: auth,
        json: {},
      }),
    );
    const packBody = await packed.json();
    const openCase = packBody.cases.find(
      (c: { status: string }) => c.status === "open",
    );
    assert.ok(openCase, "need an open case to act");

    const actRes = await detail.PATCH(
      jsonReq(`http://local/api/renewals/${openCase.id}`, {
        method: "PATCH",
        headers: auth,
        json: { status: "acted" },
      }),
      { params: Promise.resolve({ id: openCase.id }) },
    );
    assert.equal(actRes.status, 200);
    const acted = await actRes.json();
    assert.equal(acted.softSim, true);
    assert.equal(acted.case.status, "acted");

    const { getDb } = await import("../src/lib/db");
    const audits = getDb()
      .prepare(
        `SELECT action, entity_id FROM audit_entries WHERE entity_id = ?`,
      )
      .all(openCase.id) as { action: string; entity_id: string }[];
    assert.ok(
      audits.some((a) => a.action === "renewals.act"),
      "expected renewals.act audit row",
    );

    const second = packBody.cases.find(
      (c: { id: string; status: string }) =>
        c.id !== openCase.id && c.status === "open",
    );
    assert.ok(second, "need a second open case to dismiss");
    const dismissRes = await detail.PATCH(
      jsonReq(`http://local/api/renewals/${second.id}`, {
        method: "PATCH",
        headers: auth,
        json: { status: "dismissed" },
      }),
      { params: Promise.resolve({ id: second.id }) },
    );
    assert.equal(dismissRes.status, 200);
    const dismissed = await dismissRes.json();
    assert.equal(dismissed.case.status, "dismissed");
    const dismissAudits = getDb()
      .prepare(
        `SELECT action FROM audit_entries WHERE entity_id = ? AND action = ?`,
      )
      .all(second.id, "renewals.dismiss") as { action: string }[];
    assert.equal(dismissAudits.length, 1);
  });
});

describe("domain-api: org settings + members (PLT-01)", () => {
  const dir = mkdtempSync(join(tmpdir(), "ccs-org-"));
  const dbPath = join(dir, "coverage.db");

  before(() => {
    process.env.CCS_DB_PATH = dbPath;
    closeDb();
    resetDbForTests(dbPath);
  });

  after(() => {
    closeDb();
    rmSync(dir, { recursive: true, force: true });
    delete process.env.CCS_DB_PATH;
  });

  it("GET /api/org without Bearer returns 401", async () => {
    const { GET } = await import("../src/app/api/org/route");
    const res = await GET(jsonReq("http://local/api/org"));
    assert.equal(res.status, 401);
  });

  it("PATCH /api/org without Bearer returns 401", async () => {
    const { PATCH } = await import("../src/app/api/org/route");
    const res = await PATCH(
      jsonReq("http://local/api/org", {
        method: "PATCH",
        json: { name: "Renamed Org" },
      }),
    );
    assert.equal(res.status, 401);
  });

  it("GET /api/members without Bearer returns 401", async () => {
    const { GET } = await import("../src/app/api/members/route");
    const res = await GET(jsonReq("http://local/api/members"));
    assert.equal(res.status, 401);
  });

  it("POST /api/members without Bearer returns 401", async () => {
    const { POST } = await import("../src/app/api/members/route");
    const res = await POST(
      jsonReq("http://local/api/members", {
        method: "POST",
        json: { email: "ops@example.com", role: "admin" },
      }),
    );
    assert.equal(res.status, 401);
  });

  it("with Bearer: GET org, PATCH name/tier, GET/POST members", async () => {
    const orgApi = await import("../src/app/api/org/route");
    const membersApi = await import("../src/app/api/members/route");

    const getRes = await orgApi.GET(
      jsonReq("http://local/api/org", { headers: auth }),
    );
    assert.equal(getRes.status, 200);
    const getBody = await getRes.json();
    assert.equal(getBody.softSim, true);
    assert.ok(getBody.org);
    assert.ok(typeof getBody.org.name === "string");
    assert.ok(typeof getBody.org.seatTier === "string");
    assert.ok(
      getBody.org.webhookSecretMasked === null ||
        typeof getBody.org.webhookSecretMasked === "string",
    );
    assert.equal(
      Object.prototype.hasOwnProperty.call(getBody.org, "webhookSecret"),
      false,
      "raw webhookSecret must not leak on GET",
    );

    const patchRes = await orgApi.PATCH(
      jsonReq("http://local/api/org", {
        method: "PATCH",
        headers: auth,
        json: {
          name: "Coverage Demo Org",
          seatTier: "platform",
          webhookSecret: "whsec_soft_sim_demo",
        },
      }),
    );
    assert.equal(patchRes.status, 200);
    const patched = await patchRes.json();
    assert.equal(patched.softSim, true);
    assert.equal(patched.org.name, "Coverage Demo Org");
    assert.equal(patched.org.seatTier, "platform");
    assert.ok(
      typeof patched.org.webhookSecretMasked === "string" &&
        patched.org.webhookSecretMasked.includes("…"),
      "masked secret after set",
    );
    assert.equal(
      Object.prototype.hasOwnProperty.call(patched.org, "webhookSecret"),
      false,
    );

    const listRes = await membersApi.GET(
      jsonReq("http://local/api/members", { headers: auth }),
    );
    assert.equal(listRes.status, 200);
    const listBody = await listRes.json();
    assert.equal(listBody.softSim, true);
    assert.ok(Array.isArray(listBody.members));
    assert.ok(
      listBody.members.length >= 1,
      "seed demo member when empty",
    );

    const postRes = await membersApi.POST(
      jsonReq("http://local/api/members", {
        method: "POST",
        headers: auth,
        json: { email: "finops@example.com", role: "viewer" },
      }),
    );
    assert.equal(postRes.status, 201);
    const created = await postRes.json();
    assert.equal(created.softSim, true);
    assert.equal(created.member.email, "finops@example.com");
    assert.equal(created.member.role, "viewer");

    const listedAgain = await membersApi.GET(
      jsonReq("http://local/api/members", { headers: auth }),
    );
    const again = await listedAgain.json();
    assert.ok(
      again.members.some(
        (m: { email: string }) => m.email === "finops@example.com",
      ),
    );
  });
});
