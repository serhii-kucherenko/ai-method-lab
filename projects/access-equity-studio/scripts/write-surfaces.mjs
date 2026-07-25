/**
 * Writes remaining Access Equity Studio pages + API routes.
 * Run: node scripts/write-surfaces.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const w = (rel, content) => {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
};

w(
  "src/app/page.tsx",
  `import Link from "next/link";
import { CLAIM, DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-ink)]">
      <section className="hero-fade relative min-h-screen overflow-hidden">
        <div aria-hidden className="mist-fade absolute inset-0 bg-[var(--studio-wash)]" />
        <div aria-hidden className="schema-grid absolute inset-0 opacity-60" />
        <div aria-hidden className="wave-mist absolute inset-0 opacity-40" />
        <div aria-hidden className="infra-mist absolute inset-0" />
        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-6 pb-20 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl tracking-tight text-[var(--st-amber)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <span className="signal-underline" aria-hidden />
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-3xl text-white md:text-4xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--st-mist)]">
            Pathway packs for autism digital screening — compare equity-access
            designs against accuracy-only baselines before you lock a pack.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/packs" className="rounded-md bg-[var(--ae-amber)] px-5 py-2.5 text-sm font-medium text-[var(--ae-ink)]">Open packs</Link>
            <Link href="/demo" className="rounded-md border border-[var(--st-line)]/50 px-5 py-2.5 text-sm text-white">See demo</Link>
            <Link href="/pricing" className="rounded-md border border-[var(--st-line)]/50 px-5 py-2.5 text-sm text-white">Pricing</Link>
            <Link href="/onboarding" className="rounded-md border border-[var(--st-line)]/50 px-5 py-2.5 text-sm text-white">Onboarding</Link>
            <Link href="/flows" className="rounded-md border border-[var(--st-line)]/50 px-5 py-2.5 text-sm text-white">All flows</Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl">Classification alone cannot hold a pathway pack.</h2>
        <p className="mt-3 max-w-2xl text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">{CLAIM}</p>
        <div className="mt-10 grid gap-7 md:grid-cols-3">
          <div><h3 className="font-semibold">Pathway packs</h3><p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">Versioned soft-sim packs for equity-access autism screening pathways.</p></div>
          <div><h3 className="font-semibold">Screens and equity gates</h3><p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">Make task-sharing and access reach explicit before scoring.</p></div>
          <div><h3 className="font-semibold">Dual A/B</h3><p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">Test equity-access task-sharing against an accuracy-only classifier.</p></div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">How it works</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          <li>Create a versioned pathway pack for your soft-sim case.</li>
          <li>Configure cohorts, pathways, screens, and equity gates.</li>
          <li>Run an access soft-sim, then compare A vs B.</li>
          <li>Lock only when deltas and honesty are understood.</li>
        </ol>
        <p className="mt-6 text-sm"><Link href="/pricing" className="underline text-[var(--st-teal)]">See method-lab pricing tiers</Link></p>
      </section>
      <footer className="border-t border-[var(--studio-line)] px-6 py-10 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        <p>Soft-sim only — not clinical diagnostic use, not live EHR write-back, not FDA clearance, not an autism diagnosis product, not the authors&apos; review brand.</p>
        <p className="mt-2">Sources: <a className="underline" href={PAPER_URL}>Frontiers DOI 10.3389/fpubh.2026.1898818</a> · authors&apos; code: none published</p>
      </footer>
    </div>
  );
}

export default LandingPage;
`,
);

w(
  "src/app/flows/page.tsx",
  `import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const NAMED_FLOWS = [
  { id: "create-pathway-pack", name: "Create pathway pack", actor: "Screening product eng", job: "Version a soft-sim pathway pack before cohorts enroll strata.", steps: ["/packs", "/pathways", "/cohorts"], success: "Active pack with study focus and session budget.", emptyError: "Create fails without label/version/study focus.", href: "/packs" },
  { id: "configure-cohort", name: "Configure cohort", actor: "Program lead", job: "Register multi-strata cohorts with access min/max bounds.", steps: ["/cohorts", "/packs", "/screens"], success: "Active cohort linked to a pack with strata count.", emptyError: "Cohort create fails when pack id is missing.", href: "/cohorts" },
  { id: "configure-equity-gate", name: "Configure equity gate", actor: "Equity analyst", job: "Lock equity gates and screen recipes for access soft-sim.", steps: ["/equity", "/screens", "/pathways"], success: "Open equity gate with lock condition and channel.", emptyError: "Equity gate create fails without label/lock condition.", href: "/equity" },
  { id: "run-ab-compare", name: "Run A/B compare", actor: "Digital screening eng", job: "Compare equity_access_task_sharing vs accuracy_only_classifier.", steps: ["/equity", "/screens", "/compare", "/scoreboard"], success: "Compare row with winner, gap, and dual scores.", emptyError: "Compare fails when equity/cohort/screen/pathway/run ids mismatch.", href: "/compare" },
  { id: "export-webhook", name: "Export + webhook", actor: "Org owner", job: "Export pack JSON/CSV and verify HMAC webhook ingest.", steps: ["/settings", "/scoreboard", "/honesty"], success: "Export payload downloaded; webhook ack with idempotency.", emptyError: "Webhook rejects bad HMAC signature.", href: "/settings" },
] as const;

export function FlowsPage() {
  return (
    <StudioShell title="User flows" subtitle="Five sophisticated journeys for equity-access autism screening soft-sim — not a single happy path.">
      <div className="space-y-5">
        {NAMED_FLOWS.map((flow) => (
          <article key={flow.id} className="row-lift rounded-lg border bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-xl">{flow.name}</h2>
                <p className="mt-1 text-sm"><span className="font-medium">Actor:</span> {flow.actor}</p>
                <p className="text-sm"><span className="font-medium">Job:</span> {flow.job}</p>
                <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">Steps: {flow.steps.join(" → ")}</p>
                <p className="text-sm text-[var(--ae-teal)]">Success: {flow.success}</p>
                <p className="text-sm text-[var(--ae-amber)]">Empty/error: {flow.emptyError}</p>
              </div>
              <Link href={flow.href} className="rounded-md bg-[var(--ae-teal)] px-3 py-2 text-sm text-white">Enter flow</Link>
            </div>
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
import { StudioShell } from "@/components/studio-shell";
import { PAPER_URL } from "@/claim";

export function HonestyPage() {
  return (
    <StudioShell title="Honesty fence" subtitle="Soft-sim boundaries for Access Equity Studio.">
      <div className="max-w-2xl space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_70%,transparent)]">
        <p>This product is a <strong>soft-sim</strong> method-lab bench. It does not diagnose autism, write back to live EHR systems, claim FDA clearance, or replace clinical diagnostic pathways.</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not clinical diagnostic use</li>
          <li>Not live EHR write-back</li>
          <li>Not FDA clearance</li>
          <li>Not an autism diagnosis product</li>
          <li>Not the authors&apos; review brand</li>
        </ul>
        <p>Dual scorers compare <code>equity_access_task_sharing</code> against <code>accuracy_only_classifier</code> for autism digital screening decision support in simulation only.</p>
        <p className="text-sm">Paper: <a className="underline text-[var(--ae-teal)]" href={PAPER_URL}>Frontiers DOI 10.3389/fpubh.2026.1898818</a> · authors&apos; code: none · <Link href="/" className="underline text-[var(--ae-teal)]">Back home</Link></p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
`,
);

w(
  "src/app/pricing/page.tsx",
  `import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  { name: "Starter", price: "$0 method-lab", blurb: "One pathway pack, dual A/B compare, honesty fence.", includes: ["1 pack", "Cohorts + screens", "Compare + scoreboard"] },
  { name: "Team", price: "$490 / soft-sim seat", blurb: "Autism screening pathway ops with export and webhooks.", includes: ["Unlimited packs (soft-sim)", "Member invite", "HMAC webhook + CSV/JSON export", "Audit trail"] },
  { name: "Study license", price: "Talk to lab", blurb: "Hypothetical multi-cohort license packaging — not live checkout.", includes: ["Org settings + rate limits", "Guided onboarding", "Goldens sample API"] },
] as const;

export function PricingPage() {
  return (
    <StudioShell title="Pricing" subtitle="Hypothetical method-lab tiers for equity-access autism screening soft-sim — not a live checkout.">
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => (
          <article key={tier.name} className="rounded-lg border border-[var(--studio-line)] bg-white p-6">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">{tier.name}</h2>
            <p className="mt-2 text-lg text-[var(--ae-teal)]">{tier.price}</p>
            <p className="mt-3 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">{tier.blurb}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">{tier.includes.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        ))}
      </div>
      <p className="mt-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
        Soft-sim packaging only. Not clinical diagnostic, not EHR write-back, not FDA cleared.{" "}
        <Link href="/honesty" className="underline text-[var(--ae-teal)]">Read honesty</Link>.
      </p>
    </StudioShell>
  );
}

export default PricingPage;
`,
);

w(
  "src/app/onboarding/page.tsx",
  `"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const CHECKS = [
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
  { id: "packs", label: "Create or open a pathway pack", href: "/packs" },
  { id: "cohorts", label: "Configure at least one cohort", href: "/cohorts" },
  { id: "screens", label: "Configure a screen recipe", href: "/screens" },
  { id: "equity", label: "Open an equity gate", href: "/equity" },
  { id: "compare", label: "Run a dual A/B compare", href: "/compare" },
  { id: "settings", label: "Review org, members, webhook", href: "/settings" },
] as const;

export function OnboardingPage() {
  const [done, setDone] = useState({});
  const progress = useMemo(() => {
    const n = CHECKS.filter((c) => done[c.id]).length;
    return Math.round((n / CHECKS.length) * 100);
  }, [done]);

  return (
    <StudioShell title="Onboarding" subtitle="Checklist with visible progress for first-run equity-access setup.">
      <div className="mb-6">
        <p className="text-sm font-medium">Progress {progress}%</p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--studio-gauze-soft)]">
          <div className="score-bar h-full bg-[var(--ae-teal)]" style={{ width: \`\${progress}%\` }} />
        </div>
      </div>
      <ul className="space-y-3">
        {CHECKS.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3 rounded-lg border bg-white p-4">
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" checked={!!done[item.id]} onChange={(e) => setDone((prev) => ({ ...prev, [item.id]: e.target.checked }))} />
              {item.label}
            </label>
            <Link href={item.href} className="text-sm underline text-[var(--ae-teal)]">Open</Link>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default OnboardingPage;
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
  { title: "Open a seeded pathway pack", body: "Access Equity ships a demo pack for autism equity-access soft-sim." },
  { title: "Confirm cohort, pathway, and screens", body: "Cohorts carry strata access; screens encode task-sharing recipes." },
  { title: "Run dual A/B compare", body: "Score equity_access_task_sharing against accuracy_only_classifier." },
  { title: "Read the delta", body: "Winner and gap land on the scoreboard before any soft-sim lock." },
] as const;

export function DemoPage() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const runCompare = async () => {
    try {
      setError("");
      const payload = await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Guided demo compare",
          equityGateId: "equity-demo",
          cohortId: "cohort-demo",
          screenId: "screen-demo",
          pathwayId: "pathway-demo",
          accessRunId: "run-demo",
        }),
      });
      setResult(\`Winner: \${payload.compare.winner} · gap \${payload.compare.gap}\`);
      setStep(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compare failed");
    }
  };

  return (
    <StudioShell title="Guided demo" subtitle="Walk the core happy path: pack → cohort/screens → dual compare.">
      <ol className="space-y-4">
        {STEPS.map((s, i) => (
          <li key={s.title} className={\`rounded-lg border bg-white p-4 \${i === step ? "border-[var(--ae-teal)]" : ""}\`}>
            <p className="text-xs uppercase tracking-wide text-[var(--ae-teal)]">Step {i + 1}</p>
            <h2 className="mt-1 font-semibold">{s.title}</h2>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">{s.body}</p>
          </li>
        ))}
      </ol>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>Back</Button>
        <Button type="button" disabled={step >= STEPS.length - 1} onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>Next</Button>
        <Button type="button" onClick={() => void runCompare()}>Run compare</Button>
        <Link href="/compare" className="self-center text-sm underline">Open compare</Link>
      </div>
      {result ? <p className="mt-4 text-[var(--ae-teal)]">{result}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
    </StudioShell>
  );
}

export default DemoPage;
`,
);

w(
  "src/app/packs/page.tsx",
  `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

export function PacksPage() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [label, setLabel] = useState("");
  const [version, setVersion] = useState("1.0");
  const [studyFocus, setFocus] = useState("");
  const [error, setError] = useState("");

  const load = async (query = q) => {
    try {
      setItems((await api(\`/api/packs?q=\${encodeURIComponent(query)}\`)).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load packs");
    }
  };

  useEffect(() => { void load(""); }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      await api("/api/packs", { method: "POST", body: JSON.stringify({ label, version, studyFocus }) });
      setLabel(""); setFocus(""); await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create pack");
    }
  };

  const archive = async (id) => {
    await api("/api/packs", { method: "POST", body: JSON.stringify({ action: "archive", id }) });
    await load();
  };

  return (
    <StudioShell title="Pathway packs" subtitle="Version the pathway context before comparing equity-access vs accuracy-only methods.">
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="version">Version</Label>
          <Input id="version" value={version} onChange={(e) => setVersion(e.target.value)} required />
          <Label htmlFor="focus">Study focus</Label>
          <Input id="focus" value={studyFocus} onChange={(e) => setFocus(e.target.value)} required />
          <Button>Create pack</Button>
        </form>
        <section>
          <div className="mb-4 flex gap-2">
            <Input aria-label="Search packs" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search packs" />
            <Button type="button" variant="outline" onClick={() => void load()}>Search</Button>
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <div className="space-y-3">
            {items.map((pack) => (
              <article key={pack.id} className="row-lift rounded-lg border bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">{pack.label}</h2>
                    <p className="text-sm text-slate-600">v{pack.version} · {pack.studyFocus} · {pack.status}</p>
                  </div>
                  {pack.status !== "archived" ? (
                    <Button type="button" variant="outline" size="sm" onClick={() => void archive(pack.id)}>Archive</Button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </StudioShell>
  );
}

export default PacksPage;
`,
);

w(
  "src/app/compare/page.tsx",
  `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

export function ComparePage() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("Pack lock compare");
  const [error, setError] = useState("");

  const load = async () => {
    try { setItems((await api("/api/compare")).items); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not load compares"); }
  };

  useEffect(() => { void load(); }, []);

  const run = async (e) => {
    e.preventDefault();
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name,
          equityGateId: "equity-demo",
          cohortId: "cohort-demo",
          screenId: "screen-demo",
          pathwayId: "pathway-demo",
          accessRunId: "run-demo",
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Compare failed");
    }
  };

  return (
    <StudioShell title="Dual compare" subtitle="equity_access_task_sharing vs accuracy_only_classifier">
      <form onSubmit={run} className="mb-8 max-w-md space-y-3 rounded-lg border bg-white p-4">
        <Label htmlFor="name">Compare name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        <Button>Run A/B compare</Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="space-y-3">
        {items.map((c) => (
          <article key={c.id} className="row-lift rounded-lg border bg-white p-4">
            <h2 className="font-semibold">{c.name}</h2>
            <p className="text-sm">Winner <span className="text-[var(--ae-teal)]">{c.winner}</span> · gap {c.gap}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase">Equity-access</p>
                <div className="mt-1 h-2 rounded-full bg-[var(--studio-gauze-soft)]">
                  <div className="score-bar h-full rounded-full bg-[var(--ae-teal)]" style={{ width: \`\${c.equityAccess.overall}%\` }} />
                </div>
                <p className="mt-1 text-sm">{c.equityAccess.overall}</p>
              </div>
              <div>
                <p className="text-xs uppercase">Accuracy-only</p>
                <div className="mt-1 h-2 rounded-full bg-[var(--studio-gauze-soft)]">
                  <div className="score-bar h-full rounded-full bg-[var(--ae-amber)]" style={{ width: \`\${c.accuracyOnly.overall}%\` }} />
                </div>
                <p className="mt-1 text-sm">{c.accuracyOnly.overall}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}

export default ComparePage;
`,
);

console.log("core pages written");
