import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import { DEMO_BEARER_TOKEN } from "../src/lib/auth";
import { closeDb, resetDbForTests } from "../src/lib/db";
import { seedMultiCloud } from "../src/lib/repos";

const dir = mkdtempSync(join(tmpdir(), "ccs-api-"));
const dbPath = join(dir, "coverage.db");

function authHeaders(extra: HeadersInit = {}): HeadersInit {
  return {
    Authorization: `Bearer ${DEMO_BEARER_TOKEN}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

function req(url: string, init?: RequestInit): Request {
  return new Request(`http://localhost${url}`, init);
}

describe("domain-api: bearer + accounts + commitments", () => {
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
      req("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "aws",
          accountKey: "x",
          displayName: "X",
        }),
      }),
    );
    assert.equal(res.status, 401);
  });

  it("creates aws account then commitment; GET list returns it; seed has ≥2 providers", async () => {
    const db = resetDbForTests(dbPath);
    const seeded = seedMultiCloud(db);
    assert.ok(seeded.aws && seeded.gcp);
    assert.notEqual(seeded.aws.provider, seeded.gcp.provider);

    const accounts = await import("../src/app/api/accounts/route");
    const commitments = await import("../src/app/api/commitments/route");

    const createAcc = await accounts.POST(
      req("/api/accounts", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          provider: "azure",
          accountKey: "az-9",
          displayName: "Azure Lab",
        }),
      }),
    );
    assert.equal(createAcc.status, 201);
    const accBody = await createAcc.json();

    const createCm = await commitments.POST(
      req("/api/commitments", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          cloudAccountId: seeded.aws.id,
          name: "SP compute",
          instrumentType: "SP",
          provider: "aws",
          termMonths: 12,
          rateUsd: 500,
          lockStart: "2026-01-01T00:00:00Z",
          lockEnd: "2027-01-01T00:00:00Z",
          tags: ["renewal"],
        }),
      }),
    );
    assert.equal(createCm.status, 201);

    const list = await commitments.GET(
      req("/api/commitments", { headers: authHeaders() }),
    );
    const listBody = await list.json();
    assert.ok(
      listBody.commitments.some(
        (c: { name: string }) => c.name === "SP compute",
      ),
    );
    assert.ok(accBody.account.provider === "azure");
  });
});

describe("domain-api: commitment search, update, archive", () => {
  const localDir = mkdtempSync(join(tmpdir(), "ccs-api2-"));
  const localDb = join(localDir, "coverage.db");

  before(() => {
    process.env.CCS_DB_PATH = localDb;
    closeDb();
    const db = resetDbForTests(localDb);
    seedMultiCloud(db);
  });

  after(() => {
    closeDb();
    rmSync(localDir, { recursive: true, force: true });
  });

  it("search, PATCH rate/lock, archive excludes from default list", async () => {
    const { aws } = seedMultiCloud(resetDbForTests(localDb));
    const listRoute = await import("../src/app/api/commitments/route");
    const idRoute = await import("../src/app/api/commitments/[id]/route");

    const created = await listRoute.POST(
      req("/api/commitments", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          cloudAccountId: aws.id,
          name: "RI searchable-widget",
          instrumentType: "RI",
          provider: "aws",
          termMonths: 36,
          rateUsd: 300,
          lockStart: "2026-01-01T00:00:00Z",
          lockEnd: "2029-01-01T00:00:00Z",
          tags: ["widget"],
        }),
      }),
    );
    const { commitment } = await created.json();

    const search = await listRoute.GET(
      req("/api/commitments?search=widget", { headers: authHeaders() }),
    );
    const searchBody = await search.json();
    assert.ok(
      searchBody.commitments.some((c: { id: string }) => c.id === commitment.id),
    );

    const patched = await idRoute.PATCH(
      req(`/api/commitments/${commitment.id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({
          rateUsd: 350,
          lockEnd: "2028-06-01T00:00:00Z",
        }),
      }),
      { params: Promise.resolve({ id: commitment.id }) },
    );
    assert.equal(patched.status, 200);
    const patchedBody = await patched.json();
    assert.equal(patchedBody.commitment.rate_usd, 350);

    const archived = await idRoute.PATCH(
      req(`/api/commitments/${commitment.id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ archive: true }),
      }),
      { params: Promise.resolve({ id: commitment.id }) },
    );
    assert.equal(archived.status, 200);

    const defaultList = await listRoute.GET(
      req("/api/commitments", { headers: authHeaders() }),
    );
    const defaultBody = await defaultList.json();
    assert.ok(
      !defaultBody.commitments.some(
        (c: { id: string }) => c.id === commitment.id,
      ),
    );

    const withArchived = await listRoute.GET(
      req("/api/commitments?includeArchived=true", {
        headers: authHeaders(),
      }),
    );
    const archivedList = await withArchived.json();
    assert.ok(
      archivedList.commitments.some(
        (c: { id: string }) => c.id === commitment.id,
      ),
    );
  });
});

