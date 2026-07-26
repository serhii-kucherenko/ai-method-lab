/**
 * Write tests, try.html, README for Ageing Wisely Studio.
 */
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const w = (rel, content) => {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
  console.log("wrote", rel);
};

w(
  "test/goldens.test.ts",
  `import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  scoreTherapistSupported,
  scoreWaitlistSelfGuided,
} from "../src/domain/scoring.ts";
import { GOLDENS } from "../src/goldens.ts";
import type { CareInput, CareQuality } from "../src/domain/types.ts";

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), "fixtures");

function assertQuality(actual: CareQuality, expected: CareQuality) {
  for (const key of Object.keys(expected) as (keyof CareQuality)[]) {
    if (typeof expected[key] === "number") {
      assert.equal(actual[key], expected[key], String(key));
    } else {
      assert.equal(actual[key], expected[key], String(key));
    }
  }
}

describe("ageing wisely goldens", () => {
  it("has at least 30 goldens", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  it("matches dual scorers for every golden", () => {
    for (const g of GOLDENS) {
      const therapist = scoreTherapistSupported({
        ...g.input,
        profile: "therapist_supported_icbt",
      });
      const waitlist = scoreWaitlistSelfGuided({
        ...g.input,
        profile: "waitlist_self_guided_baseline",
      });
      assertQuality(therapist, g.expectedTherapist);
      assertQuality(waitlist, g.expectedWaitlist);
    }
  });

  it("fixtures stay aligned with goldens.ts", () => {
    const files = readdirSync(fixturesDir).filter((f) => f.endsWith(".json"));
    assert.ok(files.length >= 30);
    for (const f of files) {
      const row = JSON.parse(
        readFileSync(join(fixturesDir, f), "utf8"),
      ) as (typeof GOLDENS)[number];
      const match = GOLDENS.find((g) => g.id === row.id);
      assert.ok(match, row.id);
      assert.deepEqual(match, row);
    }
  });
});
`,
);

