/**
 * Commercial surfaces, tests, try.html, README.
 * Run: node scripts/bootstrap-finish.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
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
  "src/app/pricing/page.tsx",
  `import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Surveillance desk",
    price: "$0 method-lab",
    blurb: "Single-org soft-sim packs, scenarios, and dual compare.",
    includes: ["Risk packs", "CMIP6 scenarios", "A/B compare", "Honesty fence"],
  },
  {
    name: "Regional bench",
    price: "$ hypothetical / seat",
    blurb: "Multi-member invites, webhook export, scoreboard for climate leads.",
    includes: ["Everything in desk", "Members + audit", "CSV/JSON export", "Webhook ingest"],
  },
  {
    name: "National soft-sim",
    price: "Site license (hypothetical)",
    blurb: "Broader grid budgets and org rate limits for surveillance programs.",
    includes: ["Everything in regional", "Higher rate limits", "Goldens sample API", "Priority guide link"],
  },
];

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical Method Lab packaging for dengue thermal-suitability soft-sim — not a live checkout."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div key={tier.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-xl">{tier.name}</h2>
            <p className="mt-1 text-sm text-[var(--ds-teal)]">{tier.price}</p>
            <p className="mt-3 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              {tier.blurb}
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
              {tier.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm">
        <Link href="/onboarding" className="underline text-[var(--ds-teal)]">
          Start onboarding
        </Link>
        {" · "}
        <Link href="/honesty" className="underline text-[var(--ds-teal)]">
          Read honesty
        </Link>
      </p>
    </StudioShell>
  );
}

export default PricingPage;
`,
);

w(
  "src/app/demo/page.tsx",
  `"use client";
import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  "Open the seeded risk pack",
  "Review the CMIP6 SSP5-8.5 scenario",
  "Confirm Aedes aegypti niche + urban overlay",
  "Run CMIP6 vs historical compare",
  "Check scoreboard + honesty fence",
];

export function DemoPage() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const runCompare = async () => {
    try {
      const [packs, scenarios, species, populations] = await Promise.all([
        api<{ items: { id: string }[] }>("/api/packs"),
        api<{ items: { id: string }[] }>("/api/scenarios"),
        api<{ items: { id: string }[] }>("/api/species"),
        api<{ items: { id: string }[] }>("/api/populations"),
      ]);
      const packId = packs.items[0]?.id;
      const scenarioId = scenarios.items[0]?.id;
      const speciesId = species.items[0]?.id;
      const populationId = populations.items[0]?.id;
      if (!packId || !scenarioId || !speciesId || !populationId) {
        throw new Error("Seed data missing");
      }
      const res = await api<{
        compare: { winner: string; gap: number; cmip6: { overall: number }; historical: { overall: number } };
      }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Guided demo compare",
          packId,
          scenarioId,
          speciesId,
          populationId,
          climateBias: "balanced",
        }),
      });
      setResult(
        \`Winner \${res.compare.winner} · gap \${res.compare.gap} · CMIP6 \${res.compare.cmip6.overall} vs hist \${res.compare.historical.overall}\`,
      );
      setStep(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Demo failed");
    }
  };

  return (
    <StudioShell
      title="Guided demo"
      subtitle="Walk the core dengue thermal-suitability happy path in five steps."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ol className="mb-8 space-y-3">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={\`rounded-lg border px-4 py-3 \${i === step ? "border-[var(--ds-teal)] bg-white" : "bg-white/70"}\`}
          >
            <span className="text-sm text-[var(--ds-teal)]">Step {i + 1}</span>
            <p className="font-medium">{label}</p>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))}>
          Back
        </Button>
        <Button type="button" variant="outline" onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>
          Next
        </Button>
        <Button type="button" onClick={() => void runCompare()}>
          Run demo compare
        </Button>
        <Link href="/compare" className="inline-flex items-center text-sm underline text-[var(--ds-teal)]">
          Open compare
        </Link>
      </div>
      {result ? <p className="mt-6 text-sm text-[var(--ds-teal)]">{result}</p> : null}
    </StudioShell>
  );
}

export default DemoPage;
`,
);

w(
  "src/app/onboarding/page.tsx",
  `"use client";
import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const CHECKS = [
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
  { id: "pack", label: "Create or open a risk pack", href: "/packs" },
  { id: "scenario", label: "Configure a CMIP6 scenario", href: "/scenarios" },
  { id: "species", label: "Add a vector species niche", href: "/species" },
  { id: "population", label: "Attach a population overlay", href: "/populations" },
  { id: "compare", label: "Run an A/B compare", href: "/compare" },
];

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = CHECKS.filter((c) => done[c.id]).length;

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist for climate-surveillance leads standing up a dengue thermal-suitability soft-sim pack."
    >
      <p className="mb-6 text-sm text-[var(--ds-teal)]">
        Progress {progress} / {CHECKS.length}
      </p>
      <div className="mb-4 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
        <div
          className="score-bar h-full bg-[var(--ds-teal)]"
          style={{ width: \`\${(progress / CHECKS.length) * 100}%\` }}
        />
      </div>
      <ul className="space-y-3">
        {CHECKS.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white px-4 py-3">
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={!!done[item.id]}
                onChange={(e) => setDone((d) => ({ ...d, [item.id]: e.target.checked }))}
              />
              {item.label}
            </label>
            <Link href={item.href} className="text-sm underline text-[var(--ds-teal)]">
              Open
            </Link>
          </li>
        ))}
      </ul>
      <Button type="button" className="mt-6" variant="outline" onClick={() => setDone({})}>
        Reset checklist
      </Button>
    </StudioShell>
  );
}

export default OnboardingPage;
`,
);

w(
  "src/app/flows/page.tsx",
  `import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const FLOWS = [
  {
    name: "Create risk pack",
    actor: "Surveillance analytics lead",
    job: "Version a dengue risk pack before climate compare",
    steps: "/packs → label/version/risk focus → active pack",
    success: "Pack listed and searchable",
    failure: "Missing label or auth → error banner",
    href: "/packs",
  },
  {
    name: "Configure CMIP6 scenario",
    actor: "Climate-health modeller",
    job: "Make SSP horizon and thermal floors explicit",
    steps: "/scenarios → pick pack → SSP kind + horizon → create",
    success: "Scenario row with kind + horizon",
    failure: "Bad pack id → create rejected",
    href: "/scenarios",
  },
  {
    name: "Configure species/population overlay",
    actor: "Vector ecologist / analytics lead",
    job: "Attach niche + population-at-risk soft-sim",
    steps: "/species → /populations → thermal + PAR fields",
    success: "Overlay linked to scenario + species",
    failure: "Missing refs → bad_refs",
    href: "/populations",
  },
  {
    name: "Run A/B compare",
    actor: "Evaluator",
    job: "See CMIP6 thermal suitability beat or lose to historical baseline",
    steps: "/compare → select refs → climate bias → scoreboard",
    success: "Winner + gap + dual score bars",
    failure: "Empty selects → cannot run",
    href: "/compare",
  },
  {
    name: "Export + webhook",
    actor: "Org owner / reviewer",
    job: "Export compares and ingest idempotent webhook events",
    steps: "/scoreboard export → /settings webhook → POST /api/webhook",
    success: "CSV download + audit webhook.ingest",
    failure: "Bad HMAC or missing idempotency key",
    href: "/settings",
  },
];

export function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Five sophisticated journeys for dengue thermal-suitability soft-sim — not a single happy path."
    >
      <div className="space-y-5">
        {FLOWS.map((flow) => (
          <article key={flow.name} className="rounded-lg border bg-white p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-[family-name:var(--font-display)] text-xl">{flow.name}</h2>
              <Link href={flow.href} className="text-sm underline text-[var(--ds-teal)]">
                Enter
              </Link>
            </div>
            <p className="mt-2 text-sm">
              <strong>Actor:</strong> {flow.actor}
            </p>
            <p className="text-sm">
              <strong>Job:</strong> {flow.job}
            </p>
            <p className="text-sm">
              <strong>Steps:</strong> {flow.steps}
            </p>
            <p className="text-sm">
              <strong>Success:</strong> {flow.success}
            </p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              <strong>Failure / empty:</strong> {flow.failure}
            </p>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}

export default FlowsPage;
`,
);

w(
  "src/app/honesty/page.tsx",
  `import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="What Dengue Suit Studio is — and what it must never claim."
    >
      <div className="max-w-2xl space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          This is a Method Lab soft-sim for comparing CMIP6 thermal-suitability
          dengue risk maps against static historical baselines before locking a
          surveillance pack.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not live outbreak prediction</li>
          <li>Not clinical diagnosis</li>
          <li>Not operational mosquito control deployment</li>
          <li>Not the authors&apos; dengue atlas or official climate product</li>
        </ul>
        <p>
          Source paper:{" "}
          <a href={PAPER_URL} className="underline text-[var(--ds-teal)]">
            medRxiv 10.64898/2026.07.02.26357126
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          <Link href="/flows" className="underline text-[var(--ds-teal)]">
            Back to flows
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
`,
);

w(
  "scripts/gen-goldens.mjs",
  `/**
 * Generate dual-impl golden fixtures for Dengue Suit Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreCmip6Thermal,
  scoreStaticHistorical,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "ssp585_first",
  "balanced",
  "ssp126_first",
  "historical_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = \`ds-\${String(i).padStart(3, "0")}\`;
  const t = (i - 1) / 29;
  const input = {
    thermalSuitIndex: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    populationAtRisk: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    climateShiftSignal: round2(0.25 + t * 0.55 + ((i % 3) - 1) * 0.02),
    vectorNicheFidelity: round2(0.3 + t * 0.55 + ((i % 3) - 1) * 0.02),
    spatialCoverage: round2(0.35 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    historicalStickiness: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    assaySignal: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    climateBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "static_historical_baseline"
        : "cmip6_thermal_suitability",
  };
  const expectedCmip6 = scoreCmip6Thermal({
    ...input,
    profile: "cmip6_thermal_suitability",
  });
  const expectedHistorical = scoreStaticHistorical({
    ...input,
    profile: "static_historical_baseline",
  });
  const row = {
    id,
    input,
    expectedCmip6,
    expectedHistorical,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, \`\${id}.json\`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("ds-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = \`import type { SuitInput, SuitQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: SuitInput;
  expectedCmip6: SuitQuality;
  expectedHistorical: SuitQuality;
};

export const GOLDENS: Golden[] = \${JSON.stringify(goldens, null, 2)};
\`;
writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log("wrote", goldens.length, "goldens");
`,
);

w(
  "test/goldens.test.ts",
  `import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  scoreCmip6Thermal,
  scoreStaticHistorical,
} from "../src/domain/scoring.ts";
import { GOLDENS } from "../src/goldens.ts";

describe("dual-impl goldens", () => {
  it("has at least 30 fixtures", () => {
    assert.ok(GOLDENS.length >= 30);
  });

  for (const g of GOLDENS) {
    it(\`\${g.id} matches both scorers\`, () => {
      const cmip6 = scoreCmip6Thermal({
        ...g.input,
        profile: "cmip6_thermal_suitability",
      });
      const historical = scoreStaticHistorical({
        ...g.input,
        profile: "static_historical_baseline",
      });
      assert.deepEqual(cmip6, g.expectedCmip6);
      assert.deepEqual(historical, g.expectedHistorical);
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
  createPopulation,
  createScenario,
  createSpecies,
  featureInventory,
  listPacks,
  resetStore,
  runCompare,
} from "../src/store.ts";

describe("store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds a demo pack", () => {
    const packs = listPacks();
    assert.ok(packs.total >= 1);
  });

  it("runs dual compare end-to-end", () => {
    const pack = createPack({
      label: "Test pack",
      version: "1",
      riskFocus: "thermal",
    });
    const scenario = createScenario({
      packId: pack.id,
      label: "SSP2",
      kind: "ssp245",
      horizonHint: "2050",
      thermalFloor: 0.5,
      shiftFloor: 0.45,
    });
    const species = createSpecies({
      packId: pack.id,
      label: "Albopictus",
      kind: "aedes_albopictus",
      nicheHint: "peri-urban",
      nicheFloor: 0.5,
      stickinessCeiling: 0.3,
    });
    assert.ok(scenario && species);
    const population = createPopulation({
      packId: pack.id,
      scenarioId: scenario!.id,
      speciesId: species!.id,
      label: "Peri overlay",
      kind: "peri_urban",
      thermalSuitIndex: 0.7,
      populationAtRisk: 0.6,
      climateShiftSignal: 0.65,
      assaySignal: 0.7,
    });
    assert.ok(population);
    const compare = runCompare({
      name: "store test",
      packId: pack.id,
      scenarioId: scenario!.id,
      speciesId: species!.id,
      populationId: population!.id,
    });
    assert.ok(compare);
    assert.ok(
      compare!.winner === "cmip6_thermal_suitability" ||
        compare!.winner === "static_historical_baseline" ||
        compare!.winner === "tie",
    );
  });

  it("lists ≥25 features", () => {
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
  "scenarios/page.tsx",
  "species/page.tsx",
  "populations/page.tsx",
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
    assert.match(src, /CMIP6 thermal/i);
    assert.match(src, /DISPLAY_NAME/);
    assert.match(src, /Risk packs for dengue surveillance/i);
  });

  it("domain routes avoid desk clone shells", () => {
    for (const banned of ["/jobs", "/lifecycle"]) {
      assert.equal(existsSync(join(root, "src/app", banned.slice(1))), false);
    }
    assert.equal(existsSync(join(root, "src/app/scenarios")), true);
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
  <title>Dengue Suit Studio — offline soft-sim</title>
  <style>
    :root { --ds-ink:#12171c; --ds-teal:#1f6a6e; --ds-mist:#eef3f4; --ds-amber:#b4833a; }
    body { font-family: Georgia, serif; margin: 0; background: var(--ds-mist); color: var(--ds-ink); }
    main { max-width: 40rem; margin: 0 auto; padding: 2rem 1.25rem; }
    h1 { font-size: 1.75rem; }
    label { display:block; margin-top: .75rem; font-size: .9rem; }
    input, select { width: 100%; padding: .45rem; margin-top: .25rem; }
    button { margin-top: 1rem; background: var(--ds-teal); color: white; border: 0; padding: .6rem 1rem; }
    .out { margin-top: 1.25rem; padding: 1rem; background: white; border: 1px solid #c3c9ce; }
    .note { font-size: .85rem; color: #556066; margin-top: 1rem; }
  </style>
</head>
<body>
  <main>
    <h1>Dengue Suit Studio</h1>
    <p>Offline soft-sim: CMIP6 thermal suitability vs static historical baseline.</p>
    <label>Thermal suit index <input id="thermal" type="number" min="0" max="1" step="0.01" value="0.72" /></label>
    <label>Population at risk <input id="par" type="number" min="0" max="1" step="0.01" value="0.68" /></label>
    <label>Climate shift signal <input id="shift" type="number" min="0" max="1" step="0.01" value="0.74" /></label>
    <label>Vector niche fidelity <input id="niche" type="number" min="0" max="1" step="0.01" value="0.6" /></label>
    <label>Spatial coverage <input id="spatial" type="number" min="0" max="1" step="0.01" value="0.55" /></label>
    <label>Historical stickiness <input id="hist" type="number" min="0" max="1" step="0.01" value="0.3" /></label>
    <label>Climate bias
      <select id="bias">
        <option value="balanced">balanced</option>
        <option value="ssp585_first">ssp585_first</option>
        <option value="ssp126_first">ssp126_first</option>
        <option value="historical_first">historical_first</option>
      </select>
    </label>
    <button type="button" id="run">Score A/B</button>
    <div class="out" id="out">Run to see soft-sim scores.</div>
    <p class="note">Not live outbreak prediction, not clinical diagnosis, not operational mosquito control deployment.</p>
  </main>
  <script>
    function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
    function round2(n) { return Math.round(n * 100) / 100; }
    function biasWeight(bias, lane) {
      if (bias === "balanced") return 1;
      return bias === lane ? 1.35 : 0.55;
    }
    function scoreCmip6(input) {
      const boost = 1.12;
      const wS = biasWeight(input.climateBias, "ssp585_first");
      const thermalScore = round2(clamp(input.thermalSuitIndex * 55 * boost * wS + input.vectorNicheFidelity * 20 + 8 - input.overclaimRisk * 6, 0, 100));
      const populationScore = round2(clamp(input.populationAtRisk * 55 * boost + input.spatialCoverage * 20, 0, 100));
      const shiftScore = round2(clamp(input.climateShiftSignal * 50 * boost + (1 - input.historicalStickiness) * 20, 0, 100));
      const nicheScore = round2(clamp(input.vectorNicheFidelity * 45 * boost + input.thermalSuitIndex * 20, 0, 100));
      const overall = round2(clamp(thermalScore * 0.35 + populationScore * 0.3 + shiftScore * 0.2 + nicheScore * 0.15, 0, 100));
      return { thermalScore, populationScore, shiftScore, nicheScore, overall };
    }
    function scoreHistorical(input) {
      const boost = 1.08;
      const thermalScore = round2(clamp(input.populationAtRisk * 20 * boost + input.spatialCoverage * 20 - input.thermalSuitIndex * 18, 0, 100));
      const populationScore = round2(clamp(input.populationAtRisk * 42 * boost + (1 - input.climateShiftSignal) * 18, 0, 100));
      const shiftScore = round2(clamp(input.historicalStickiness * 38 * boost + input.assaySignal * 25, 0, 100));
      const nicheScore = round2(clamp(input.vectorNicheFidelity * 50 * boost - input.thermalSuitIndex * 10, 0, 100));
      const overall = round2(clamp(nicheScore * 0.45 + populationScore * 0.3 + shiftScore * 0.25, 0, 100));
      return { thermalScore, populationScore, shiftScore, nicheScore, overall };
    }
    document.getElementById("run").onclick = () => {
      const input = {
        thermalSuitIndex: Number(thermal.value),
        populationAtRisk: Number(par.value),
        climateShiftSignal: Number(shift.value),
        vectorNicheFidelity: Number(niche.value),
        spatialCoverage: Number(spatial.value),
        historicalStickiness: Number(hist.value),
        assaySignal: 0.7,
        overclaimRisk: 0.28,
        climateBias: bias.value,
      };
      const a = scoreCmip6(input);
      const b = scoreHistorical(input);
      out.textContent = "CMIP6 overall " + a.overall + " · Historical overall " + b.overall;
    };
  </script>
</body>
</html>
`,
);

w(
  "README.md",
  `# Dengue Suit Studio

Soft-sim studio for public-health / climate-surveillance analytics leads who need to compare **CMIP6 thermal-suitability** dengue risk maps against **static historical baselines** before locking a surveillance pack.

## Run

\`\`\`bash
cd projects/dengue-suit-studio
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

Not live outbreak prediction. Not clinical diagnosis. Not operational mosquito control deployment. Not the authors' dengue atlas.

Paper: https://www.medrxiv.org/content/10.64898/2026.07.02.26357126v2
`,
);

console.log("bootstrap-finish done");
