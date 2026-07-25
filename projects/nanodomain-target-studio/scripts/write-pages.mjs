/**
 * Write Nanodomain Target Studio pages + CSS + layout + tests.
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
  "src/app/layout.tsx",
  `import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { DISPLAY_NAME, TAGLINE } from "@/claim";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: DISPLAY_NAME,
  description: TAGLINE,
};

export function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={\`\${display.variable} \${sans.variable} antialiased\`}>
        {children}
      </body>
    </html>
  );
}
`,
);

w(
  "src/app/globals.css",
  `@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);
  --font-heading: var(--font-display);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
}

:root {
  --nt-ink: #14161b;
  --nt-crimson: #8b3a45;
  --nt-mist: #f0f1f3;
  --nt-line: #c5c8cd;
  --nt-teal: #2d6368;
  --studio-ink: var(--nt-ink);
  --studio-ink-deep: #0c0e12;
  --studio-accent: var(--nt-teal);
  --studio-accent-deep: #21484c;
  --studio-accent-soft: #d4e2e3;
  --studio-gauze-soft: #e7e8eb;
  --studio-bg: #f0f1f3;
  --studio-panel: #ffffff;
  --studio-line: #c5c8cd;
  --studio-signal: #8b3a45;
  --studio-wash: radial-gradient(ellipse 55% 45% at 10% 0%, #2d636855 0%, transparent 55%),
    radial-gradient(ellipse 40% 35% at 90% 20%, #8b3a4544 0%, transparent 50%),
    linear-gradient(165deg, #0c0e12 0%, #14161b 48%, #1a1d23 100%);

  --background: #f0f1f3;
  --foreground: #14161b;
  --card: #ffffff;
  --card-foreground: #14161b;
  --popover: #ffffff;
  --popover-foreground: #14161b;
  --primary: #2d6368;
  --primary-foreground: #f0f1f3;
  --secondary: #e7e8eb;
  --secondary-foreground: #14161b;
  --muted: #e7e8eb;
  --muted-foreground: #5a5e66;
  --accent: #d4e2e3;
  --accent-foreground: #14161b;
  --destructive: #8b3a45;
  --border: #c5c8cd;
  --input: #c5c8cd;
  --ring: #2d6368;
  --radius: 0.5rem;
}

body {
  background: var(--studio-bg);
  color: var(--studio-ink);
  font-family: var(--font-sans), system-ui, sans-serif;
}

.hero-fade {
  animation: heroIn 0.9s ease-out both;
}

.mist-fade {
  animation: mistDrift 14s ease-in-out infinite alternate;
}

.signal-underline {
  display: block;
  width: 4.5rem;
  height: 3px;
  margin-top: 0.75rem;
  background: var(--nt-crimson);
  animation: underlineGrow 0.8s ease-out 0.25s both;
}

.nanodomain-mist {
  background:
    radial-gradient(circle at 22% 40%, #2d636833 0%, transparent 42%),
    radial-gradient(circle at 70% 55%, #8b3a4530 0%, transparent 38%);
  animation: mistDrift 18s ease-in-out infinite alternate;
}

.schema-grid {
  background-image:
    linear-gradient(to right, #ffffff0a 1px, transparent 1px),
    linear-gradient(to bottom, #ffffff0a 1px, transparent 1px);
  background-size: 48px 48px;
}

.row-lift {
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.row-lift:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px #14161b14;
}

.score-bar {
  transition: width 0.6s ease;
}

@keyframes heroIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes mistDrift {
  from { transform: translate3d(0, 0, 0) scale(1); }
  to { transform: translate3d(-1.5%, 1%, 0) scale(1.03); }
}
@keyframes underlineGrow {
  from { width: 0; opacity: 0; }
  to { width: 4.5rem; opacity: 1; }
}
`,
);

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
        <div aria-hidden className="nanodomain-mist absolute inset-0 opacity-50" />
        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-6 pb-20 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl tracking-tight text-[var(--nt-crimson)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <span className="signal-underline" aria-hidden />
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-3xl text-white md:text-4xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--nt-mist)]">
            Therapy packs for cardio precision design — compare localized
            nanodomain targeting against systemic phosphorylation baselines
            before you lock a pack.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/packs"
              className="rounded-md bg-[var(--nt-crimson)] px-5 py-2.5 text-sm font-medium text-white"
            >
              Open packs
            </Link>
            <Link
              href="/demo"
              className="rounded-md border border-[var(--nt-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              See demo
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border border-[var(--nt-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              Pricing
            </Link>
            <Link
              href="/onboarding"
              className="rounded-md border border-[var(--nt-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              Onboarding
            </Link>
            <Link
              href="/flows"
              className="rounded-md border border-[var(--nt-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              All flows
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          Systemic phosphorylation blurs local troponin nanodomain signals —
          and can trade diastolic gain for systolic loss.
        </h2>
        <p className="mt-3 max-w-2xl text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          {CLAIM}
        </p>
        <div className="mt-10 grid gap-7 md:grid-cols-3">
          <div>
            <h3 className="font-semibold">Therapy packs</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Versioned soft-sim packs for localized nanodomain cardio design.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Nanodomains and peptides</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Make locus localization and PDE pry soft-sim explicit before scoring.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Dual A/B</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Test localized nanodomain targets against systemic phosphorylation baselines.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">
          How it works
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          <li>Create a versioned therapy pack for your nanodomain soft-sim case.</li>
          <li>Configure nanodomains, peptide pry specs, and assay runs.</li>
          <li>Run an assay soft-sim, then compare localized vs systemic.</li>
          <li>Lock only when deltas and honesty are understood.</li>
        </ol>
        <p className="mt-6 text-sm">
          <Link href="/pricing" className="underline text-[var(--nt-teal)]">
            Pricing
          </Link>
          {" · "}
          <Link href="/honesty" className="underline text-[var(--nt-teal)]">
            Honesty
          </Link>
          {" · "}
          <a href={PAPER_URL} className="underline text-[var(--nt-teal)]" target="_blank" rel="noreferrer">
            Source paper
          </a>
        </p>
        <p className="mt-4 max-w-2xl text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
          Soft-sim only — not wet-lab validated IND/NDA, not live patient dosing,
          not clinical heart-failure diagnosis, not the authors&apos; peptide system.
        </p>
      </section>
    </div>
  );
}

export default LandingPage;
`,
);

function crudPage({
  exportName,
  title,
  subtitle,
  apiPath,
  fields,
  createBody,
  listFields,
}) {
  const fieldBlocks = fields
    .map(
      (f) => `          <Label htmlFor="${f.id}">${f.label}</Label>
          <Input
            id="${f.id}"
            value={${f.id}}
            onChange={(e) => set${f.id[0].toUpperCase() + f.id.slice(1)}(e.target.value)}
            ${f.required ? "required" : ""}
          />`,
    )
    .join("\n");
  const stateDecls = fields
    .map(
      (f) =>
        `  const [${f.id}, set${f.id[0].toUpperCase() + f.id.slice(1)}] = useState(${JSON.stringify(f.default ?? "")});`,
    )
    .join("\n");
  return `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  label: string;
  status: string;
  ${listFields.map((f) => `${f}?: string | number;`).join("\n  ")}
};

export function ${exportName}() {
  const [items, setItems] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
${stateDecls}

  const load = async (query = q) => {
    try {
      setItems(
        (await api<{ items: Row[] }>(\`${apiPath}?q=\${encodeURIComponent(query)}\`))
          .items,
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
        body: JSON.stringify(${createBody}),
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
${fieldBlocks}
          <Button>Create</Button>
        </form>
        <section>
          <div className="mb-4 flex gap-2">
            <Input aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} />
            <Button type="button" onClick={() => void load()}>Search</Button>
          </div>
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          <ul className="space-y-3">
            {items.map((row) => (
              <li key={row.id} className="row-lift flex items-center justify-between rounded-lg border bg-white p-4">
                <div>
                  <p className="font-semibold">{row.label}</p>
                  <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                    {row.status}${listFields.map((f) => ` · {String(row.${f} ?? "")}`).join("")}
                  </p>
                </div>
                {row.status !== "archived" ? (
                  <Button type="button" variant="outline" onClick={() => void archive(row.id)}>
                    Archive
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </StudioShell>
  );
}

export default ${exportName};
`;
}

w(
  "src/app/packs/page.tsx",
  crudPage({
    exportName: "PacksPage",
    title: "Therapy packs",
    subtitle:
      "Version the localized nanodomain cardio context before comparing against systemic phosphorylation baselines.",
    apiPath: "/api/packs",
    fields: [
      { id: "label", label: "Label", required: true },
      { id: "version", label: "Version", required: true, default: "1.0" },
      { id: "therapyFocus", label: "Therapy focus", required: true },
    ],
    createBody: "{ label, version, therapyFocus }",
    listFields: ["version", "therapyFocus"],
  }),
);

w(
  "src/app/nanodomains/page.tsx",
  crudPage({
    exportName: "NanodomainsPage",
    title: "Nanodomains",
    subtitle:
      "Configure cAMP/PKA locus localization and diastolic floors for soft-sim.",
    apiPath: "/api/nanodomains",
    fields: [
      { id: "label", label: "Label", required: true },
      { id: "kind", label: "Kind", required: true, default: "camp_pka_local" },
      { id: "locusHint", label: "Locus hint", required: true },
      {
        id: "localizationFloor",
        label: "Localization floor",
        required: true,
        default: "0.45",
      },
      {
        id: "diastolicFloor",
        label: "Diastolic floor",
        required: true,
        default: "0.4",
      },
    ],
    createBody:
      "{ label, kind, locusHint, localizationFloor: Number(localizationFloor), diastolicFloor: Number(diastolicFloor) }",
    listFields: ["kind", "locusHint"],
  }),
);

w(
  "src/app/peptides/page.tsx",
  crudPage({
    exportName: "PeptidesPage",
    title: "Peptides",
    subtitle:
      "Configure PDE pry strength and systolic preservation floors for soft-sim.",
    apiPath: "/api/peptides",
    fields: [
      { id: "label", label: "Label", required: true },
      { id: "kind", label: "Kind", required: true, default: "pde_pry" },
      { id: "pryHint", label: "Pry hint", required: true },
      { id: "pryFloor", label: "Pry floor", required: true, default: "0.4" },
      {
        id: "systolicFloor",
        label: "Systolic floor",
        required: true,
        default: "0.5",
      },
    ],
    createBody:
      "{ label, kind, pryHint, pryFloor: Number(pryFloor), systolicFloor: Number(systolicFloor) }",
    listFields: ["kind", "pryHint"],
  }),
);

w(
  "src/app/assays/page.tsx",
  `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  label: string;
  kind: string;
  nanodomainLocalization: number;
  pdePryStrength: number;
  assaySignal: number;
};

export function AssaysPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("diastolic_restore");
  const [nanodomainLocalization, setNanodomainLocalization] = useState("0.7");
  const [pdePryStrength, setPdePryStrength] = useState("0.65");
  const [assaySignal, setAssaySignal] = useState("0.7");

  const load = async () => {
    try {
      setItems((await api<{ items: Row[] }>("/api/assays")).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/assays", {
        method: "POST",
        body: JSON.stringify({
          label,
          kind,
          nanodomainLocalization: Number(nanodomainLocalization),
          pdePryStrength: Number(pdePryStrength),
          assaySignal: Number(assaySignal),
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Assay runs"
      subtitle="Soft-sim diastolic restore, systolic preserve, and phosphorylation map assays."
    >
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Kind</Label>
          <Input id="kind" value={kind} onChange={(e) => setKind(e.target.value)} required />
          <Label htmlFor="loc">Localization</Label>
          <Input id="loc" value={nanodomainLocalization} onChange={(e) => setNanodomainLocalization(e.target.value)} />
          <Label htmlFor="pry">PDE pry</Label>
          <Input id="pry" value={pdePryStrength} onChange={(e) => setPdePryStrength(e.target.value)} />
          <Label htmlFor="sig">Assay signal</Label>
          <Input id="sig" value={assaySignal} onChange={(e) => setAssaySignal(e.target.value)} />
          <Button>Create assay</Button>
        </form>
        <section>
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          <ul className="space-y-3">
            {items.map((row) => (
              <li key={row.id} className="row-lift rounded-lg border bg-white p-4">
                <p className="font-semibold">{row.label}</p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                  {row.kind} · loc {row.nanodomainLocalization} · pry {row.pdePryStrength} · signal {row.assaySignal}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </StudioShell>
  );
}

export default AssaysPage;
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

type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  localized: { overall: number };
  systemic: { overall: number };
};

export function ComparePage() {
  const [items, setItems] = useState<Compare[]>([]);
  const [name, setName] = useState("Seed nanodomain compare");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      setItems((await api<{ items: Compare[] }>("/api/compare")).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Compare failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <StudioShell
      title="A/B compare"
      subtitle="Localized nanodomain target (A) vs systemic phosphorylation baseline (B)."
    >
      <form
        onSubmit={run}
        className="mb-8 flex flex-wrap items-end gap-3 rounded-lg border bg-white p-4"
      >
        <div>
          <Label htmlFor="name">Compare name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <Button disabled={busy}>{busy ? "Running…" : "Run compare"}</Button>
      </form>
      {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((c) => (
          <li key={c.id} className="row-lift rounded-lg border bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                  winner {c.winner} · gap {c.gap}
                </p>
              </div>
              <div className="text-sm">
                <span className="mr-4">A localized {c.localized.overall}</span>
                <span>B systemic {c.systemic.overall}</span>
              </div>
            </div>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <div className="h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
                <div
                  className="score-bar h-full bg-[var(--nt-teal)]"
                  style={{ width: \`\${c.localized.overall}%\` }}
                />
              </div>
              <div className="h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
                <div
                  className="score-bar h-full bg-[var(--nt-crimson)]"
                  style={{ width: \`\${c.systemic.overall}%\` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default ComparePage;
`,
);

console.log("core pages written");
