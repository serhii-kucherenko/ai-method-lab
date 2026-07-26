/**
 * Write API routes + tests + docs for Coload Order Studio.
 * Run: node scripts/write-apis-tests.mjs
 */
import { mkdirSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const nt = join(root, "..", "nanodomain-target-studio");
const w = (rel, content) => {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
  console.log("wrote", rel);
};

w(
  "src/app/api/packs/route.ts",
  `import { guard, json } from "@/lib/api";
import { archivePack, createPack, listPacks } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listPacks({
      q: url.searchParams.get("q") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  if (body.action === "archive") {
    const pack = archivePack(body.id);
    if (!pack) return json({ error: "not_found" }, { status: 404 });
    return json({ pack });
  }
  const pack = createPack({
    label: body.label,
    version: body.version,
    formulationFocus: body.formulationFocus ?? body.focus ?? "",
    sessionBudget: body.sessionBudget,
    notes: body.notes,
  });
  return json({ pack }, { status: 201 });
}
`,
);

w(
  "src/app/api/carriers/route.ts",
  `import { guard, json } from "@/lib/api";
import { archiveCarrier, createCarrier, listCarriers } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listCarriers({
      q: url.searchParams.get("q") ?? undefined,
      packId: url.searchParams.get("packId") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  if (body.action === "archive") {
    const row = archiveCarrier(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json({ carrier: row });
  }
  const carrier = createCarrier({
    packId: body.packId,
    label: body.label,
    kind: body.kind,
    poreHint: body.poreHint,
    orderFloor: Number(body.orderFloor ?? 0.5),
    chemoFloor: Number(body.chemoFloor ?? 0.45),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!carrier) return json({ error: "bad_pack" }, { status: 400 });
  return json({ carrier }, { status: 201 });
}
`,
);

w(
  "src/app/api/loads/route.ts",
  `import { guard, json } from "@/lib/api";
import { archiveLoad, createLoad, listLoads } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listLoads({
      q: url.searchParams.get("q") ?? undefined,
      packId: url.searchParams.get("packId") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  if (body.action === "archive") {
    const row = archiveLoad(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json({ load: row });
  }
  const load = createLoad({
    packId: body.packId,
    label: body.label,
    kind: body.kind,
    orderHint: body.orderHint,
    photoFloor: Number(body.photoFloor ?? 0.45),
    leakCeiling: Number(body.leakCeiling ?? 0.35),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!load) return json({ error: "bad_pack" }, { status: 400 });
  return json({ load }, { status: 201 });
}
`,
);

w(
  "src/app/api/assays/route.ts",
  `import { guard, json } from "@/lib/api";
import { createAssayRun, listAssayRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listAssayRuns({
      packId: url.searchParams.get("packId") ?? undefined,
      carrierId: url.searchParams.get("carrierId") ?? undefined,
      loadId: url.searchParams.get("loadId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const run = createAssayRun({
    packId: body.packId,
    carrierId: body.carrierId,
    loadId: body.loadId,
    label: body.label,
    kind: body.kind,
    orderFidelity: Number(body.orderFidelity),
    chemoEncapsulation: Number(body.chemoEncapsulation),
    photoEncapsulation: Number(body.photoEncapsulation),
    assaySignal: Number(body.assaySignal ?? 0.7),
    runNotes: body.runNotes,
  });
  if (!run) return json({ error: "bad_refs" }, { status: 400 });
  return json({ assay: run }, { status: 201 });
}
`,
);

w(
  "src/app/api/compare/route.ts",
  `import { guard, json } from "@/lib/api";
import { listCompares, runCompare } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: listCompares() });
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const compare = runCompare({
    name: body.name,
    packId: body.packId,
    carrierId: body.carrierId,
    loadId: body.loadId,
    assayRunId: body.assayRunId,
    loadBias: body.loadBias ?? body.bias,
    overclaimRisk: body.overclaimRisk,
    poreFillUniformity: body.poreFillUniformity,
    photothermalResponse: body.photothermalResponse,
    burstLeakRisk: body.burstLeakRisk,
  });
  if (!compare) return json({ error: "bad_refs" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
`,
);

w(
  "src/app/api/scoreboard/route.ts",
  `import { guard, json } from "@/lib/api";
import { getScoreboard } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: getScoreboard() });
}
`,
);

w(
  "src/app/api/settings/route.ts",
  `import { guard, json } from "@/lib/api";
import { getOrg, listAudits, listMembers, updateOrg } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({
    org: getOrg(),
    members: listMembers(),
    audits: listAudits(),
  });
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  if (body.action === "updateOrg") {
    return json({ org: updateOrg(body.org ?? body) });
  }
  return json({ error: "unknown_action" }, { status: 400 });
}
`,
);

w(
  "src/app/api/members/route.ts",
  `import { guard, json } from "@/lib/api";
import { inviteMember, listMembers } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: listMembers() });
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const member = inviteMember(body.email, body.role ?? "evaluator");
  return json({ member }, { status: 201 });
}
`,
);

w(
  "src/app/api/export/route.ts",
  `import { NextResponse } from "next/server";
import { guard, json } from "@/lib/api";
import { exportComparesCsv, exportPacksJson } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const format = new URL(req.url).searchParams.get("format") ?? "json";
  if (format === "csv") {
    return new NextResponse(exportComparesCsv(), {
      headers: { "content-type": "text/csv; charset=utf-8" },
    });
  }
  return new NextResponse(exportPacksJson(), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
`,
);

w(
  "src/app/api/audit/route.ts",
  `import { guard, json } from "@/lib/api";
import { listAudits } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: listAudits() });
}
`,
);

w(
  "src/app/api/webhook/route.ts",
  `import { guard, json } from "@/lib/api";
import { ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const result = ingestWebhook(
    req.headers.get("idempotency-key") ?? body.idempotencyKey ?? "",
    body.payload ?? body,
    req.headers.get("x-signature"),
  );
  if (!result.ok) return json(result, { status: 400 });
  return json(result, { status: result.duplicate ? 200 : 201 });
}
`,
);

w(
  "src/app/api/features/route.ts",
  `import { guard, json } from "@/lib/api";
import { featureInventory } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const items = featureInventory();
  return json({ count: items.length, items });
}
`,
);

w(
  "src/app/api/goldens-sample/route.ts",
  `import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({
    count: GOLDENS.length,
    sample: GOLDENS.slice(0, 3),
  });
}
`,
);

w(
  "scripts/gen-goldens.mjs",
  `/**
 * Generate dual-impl golden fixtures for Coload Order Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreOrderedCoload,
  scoreSimultaneousLoad,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "chemo_first",
  "balanced",
  "photo_first",
  "simultaneous_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = \`co-\${String(i).padStart(3, "0")}\`;
  const t = (i - 1) / 29;
  const input = {
    orderFidelity: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    chemoEncapsulation: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    photoEncapsulation: round2(0.25 + t * 0.55 + ((i % 3) - 1) * 0.02),
    poreFillUniformity: round2(0.35 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    photothermalResponse: round2(0.3 + t * 0.55 + ((i % 3) - 1) * 0.02),
    burstLeakRisk: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    assaySignal: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    loadBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "simultaneous_load_baseline"
        : "ordered_coload_sequence",
  };
  const expectedOrdered = scoreOrderedCoload({
    ...input,
    profile: "ordered_coload_sequence",
  });
  const expectedSimultaneous = scoreSimultaneousLoad({
    ...input,
    profile: "simultaneous_load_baseline",
  });
  const row = {
    id,
    input,
    expectedOrdered,
    expectedSimultaneous,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, \`\${id}.json\`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("co-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = \`import type { ColoadInput, ColoadQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ColoadInput;
  expectedOrdered: ColoadQuality;
  expectedSimultaneous: ColoadQuality;
};

export const GOLDENS: Golden[] = \${JSON.stringify(goldens, null, 2)};
\`;
writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log("wrote", goldens.length, "goldens");
`,
);

// Copy app-up test and adapt
w(
  "test/app-up.test.ts",
  `/**
 * Live Next.js smoke: production build must succeed, then \`next start\`
 * must serve \`/\` with the product display name.
 */
import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import { createServer } from "node:net";
import { setTimeout as delay } from "node:timers/promises";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { DISPLAY_NAME } from "../src/claim.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const isWin = process.platform === "win32";
const nextBin = join(root, "node_modules", "next", "dist", "bin", "next");

async function freePort(): Promise<number> {
  return await new Promise((resolve, reject) => {
    const s = createServer();
    s.listen(0, "127.0.0.1", () => {
      const addr = s.address();
      if (!addr || typeof addr === "string") {
        s.close();
        reject(new Error("no port"));
        return;
      }
      const port = addr.port;
      s.close((err) => (err ? reject(err) : resolve(port)));
    });
  });
}

function runNode(
  args: string[],
): Promise<{ code: number | null; out: string }> {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, args, {
      cwd: root,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });
    let out = "";
    child.stdout?.on("data", (b) => {
      out += String(b);
    });
    child.stderr?.on("data", (b) => {
      out += String(b);
    });
    child.on("close", (code) => resolve({ code, out }));
  });
}

async function killTree(child: ChildProcess): Promise<void> {
  if (!child.pid) return;
  if (isWin) {
    await new Promise<void>((resolve) => {
      const killer = spawn(
        "cmd.exe",
        ["/c", "taskkill", "/pid", String(child.pid), "/T", "/F"],
        { stdio: "ignore", windowsHide: true },
      );
      killer.on("close", () => resolve());
    });
    return;
  }
  child.kill("SIGTERM");
  await delay(300);
  try {
    child.kill("SIGKILL");
  } catch {
    /* gone */
  }
}

describe("app-up live smoke", () => {
  it(
    "next build succeeds and next start serves the landing",
    { timeout: 300_000 },
    async () => {
      const build = await runNode([nextBin, "build"]);
      assert.equal(
        build.code,
        0,
        \`next build failed:\\n\${build.out.slice(-4000)}\`,
      );

      const port = await freePort();
      const child = spawn(
        process.execPath,
        [nextBin, "start", "-H", "127.0.0.1", "-p", String(port)],
        {
          cwd: root,
          env: { ...process.env, PORT: String(port) },
          stdio: ["ignore", "pipe", "pipe"],
          windowsHide: true,
        },
      );
      let boot = "";
      child.stdout?.on("data", (b) => {
        boot += String(b);
      });
      child.stderr?.on("data", (b) => {
        boot += String(b);
      });

      let ok = false;
      let lastErr = "";
      try {
        for (let i = 0; i < 60; i++) {
          await delay(500);
          try {
            const res = await fetch(\`http://127.0.0.1:\${port}/\`);
            const body = await res.text();
            if (res.ok && body.includes(DISPLAY_NAME)) {
              ok = true;
              break;
            }
            lastErr = \`status \${res.status}, missing \${DISPLAY_NAME}\`;
          } catch (e) {
            lastErr = e instanceof Error ? e.message : String(e);
          }
        }
        assert.equal(
          ok,
          true,
          \`app not up on :\${port}: \${lastErr}\\nboot:\\n\${boot.slice(-2000)}\`,
        );
      } finally {
        await killTree(child);
      }
    },
  );
});
`,
);

w(
  "test/goldens.test.ts",
  `import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  scoreOrderedCoload,
  scoreSimultaneousLoad,
} from "../src/domain/scoring.ts";
import { GOLDENS } from "../src/goldens.ts";

describe("coload goldens", () => {
  it("ships at least 30 dual-impl fixtures", () => {
    assert.ok(GOLDENS.length >= 30);
    assert.equal(GOLDENS[0].id, "co-001");
    assert.equal(GOLDENS[GOLDENS.length - 1].id, "co-030");
  });

  for (const g of GOLDENS) {
    it(\`\${g.id} matches ordered + simultaneous scorers\`, () => {
      const ordered = scoreOrderedCoload({
        ...g.input,
        profile: "ordered_coload_sequence",
      });
      const simultaneous = scoreSimultaneousLoad({
        ...g.input,
        profile: "simultaneous_load_baseline",
      });
      assert.deepEqual(ordered, g.expectedOrdered);
      assert.deepEqual(simultaneous, g.expectedSimultaneous);
    });
  }
});
`,
);

w(
  "test/store.test.ts",
  `import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  createPack,
  featureInventory,
  listPacks,
  resetStore,
  runCompare,
} from "../src/store.ts";

describe("coload store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds a demo pack", () => {
    const { items, total } = listPacks();
    assert.ok(total >= 1);
    assert.ok(items.some((p) => p.id === "pack-demo"));
  });

  it("creates packs and runs dual compare", () => {
    const pack = createPack({
      label: "Test pack",
      version: "0.1",
      formulationFocus: "ordered vs simultaneous",
    });
    assert.ok(pack.id);
    const compare = runCompare({
      name: "seed compare",
      packId: "pack-demo",
      carrierId: "carrier-demo",
      loadId: "load-demo",
      assayRunId: "assay-demo",
      loadBias: "chemo_first",
    });
    assert.ok(compare);
    assert.ok(
      compare.winner === "ordered_coload_sequence" ||
        compare.winner === "simultaneous_load_baseline" ||
        compare.winner === "tie",
    );
  });

  it("lists at least 25 features", () => {
    assert.ok(featureInventory().length >= 25);
  });
});
`,
);

w(
  "test/ui-critical.test.ts",
  `import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { describe, it } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const PAGES = [
  "page.tsx",
  "pricing/page.tsx",
  "demo/page.tsx",
  "onboarding/page.tsx",
  "flows/page.tsx",
  "honesty/page.tsx",
  "packs/page.tsx",
  "carriers/page.tsx",
  "loads/page.tsx",
  "assays/page.tsx",
  "compare/page.tsx",
  "scoreboard/page.tsx",
  "settings/page.tsx",
];

describe("ui critical paths", () => {
  for (const rel of PAGES) {
    it(\`ships src/app/\${rel}\`, () => {
      const p = join(root, "src/app", rel);
      assert.equal(existsSync(p), true);
      const src = readFileSync(p, "utf8");
      assert.ok(src.length > 100);
    });
  }

  it("landing sells ordered co-load buyer outcome", () => {
    const src = readFileSync(join(root, "src/app/page.tsx"), "utf8");
    assert.ok(src.includes("Order the load") || src.includes("TAGLINE"));
    assert.ok(src.includes("simultaneous") || src.includes("co-load"));
  });
});
`,
);

console.log("apis + tests done");
