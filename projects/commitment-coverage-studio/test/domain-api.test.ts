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