describe("domain-api: import batches", () => {
  const localDir = mkdtempSync(join(tmpdir(), "ccs-imp-"));
  const localDb = join(localDir, "coverage.db");

  before(() => {
    process.env.CCS_DB_PATH = localDb;
    closeDb();
    resetDbForTests(localDb);
    seedMultiCloud(resetDbForTests(localDb));
  });

  after(() => {
    closeDb();
    rmSync(localDir, { recursive: true, force: true });
  });

  it("POST import writes UsageSlices; GET status; idempotency 409; failure detail", async () => {
    const db = resetDbForTests(localDb);
    const { aws, gcp } = seedMultiCloud(db);
    assert.ok(aws && gcp);

    const imports = await import("../src/app/api/imports/route");
    const importId = await import("../src/app/api/imports/[id]/route");

    const ok = await imports.POST(
      req("/api/imports", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          clientKey: "batch-1",
          rows: [
            {
              accountKey: "aws-111",
              provider: "aws",
              windowStart: "2026-01-01T00:00:00Z",
              windowEnd: "2026-02-01T00:00:00Z",
              eligibleSpendUsd: 400,
              family: "compute",
            },
            {
              accountKey: "gcp-222",
              provider: "gcp",
              windowStart: "2026-01-01T00:00:00Z",
              windowEnd: "2026-02-01T00:00:00Z",
              eligibleSpendUsd: 250,
            },
          ],
        }),
      }),
    );
    assert.equal(ok.status, 201);
    const okBody = await ok.json();
    assert.equal(okBody.batch.status, "accepted");
    assert.equal(okBody.batch.accepted_count, 2);

    const slices = db
      .prepare("SELECT COUNT(*) AS n FROM usage_slices WHERE import_batch_id = ?")
      .get(okBody.batch.id) as { n: number };
    assert.equal(slices.n, 2);

    const detail = await importId.GET(
      req(`/api/imports/${okBody.batch.id}`, { headers: authHeaders() }),
      { params: Promise.resolve({ id: okBody.batch.id }) },
    );
    assert.equal(detail.status, 200);

    const again = await imports.POST(
      req("/api/imports", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          clientKey: "batch-1",
          rows: [
            {
              accountKey: "aws-111",
              provider: "aws",
              windowStart: "2026-01-01T00:00:00Z",
              windowEnd: "2026-02-01T00:00:00Z",
              eligibleSpendUsd: 1,
            },
          ],
        }),
      }),
    );
    assert.equal(again.status, 409);

    const bad = await imports.POST(
      req("/api/imports", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          rows: [
            {
              accountKey: "missing",
              provider: "aws",
              windowStart: "2026-01-01T00:00:00Z",
              windowEnd: "2026-02-01T00:00:00Z",
              eligibleSpendUsd: 10,
            },
          ],
        }),
      }),
    );
    assert.equal(bad.status, 422);
    const badBody = await bad.json();
    assert.ok(badBody.batch.error_detail);
  });
});