w(
  "test/store.test.ts",
  `import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it, beforeEach } from "node:test";
import { DEV_TOKEN } from "../src/claim.ts";
import {
  checkBearer,
  createCohort,
  createModule,
  createPack,
  createSessionRun,
  featureInventory,
  ingestWebhook,
  inviteMember,
  listPacks,
  resetStore,
  runCompare,
  updateOrg,
} from "../src/store.ts";

describe("ageing wisely store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds demo pack and accepts bearer", () => {
    assert.ok(listPacks().total >= 1);
    assert.equal(checkBearer(\`Bearer \${DEV_TOKEN}\`), true);
    assert.equal(checkBearer("Bearer wrong"), false);
  });

  it("creates pack → cohort → module → session → compare", () => {
    const pack = createPack({
      label: "Test pack",
      version: "1.0",
      careFocus: "iCBT soft-sim",
    });
    const cohort = createCohort({
      packId: pack.id,
      label: "Cohort",
      kind: "community_older_adults",
      inclusionHint: "age65plus",
      supportFloor: 0.5,
      completionFloor: 0.45,
    });
    assert.ok(cohort);
    const module = createModule({
      packId: pack.id,
      label: "Module",
      kind: "behavioral_activation",
      pathHint: "activation",
      engagementFloor: 0.5,
      dropoutCeiling: 0.3,
    });
    assert.ok(module);
    const session = createSessionRun({
      packId: pack.id,
      cohortId: cohort!.id,
      moduleId: module!.id,
      label: "Session",
      kind: "guided_checkin",
      therapistSupportFidelity: 0.8,
      moduleCompletion: 0.7,
      engagementAdherence: 0.75,
      sessionSignal: 0.7,
    });
    assert.ok(session);
    const compare = runCompare({
      name: "A/B",
      packId: pack.id,
      cohortId: cohort!.id,
      moduleId: module!.id,
      sessionRunId: session!.id,
      careBias: "therapist_first",
    });
    assert.ok(compare);
    assert.ok(compare!.therapist.overall >= 0);
    assert.ok(compare!.waitlist.overall >= 0);
  });

  it("invites members and ingests idempotent webhooks", () => {
    inviteMember("peer@ageing-wisely.local", "evaluator");
    const org = updateOrg({ webhookSecret: "secret-test" });
    const payload = { event: "pack.locked" };
    const body = JSON.stringify(payload);
    const signature = \`sha256=\${createHmac("sha256", org.webhookSecret).update(body).digest("hex")}\`;
    const first = ingestWebhook("key-1", payload, signature);
    const second = ingestWebhook("key-1", payload, signature);
    assert.equal(first.ok, true);
    assert.equal(second.duplicate, true);
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
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
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
  "cohorts/page.tsx",
  "modules/page.tsx",
  "sessions/page.tsx",
  "compare/page.tsx",
  "scoreboard/page.tsx",
  "settings/page.tsx",
];

describe("ui critical paths", () => {
  for (const rel of PAGES) {
    it(\`ships \${rel}\`, () => {
      const p = join(root, "src/app", rel);
      assert.equal(existsSync(p), true, p);
      const src = readFileSync(p, "utf8");
      assert.ok(src.length > 100);
    });
  }

  it("landing sells buyer outcome", () => {
    const src = readFileSync(join(root, "src/app/page.tsx"), "utf8");
    assert.match(src, /therapist-supported/i);
    assert.match(src, /Ageing Wisely Studio/);
  });

  it("domain routes avoid desk clone shells", () => {
    for (const banned of ["/jobs", "/lifecycle", "/scenario"]) {
      assert.equal(existsSync(join(root, "src/app", banned.slice(1))), false);
    }
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
  "try.html",
  `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Ageing Wisely Studio — offline soft-sim</title>
  <style>
    :root { --aw-ink:#16181c; --aw-sage:#3d6a5e; --aw-mist:#eef2f1; --aw-amber:#a87d3c; }
    body { font-family: Georgia, serif; margin: 0; background: var(--aw-mist); color: var(--aw-ink); }
    main { max-width: 40rem; margin: 0 auto; padding: 2rem 1.25rem; }
    h1 { font-size: 1.75rem; }
    label { display:block; margin-top: .75rem; font-size: .9rem; }
    input, select { width: 100%; padding: .45rem; margin-top: .25rem; }
    button { margin-top: 1rem; background: var(--aw-sage); color: white; border: 0; padding: .6rem 1rem; }
    .out { margin-top: 1.25rem; padding: 1rem; background: white; border: 1px solid #c5cac7; }
    .note { font-size: .85rem; color: #5a6560; margin-top: 1rem; }
  </style>
</head>
<body>
  <main>
    <h1>Ageing Wisely Studio</h1>
    <p>Offline soft-sim: therapist-supported iCBT vs waitlist / self-guided baseline.</p>
    <label>Therapist support fidelity <input id="support" type="number" min="0" max="1" step="0.01" value="0.72" /></label>
    <label>Module completion <input id="completion" type="number" min="0" max="1" step="0.01" value="0.68" /></label>
    <label>Engagement adherence <input id="engagement" type="number" min="0" max="1" step="0.01" value="0.74" /></label>
    <label>Symptom relief signal <input id="relief" type="number" min="0" max="1" step="0.01" value="0.6" /></label>
    <label>Co-design fit <input id="codesign" type="number" min="0" max="1" step="0.01" value="0.55" /></label>
    <label>Dropout risk <input id="dropout" type="number" min="0" max="1" step="0.01" value="0.3" /></label>
    <label>Care bias
      <select id="bias">
        <option value="balanced">balanced</option>
        <option value="therapist_first">therapist_first</option>
        <option value="self_guided_first">self_guided_first</option>
        <option value="waitlist_first">waitlist_first</option>
      </select>
    </label>
    <button type="button" id="run">Score A/B</button>
    <div class="out" id="out">Run to see soft-sim scores.</div>
    <p class="note">Not clinical diagnosis, not live therapist replacement, not regulated digital therapeutic clearance.</p>
  </main>
  <script>
    function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
    function round2(n) { return Math.round(n * 100) / 100; }
    function biasWeight(bias, lane) {
      if (bias === "balanced") return 1;
      return bias === lane ? 1.35 : 0.55;
    }
    function scoreTherapist(input) {
      const only = true;
      const boost = 1.12;
      const wT = biasWeight(input.careBias, "therapist_first");
      const supportScore = round2(clamp(input.therapistSupportFidelity * 55 * boost * wT + input.coDesignFit * 20 + 8 - input.overclaimRisk * 6, 0, 100));
      const completionScore = round2(clamp(input.moduleCompletion * 55 * boost + input.therapistSupportFidelity * 20, 0, 100));
      const engagementScore = round2(clamp(input.engagementAdherence * 50 * boost + (1 - input.dropoutRisk) * 20, 0, 100));
      const reliefScore = round2(clamp(input.symptomReliefSignal * 45 * boost + input.moduleCompletion * 20, 0, 100));
      const overall = round2(clamp(supportScore * 0.35 + completionScore * 0.3 + engagementScore * 0.2 + reliefScore * 0.15, 0, 100));
      return { supportScore, completionScore, engagementScore, reliefScore, overall };
    }
    function scoreWaitlist(input) {
      const boost = 1.08;
      const supportScore = round2(clamp(input.moduleCompletion * 20 * boost + input.engagementAdherence * 20 - input.therapistSupportFidelity * 18, 0, 100));
      const completionScore = round2(clamp(input.moduleCompletion * 42 * boost + (1 - input.therapistSupportFidelity) * 18, 0, 100));
      const engagementScore = round2(clamp(input.engagementAdherence * 38 * boost + input.symptomReliefSignal * 25, 0, 100));
      const reliefScore = round2(clamp(input.symptomReliefSignal * 50 * boost - input.therapistSupportFidelity * 10, 0, 100));
      const overall = round2(clamp(reliefScore * 0.45 + completionScore * 0.3 + engagementScore * 0.25, 0, 100));
      return { supportScore, completionScore, engagementScore, reliefScore, overall };
    }
    document.getElementById("run").onclick = () => {
      const input = {
        therapistSupportFidelity: Number(support.value),
        moduleCompletion: Number(completion.value),
        engagementAdherence: Number(engagement.value),
        symptomReliefSignal: Number(relief.value),
        coDesignFit: Number(codesign.value),
        dropoutRisk: Number(dropout.value),
        overclaimRisk: 0.28,
        careBias: bias.value,
      };
      const a = scoreTherapist(input);
      const b = scoreWaitlist(input);
      const winner = a.overall > b.overall + 0.5 ? "therapist_supported_icbt" : b.overall > a.overall + 0.5 ? "waitlist_self_guided_baseline" : "tie";
      out.textContent = "A therapist " + a.overall + " · B waitlist " + b.overall + " · winner " + winner;
    };
  </script>
</body>
</html>
`,
);

w(
  "README.md",
  `# Ageing Wisely Studio

Soft-sim studio for geriatric digital mental-health / care-delivery analytics leads.
Compare **therapist-supported internet CBT** designs against **waitlist or self-guided baselines** before locking a care pack.

## Run

\`\`\`bash
cd projects/ageing-wisely-studio
npm install
npm run dev
\`\`\`

Open http://localhost:3000

## Tests

\`\`\`bash
npm test
npm run test:app-up
\`\`\`

## Honesty

Not clinical diagnosis, not live therapist replacement, not regulated digital therapeutic clearance, not the authors' Ageing Wisely program.

Paper: https://osf.io/preprints/psyarxiv/hukx9_v1/
`,
);

// update package.json scripts without BOM
const pkgPath = join(root, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
pkg.scripts = {
  ...pkg.scripts,
  test: "tsx --test test/goldens.test.ts test/store.test.ts test/ui-critical.test.ts",
  "test:app-up": "tsx --test test/app-up.test.ts",
  "test:unit": "tsx --test test/goldens.test.ts test/store.test.ts",
  "gen:goldens": "tsx scripts/gen-goldens.mjs",
};
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log("updated package.json scripts");
