/**
 * Write pages + API routes for Citizen Pref Studio.
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
            Policy packs for AI governance — compare safety-first public oversight
            against innovation-first self-regulation before you lock a pack.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/packs" className="rounded-md bg-[var(--cp-amber)] px-5 py-2.5 text-sm font-medium text-[var(--cp-ink)]">Open packs</Link>
            <Link href="/demo" className="rounded-md border border-[var(--st-line)]/50 px-5 py-2.5 text-sm text-white">See demo</Link>
            <Link href="/pricing" className="rounded-md border border-[var(--st-line)]/50 px-5 py-2.5 text-sm text-white">Pricing</Link>
            <Link href="/onboarding" className="rounded-md border border-[var(--st-line)]/50 px-5 py-2.5 text-sm text-white">Onboarding</Link>
            <Link href="/flows" className="rounded-md border border-[var(--st-line)]/50 px-5 py-2.5 text-sm text-white">All flows</Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl">Innovation alone cannot hold a policy pack.</h2>
        <p className="mt-3 max-w-2xl text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">{CLAIM}</p>
        <div className="mt-10 grid gap-7 md:grid-cols-3">
          <div><h3 className="font-semibold">Policy packs</h3><p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">Versioned soft-sim packs for safety-first citizen-aligned AI regulation.</p></div>
          <div><h3 className="font-semibold">Options and countries</h3><p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">Make public oversight and country cohorts explicit before scoring.</p></div>
          <div><h3 className="font-semibold">Dual A/B</h3><p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">Test safety-first public oversight against innovation-first self-regulation.</p></div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">How it works</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          <li>Create a versioned policy pack for your soft-sim case.</li>
          <li>Configure regulatory options, country cohorts, and surveys.</li>
          <li>Run a preference soft-sim, then compare A vs B.</li>
          <li>Lock only when deltas and honesty are understood.</li>
        </ol>
        <p className="mt-6 text-sm"><Link href="/pricing" className="underline text-[var(--st-teal)]">See method-lab pricing tiers</Link></p>
      </section>
      <footer className="border-t border-[var(--studio-line)] px-6 py-10 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        <p>Soft-sim only — not live regulatory authority, not government deployment, not certified public-opinion polling, not the authors&apos; survey brand.</p>
        <p className="mt-2">Sources: <a className="underline" href={PAPER_URL}>arXiv 2607.14585</a> · authors&apos; code: none published</p>
      </footer>
    </div>
  );
}

export default LandingPage;
`,
);

w(
  "src/app/pricing/page.tsx",
  `import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  { name: "Starter", price: "$0", blurb: "One policy pack soft-sim, dual scorers, honesty fence.", items: ["3 packs", "Goldens sample", "Export JSON"] },
  { name: "Team", price: "$480/mo", blurb: "Country cohorts, survey batches, webhook HMAC, audit.", items: ["Unlimited compares", "Members + org", "CSV export"] },
  { name: "Lab", price: "Custom", blurb: "Method-lab soft-sim for AI policy governance teams.", items: ["Scoreboard seats", "Rate-limit controls", "Onboarding guide"] },
] as const;

export function PricingPage() {
  return (
    <StudioShell title="Pricing" subtitle="Method-lab soft-sim tiers for citizen-aligned AI policy packs — not live regulatory authority.">
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <article key={t.name} className="row-lift rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">{t.name}</h2>
            <p className="mt-1 text-3xl text-[var(--cp-teal)]">{t.price}</p>
            <p className="mt-3 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">{t.blurb}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
              {t.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className="mt-8 text-sm">
        Soft-sim method-lab pricing only. <Link href="/honesty" className="underline text-[var(--cp-teal)]">Read honesty</Link>
      </p>
    </StudioShell>
  );
}

export default PricingPage;
`,
);

w(
  "src/app/honesty/page.tsx",
  `import { StudioShell } from "@/components/studio-shell";
import { PAPER_URL } from "@/claim";

export function HonestyPage() {
  return (
    <StudioShell title="Honesty fence" subtitle="What this soft-sim is — and is not.">
      <ul className="space-y-3 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <li>Not live regulatory authority or binding policy decisions.</li>
        <li>Not government deployment or production governance systems.</li>
        <li>Not certified public-opinion polling or survey fieldwork.</li>
        <li>Not the authors&apos; survey brand or a rebrand of their instrument.</li>
        <li>Method-lab soft-sim for comparing safety-first public-oversight packs vs innovation-first self-regulation baselines.</li>
      </ul>
      <p className="mt-6 text-sm">
        Paper: <a className="underline text-[var(--cp-teal)]" href={PAPER_URL}>arXiv 2607.14585</a> · authors&apos; code: none
      </p>
    </StudioShell>
  );
}

export default HonestyPage;
`,
);

w(
  "src/app/flows/page.tsx",
  `import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const NAMED_FLOWS = [
  { id: "create-policy-pack", name: "Create policy pack", actor: "AI policy eng", job: "Version a soft-sim policy pack before options and countries enroll.", steps: ["/packs", "/options", "/countries"], success: "Active pack with study focus and session budget.", emptyError: "Create fails without label/version/study focus.", href: "/packs" },
  { id: "configure-options", name: "Configure regulatory options", actor: "Governance lead", job: "Register regulatory options with safety floors and oversight hints.", steps: ["/options", "/packs", "/surveys"], success: "Active option linked to a pack with attribute count.", emptyError: "Option create fails when pack id is missing.", href: "/options" },
  { id: "configure-country", name: "Configure country cohort", actor: "Preference analyst", job: "Register multi-country cohorts with preference min/max bounds.", steps: ["/countries", "/packs", "/prefs"], success: "Active country cohort with strata count.", emptyError: "Country create fails without pack id/label.", href: "/countries" },
  { id: "run-ab-compare", name: "Run A/B compare", actor: "Product governance eng", job: "Compare safety_first_public_oversight vs innovation_first_self_regulation.", steps: ["/prefs", "/surveys", "/compare", "/scoreboard"], success: "Compare row with winner, gap, and dual scores.", emptyError: "Compare fails when pack/option/country/survey/run ids mismatch.", href: "/compare" },
  { id: "export-webhook", name: "Export + webhook", actor: "Org owner", job: "Export pack JSON/CSV and verify HMAC webhook ingest.", steps: ["/settings", "/scoreboard", "/honesty"], success: "Export payload downloaded; webhook ack with idempotency.", emptyError: "Webhook rejects bad HMAC signature.", href: "/settings" },
] as const;

export function FlowsPage() {
  return (
    <StudioShell title="User flows" subtitle="Five sophisticated journeys for citizen preference / regulatory option soft-sim — not a single happy path.">
      <div className="space-y-5">
        {NAMED_FLOWS.map((flow) => (
          <article key={flow.id} className="row-lift rounded-lg border bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-xl">{flow.name}</h2>
                <p className="mt-1 text-sm"><span className="font-medium">Actor:</span> {flow.actor}</p>
                <p className="text-sm"><span className="font-medium">Job:</span> {flow.job}</p>
                <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">Steps: {flow.steps.join(" → ")}</p>
                <p className="text-sm text-[var(--cp-teal)]">Success: {flow.success}</p>
                <p className="text-sm text-[var(--cp-amber)]">Empty/error: {flow.emptyError}</p>
              </div>
              <Link href={flow.href} className="rounded-md bg-[var(--cp-teal)] px-3 py-2 text-sm text-white">Enter flow</Link>
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

function crudPage({ route, title, subtitle, apiPath, fields, listLabel, createLabel, seedHint }) {
  const stateDecls = fields
    .map((f) => `  const [${f.state}, set${f.state[0].toUpperCase()}${f.state.slice(1)}] = useState(${JSON.stringify(f.initial)});`)
    .join("\n");
  const formFields = fields
    .map(
      (f) => `          <Label htmlFor="${f.state}">${f.label}</Label>
          <Input
            id="${f.state}"
            value={${f.state}}
            onChange={(e) => set${f.state[0].toUpperCase()}${f.state.slice(1)}(${f.numeric ? "Number(e.target.value)" : "e.target.value"})}
            required
          />`,
    )
    .join("\n");
  const bodyFields = fields.map((f) => f.state).join(", ");
  return `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = { id: string; label: string; status: string; [k: string]: string | number };

export function ${route}Page() {
  const [items, setItems] = useState<Row[]>([]);
  const [q, setQ] = useState("");
${stateDecls}
  const [error, setError] = useState("");

  const load = async (query = q) => {
    try {
      setItems(
        (
          await api<{ items: Row[] }>(
            \`${apiPath}?q=\${encodeURIComponent(query)}\`,
          )
        ).items,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  };

  useEffect(() => {
    void load("");
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("${apiPath}", {
        method: "POST",
        body: JSON.stringify({ ${bodyFields} }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  const archive = async (id: string) => {
    await api("${apiPath}", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  };

  return (
    <StudioShell title="${title}" subtitle="${subtitle}">
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
${formFields}
          <Button>${createLabel}</Button>
          <p className="text-xs text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">${seedHint}</p>
        </form>
        <section>
          <div className="mb-4 flex gap-2">
            <Input aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} />
            <Button type="button" onClick={() => void load()}>Search</Button>
          </div>
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          <ul className="space-y-3">
            {items.map((row) => (
              <li key={row.id} className="row-lift flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white p-4">
                <div>
                  <p className="font-semibold">{row.label}</p>
                  <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">{listLabel} · {row.status}</p>
                </div>
                <Button type="button" variant="outline" onClick={() => void archive(row.id)}>Archive</Button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </StudioShell>
  );
}

export default ${route}Page;
`;
}

w(
  "src/app/packs/page.tsx",
  crudPage({
    route: "Packs",
    title: "Policy packs",
    subtitle: "Version the policy context before comparing safety-first vs innovation-first methods.",
    apiPath: "/api/packs",
    fields: [
      { state: "label", label: "Label", initial: "" },
      { state: "version", label: "Version", initial: "1.0" },
      { state: "studyFocus", label: "Study focus", initial: "" },
    ],
    listLabel: "Policy pack",
    createLabel: "Create pack",
    seedHint: "Seed pack-demo ships for compare demos.",
  }),
);

w(
  "src/app/options/page.tsx",
  crudPage({
    route: "Options",
    title: "Regulatory options",
    subtitle: "Configure conjoint-style regulatory options with safety floors.",
    apiPath: "/api/options",
    fields: [
      { state: "packId", label: "Pack id", initial: "pack-demo" },
      { state: "label", label: "Label", initial: "" },
      { state: "kind", label: "Kind", initial: "public_oversight" },
      { state: "oversightHint", label: "Oversight hint", initial: "agency_review" },
      { state: "attributeCount", label: "Attributes", initial: 5, numeric: true },
      { state: "safetyFloor", label: "Safety floor", initial: 0.4, numeric: true },
    ],
    listLabel: "Option",
    createLabel: "Create option",
    seedHint: "Use pack-demo or a pack id from /packs.",
  }),
);

w(
  "src/app/countries/page.tsx",
  crudPage({
    route: "Countries",
    title: "Country cohorts",
    subtitle: "Multi-country preference cohorts with soft-sim preference bounds.",
    apiPath: "/api/countries",
    fields: [
      { state: "packId", label: "Pack id", initial: "pack-demo" },
      { state: "label", label: "Label", initial: "" },
      { state: "region", label: "Region", initial: "multi_country" },
      { state: "countryHint", label: "Country hint", initial: "seven_country" },
      { state: "strataCount", label: "Strata", initial: 7, numeric: true },
      { state: "prefMin", label: "Pref min", initial: 0.4, numeric: true },
      { state: "prefMax", label: "Pref max", initial: 0.9, numeric: true },
    ],
    listLabel: "Country cohort",
    createLabel: "Create country",
    seedHint: "Soft-sim only — not certified polling.",
  }),
);

w(
  "src/app/surveys/page.tsx",
  crudPage({
    route: "Surveys",
    title: "Survey batches",
    subtitle: "Conjoint / ranking soft-sim instruments — not certified fieldwork.",
    apiPath: "/api/surveys",
    fields: [
      { state: "packId", label: "Pack id", initial: "pack-demo" },
      { state: "label", label: "Label", initial: "" },
      { state: "mode", label: "Mode", initial: "conjoint" },
      { state: "instrumentHint", label: "Instrument hint", initial: "conjoint,safety_vs_innovation" },
      { state: "itemCount", label: "Items", initial: 12, numeric: true },
      { state: "responseFloor", label: "Response floor", initial: 0.35, numeric: true },
    ],
    listLabel: "Survey",
    createLabel: "Create survey",
    seedHint: "Not the authors’ survey brand.",
  }),
);

console.log("pages batch 1 done");
