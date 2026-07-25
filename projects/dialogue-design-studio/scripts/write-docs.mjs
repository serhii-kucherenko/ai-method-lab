/**
 * Write tests + product docs for Citizen Pref Studio.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
function w(rel, content) {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
  console.log("wrote", rel);
}

w(
  "test/goldens.test.ts",
  `import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  scoreSafetyFirstPublicOversight,
  scoreInnovationFirstSelfRegulation,
} from "../src/domain/scoring.ts";
import { GOLDENS } from "../src/goldens.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("goldens dual-impl", () => {
  it("ships ≥30 cp-* fixtures matching GOLDENS", () => {
    const files = readdirSync(join(root, "test/fixtures")).filter((f) =>
      f.startsWith("cp-"),
    );
    assert.ok(files.length >= 30);
    assert.equal(GOLDENS.length, files.length);
  });

  it("each golden matches both scorers", () => {
    for (const g of GOLDENS) {
      const safetyOversight = scoreSafetyFirstPublicOversight({
        ...g.input,
        profile: "safety_first_public_oversight",
      });
      const innovationSelf = scoreInnovationFirstSelfRegulation({
        ...g.input,
        profile: "innovation_first_self_regulation",
      });
      assert.deepEqual(safetyOversight, g.expectedSafetyOversight, g.id);
      assert.deepEqual(innovationSelf, g.expectedInnovationSelf, g.id);
      const disk = JSON.parse(
        readFileSync(join(root, "test/fixtures", \`\${g.id}.json\`), "utf8"),
      );
      assert.equal(disk.id, g.id);
    }
  });
});
`,
);

w(
  "test/store.test.ts",
  `import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createPack,
  createCountry,
  createOption,
  createSurvey,
  createPrefRun,
  runCompare,
  resetStore,
  featureInventory,
  checkBearer,
  getOrg,
} from "../src/store.ts";

describe("store", () => {
  it("seeds and runs dual compare", () => {
    resetStore();
    const compare = runCompare({
      name: "seed compare",
      packId: "pack-demo",
      optionId: "option-demo",
      countryId: "country-demo",
      surveyId: "survey-demo",
      prefRunId: "run-demo",
    });
    assert.ok(compare);
    assert.ok(compare!.safetyOversight.overall >= 0);
    assert.ok(compare!.innovationSelf.overall >= 0);
  });

  it("creates pack → option → country → survey → run → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test pack",
      version: "9.9",
      studyFocus: "citizen prefs",
    });
    const option = createOption({
      packId: pack.id,
      label: "Option A",
      kind: "public_oversight",
      oversightHint: "agency",
      attributeCount: 4,
      safetyFloor: 0.4,
    });
    assert.ok(option);
    const country = createCountry({
      packId: pack.id,
      label: "Country A",
      region: "europe",
      countryHint: "eu",
      strataCount: 3,
      prefMin: 0.4,
      prefMax: 0.85,
    });
    assert.ok(country);
    const survey = createSurvey({
      packId: pack.id,
      label: "Survey A",
      mode: "conjoint",
      instrumentHint: "conjoint",
      itemCount: 8,
      responseFloor: 0.3,
    });
    assert.ok(survey);
    const run = createPrefRun({
      packId: pack.id,
      optionId: option!.id,
      countryId: country!.id,
      surveyId: survey!.id,
      safetyPreference: 0.8,
      oversightSupport: 0.75,
      coordinationPreference: 0.7,
      packReadiness: 0.72,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "chain",
      packId: pack.id,
      optionId: option!.id,
      countryId: country!.id,
      surveyId: survey!.id,
      prefRunId: run!.id,
    });
    assert.ok(compare);
  });

  it("ships ≥25 features and bearer auth", () => {
    resetStore();
    assert.ok(featureInventory().length >= 25);
    assert.equal(checkBearer(\`Bearer \${getOrg().bearerToken}\`), true);
    assert.equal(checkBearer("Bearer wrong"), false);
  });
});
`,
);

w(
  "test/ui-critical.test.ts",
  `import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { DISPLAY_NAME } from "../src/claim.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const PAGES = [
  "page.tsx",
  "pricing/page.tsx",
  "demo/page.tsx",
  "onboarding/page.tsx",
  "flows/page.tsx",
  "packs/page.tsx",
  "options/page.tsx",
  "countries/page.tsx",
  "surveys/page.tsx",
  "prefs/page.tsx",
  "compare/page.tsx",
  "scoreboard/page.tsx",
  "settings/page.tsx",
  "honesty/page.tsx",
] as const;

describe("ui critical path", () => {
  it("ships required IA pages without desk clone routes", () => {
    for (const rel of PAGES) {
      const text = readFileSync(join(root, "src/app", rel), "utf8");
      assert.ok(text.length > 80, rel);
    }
    const landing = readFileSync(join(root, "src/app/page.tsx"), "utf8");
    assert.ok(landing.includes("DISPLAY_NAME"));
    assert.ok(landing.includes("/packs"));
    assert.ok(landing.includes("/pricing"));
    assert.ok(landing.includes("/demo"));
    assert.ok(landing.includes("/onboarding"));
    assert.ok(landing.includes("/flows"));
    assert.equal(DISPLAY_NAME, "Citizen Pref Studio");
    assert.ok(!landing.includes('href="/jobs"'));
    assert.ok(!landing.includes('href="/lifecycle"'));
    assert.ok(!landing.includes('href="/scenario"'));
    assert.ok(!landing.includes('href="/batch"'));
    assert.ok(!landing.includes('href="/goldens"'));
  });

  it("pricing shows tiers and method-lab honesty", () => {
    const text = readFileSync(join(root, "src/app/pricing/page.tsx"), "utf8");
    assert.ok(text.includes("Starter") || text.includes("Team"));
    assert.ok(text.includes("Team"));
    assert.ok(
      text.includes("policy") ||
        text.includes("oversight") ||
        text.includes("preference") ||
        text.includes("safety"),
    );
    assert.ok(
      text.includes("method-lab") ||
        text.includes("soft-sim") ||
        text.includes("Soft-sim"),
    );
  });

  it("demo has numbered interactive steps", () => {
    const text = readFileSync(join(root, "src/app/demo/page.tsx"), "utf8");
    assert.ok(text.includes("STEPS"));
    assert.ok(text.includes("Next") || text.includes("step"));
    assert.ok(text.includes("/api/compare") || text.includes("compare"));
  });

  it("onboarding checklist has visible progress", () => {
    const text = readFileSync(
      join(root, "src/app/onboarding/page.tsx"),
      "utf8",
    );
    assert.ok(text.includes("Progress") || text.includes("progress"));
    assert.ok(text.includes("honesty"));
    assert.ok(text.includes("compare") || text.includes("packs"));
  });

  it("flows lists ≥5 named journeys", () => {
    const text = readFileSync(join(root, "src/app/flows/page.tsx"), "utf8");
    assert.ok(text.includes("NAMED_FLOWS"));
    assert.ok(text.includes("Create policy pack"));
    assert.ok(text.includes("Configure regulatory options"));
    assert.ok(text.includes("Configure country cohort"));
    assert.ok(text.includes("Run A/B compare"));
    assert.ok(text.includes("Export + webhook"));
  });
});
`,
);

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
  "README.md",
  `# Citizen Pref Studio

Soft-sim studio for **safety-first public-oversight** AI policy packs vs **innovation-first self-regulation** baselines.

Inspired by [arXiv 2607.14585](https://arxiv.org/abs/2607.14585v1) — not live regulatory authority, not government deployment, not certified polling, not the authors’ survey brand.

## Quick start

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000). Bearer token: \`citizen-pref-dev-token\`.

## Scripts

- \`npm test\` — goldens + store + UI critical
- \`npm run build\` — production build
- \`npm run test:app-up\` — build + live \`/\` smoke
- \`npm run gen:goldens\` — regenerate \`cp-001\`…\`cp-030\`

## Routes

\`/\` · \`/pricing\` · \`/demo\` · \`/onboarding\` · \`/flows\` · \`/packs\` · \`/options\` · \`/countries\` · \`/surveys\` · \`/prefs\` · \`/compare\` · \`/scoreboard\` · \`/settings\` · \`/honesty\`

Offline demo: [try.html](./try.html)
`,
);

w(
  "PRODUCT.md",
  `# Citizen Pref Studio — product

## Buyer outcome
AI policy / product governance leads lock citizen-aligned policy packs after dual compares show safety-first public oversight beats innovation-first self-regulation — with soft-sim honesty.

## Domain
Policy packs · regulatory options · country cohorts · survey batches · preference runs · dual scorers · scoreboard

## Scorers
- A: \`safety_first_public_oversight\`
- B: \`innovation_first_self_regulation\`

## Features
≥37 platform + domain features (see \`GET /api/features\`).

## Honesty
Not live regulatory authority · not government deployment · not certified public-opinion polling · not authors’ survey brand.
`,
);

w(
  "FINDINGS.md",
  `# Findings — Citizen Pref Studio

## What worked
- Distinct IA (packs / options / countries / surveys / prefs) avoided desk-clone nouns.
- Dual scorers encode the paper’s safety > innovation and public oversight > self-regulation pattern as soft-sim A/B.
- ≥30 dual-impl goldens keep scoring regressions honest.

## Limits
- Soft-sim only — no live survey fieldwork or regulatory write-back.
- Authors published no code; product is method-lab inspired, not a rebrand.

## Sources
- https://arxiv.org/abs/2607.14585v1
`,
);

w(
  "try.html",
  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Citizen Pref Studio — try</title>
  <style>
    :root {
      --cp-ink: #151a22;
      --cp-teal: #2a6670;
      --cp-mist: #eef2f5;
      --cp-amber: #b8863a;
    }
    body {
      margin: 0;
      font-family: "Manrope", system-ui, sans-serif;
      color: var(--cp-ink);
      background: linear-gradient(165deg, #0b1016, #151a22 50%, #1a2428);
      min-height: 100vh;
    }
    main {
      max-width: 40rem;
      margin: 0 auto;
      padding: 3rem 1.25rem 4rem;
      color: var(--cp-mist);
    }
    h1 { font-family: Georgia, serif; font-size: 2.4rem; color: var(--cp-amber); margin: 0 0 0.5rem; }
    h2 { font-size: 1.25rem; font-weight: normal; margin: 0 0 1.5rem; }
    label { display: block; margin-top: 0.75rem; font-size: 0.9rem; }
    input { width: 100%; padding: 0.5rem; margin-top: 0.25rem; box-sizing: border-box; }
    button {
      margin-top: 1.25rem;
      background: var(--cp-amber);
      color: var(--cp-ink);
      border: 0;
      padding: 0.65rem 1.1rem;
      cursor: pointer;
      font: inherit;
    }
    .out {
      margin-top: 1.5rem;
      padding: 1rem;
      background: rgba(42, 102, 112, 0.25);
      border: 1px solid rgba(195, 201, 206, 0.35);
    }
    .note { margin-top: 2rem; font-size: 0.85rem; opacity: 0.8; }
  </style>
</head>
<body>
  <main>
    <h1>Citizen Pref Studio</h1>
    <h2>Offline soft-sim: safety vs innovation preference</h2>
    <label>Safety preference (0–1)
      <input id="safety" type="number" min="0" max="1" step="0.05" value="0.7" />
    </label>
    <label>Oversight support (0–1)
      <input id="oversight" type="number" min="0" max="1" step="0.05" value="0.72" />
    </label>
    <label>Innovation adherence (0–1)
      <input id="innovation" type="number" min="0" max="1" step="0.05" value="0.55" />
    </label>
    <button type="button" id="run">Score soft-sim</button>
    <div class="out" id="out">Run to see A/B scores.</div>
    <p class="note">Soft-sim only — not live regulatory authority, not government deployment, not certified polling, not authors’ survey brand. Paper: arXiv 2607.14585</p>
  </main>
  <script>
    function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
    function round2(n) { return Math.round(n * 100) / 100; }
    function scoreA(s, o, i) {
      const safety = clamp(s * 70 + o * 20 - i * 10 + 8, 0, 100);
      const overall = clamp(safety * 0.7 + o * 25, 0, 100);
      return { safety: round2(safety), overall: round2(overall) };
    }
    function scoreB(s, o, i) {
      const innovation = clamp(i * 75 + (1 - s) * 15 + 5, 0, 100);
      const overall = clamp(innovation * 0.75 + i * 20, 0, 100);
      return { innovation: round2(innovation), overall: round2(overall) };
    }
    document.getElementById("run").onclick = () => {
      const s = Number(document.getElementById("safety").value);
      const o = Number(document.getElementById("oversight").value);
      const i = Number(document.getElementById("innovation").value);
      const a = scoreA(s, o, i);
      const b = scoreB(s, o, i);
      const winner = a.overall > b.overall + 0.5
        ? "safety_first_public_oversight"
        : b.overall > a.overall + 0.5
          ? "innovation_first_self_regulation"
          : "tie";
      document.getElementById("out").textContent =
        "A safety-oversight " + a.overall + " · B innovation-self " + b.overall + " · winner " + winner;
    };
  </script>
</body>
</html>
`,
);

console.log("tests + docs done");
