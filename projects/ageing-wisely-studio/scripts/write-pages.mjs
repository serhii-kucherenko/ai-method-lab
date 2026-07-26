/**
 * Write Ageing Wisely Studio pages + remaining assets.
 * Run: node scripts/write-pages.mjs
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
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    <html lang="en" className={\`\${display.variable} \${sans.variable} h-full\`}>
      <body className="min-h-full font-[family-name:var(--font-sans)] antialiased">
        {children}
      </body>
    </html>
  );
}

export default RootLayout;
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
  --aw-ink: #16181c;
  --aw-sage: #3d6a5e;
  --aw-mist: #eef2f1;
  --aw-line: #c5cac7;
  --aw-amber: #a87d3c;
  --studio-ink: var(--aw-ink);
  --studio-ink-deep: #0c0e10;
  --studio-accent: var(--aw-sage);
  --studio-accent-deep: #2d5248;
  --studio-accent-soft: #d5e3de;
  --studio-gauze-soft: #e4ebe8;
  --studio-bg: #eef2f1;
  --studio-panel: #ffffff;
  --studio-line: #c5cac7;
  --studio-signal: #a87d3c;
  --studio-wash: radial-gradient(ellipse 55% 45% at 10% 0%, #3d6a5e55 0%, transparent 55%),
    radial-gradient(ellipse 40% 35% at 90% 20%, #a87d3c44 0%, transparent 50%),
    linear-gradient(165deg, #0c0e10 0%, #16181c 48%, #1c2421 100%);

  --background: #eef2f1;
  --foreground: #16181c;
  --card: #ffffff;
  --card-foreground: #16181c;
  --popover: #ffffff;
  --popover-foreground: #16181c;
  --primary: #3d6a5e;
  --primary-foreground: #eef2f1;
  --secondary: #e4ebe8;
  --secondary-foreground: #16181c;
  --muted: #e4ebe8;
  --muted-foreground: #5a6560;
  --accent: #d5e3de;
  --accent-foreground: #16181c;
  --destructive: #8b3a45;
  --border: #c5cac7;
  --input: #c5cac7;
  --ring: #3d6a5e;
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
  background: var(--aw-amber);
  animation: underlineGrow 0.8s ease-out 0.25s both;
}

.session-mist {
  background:
    radial-gradient(circle at 22% 40%, #3d6a5e33 0%, transparent 42%),
    radial-gradient(circle at 70% 55%, #a87d3c30 0%, transparent 38%);
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
  box-shadow: 0 8px 24px #16181c14;
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
        <div aria-hidden className="session-mist absolute inset-0 opacity-50" />
        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-6 pb-20 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl tracking-tight text-[var(--aw-amber)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <span className="signal-underline" aria-hidden />
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-3xl text-white md:text-4xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--aw-mist)]">
            Care packs for older-adult digital mental health — compare
            therapist-supported iCBT against waitlist or self-guided baselines
            before you lock a pack.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/packs"
              className="rounded-md bg-[var(--aw-amber)] px-5 py-2.5 text-sm font-medium text-white"
            >
              Open packs
            </Link>
            <Link
              href="/demo"
              className="rounded-md border border-[var(--aw-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              See demo
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border border-[var(--aw-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              Pricing
            </Link>
            <Link
              href="/onboarding"
              className="rounded-md border border-[var(--aw-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              Onboarding
            </Link>
            <Link
              href="/flows"
              className="rounded-md border border-[var(--aw-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              All flows
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          Waitlist and self-guided paths under-serve older adults —
          therapist-supported iCBT makes the session explicit.
        </h2>
        <p className="mt-3 max-w-2xl text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          {CLAIM}
        </p>
        <div className="mt-10 grid gap-7 md:grid-cols-3">
          <div>
            <h3 className="font-semibold">Care packs</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Versioned soft-sim packs for older-adult internet CBT design.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Cohorts and modules</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Make co-design fit and module completion explicit before scoring.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Dual A/B</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Test therapist-supported iCBT against waitlist or self-guided baselines.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">
          How it works
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          <li>Create a versioned care pack for your older-adult iCBT soft-sim case.</li>
          <li>Configure cohorts, module paths, and session runs.</li>
          <li>Run a session soft-sim, then compare therapist-supported vs waitlist.</li>
          <li>Lock only when deltas and honesty are understood.</li>
        </ol>
        <p className="mt-6 text-sm">
          <Link href="/pricing" className="underline text-[var(--aw-sage)]">
            Pricing
          </Link>
          {" · "}
          <Link href="/honesty" className="underline text-[var(--aw-sage)]">
            Honesty
          </Link>
          {" · "}
          <a href={PAPER_URL} className="underline text-[var(--aw-sage)]">
            Source paper
          </a>
        </p>
        <p className="mt-4 max-w-2xl text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
          Soft-sim only. Not clinical diagnosis, not live therapist replacement,
          not regulated digital therapeutic clearance, and not the authors&apos;
          Ageing Wisely program.
        </p>
      </section>
    </div>
  );
}

export default LandingPage;
`,
);

function entityPage(opts) {
  const {
    file,
    title,
    subtitle,
    api,
    fields,
    createBody,
    archiveAction = true,
    listHint,
  } = opts;
  const stateDecls = fields
    .map((f) => `  const [${f.name}, set${f.Name}] = useState(${JSON.stringify(f.initial)});`)
    .join("\n");
  const formFields = fields
    .map(
      (f) => `          <Label htmlFor="${f.name}">${f.label}</Label>
          <Input id="${f.name}" value={${f.name}} onChange={(e) => set${f.Name}(e.target.value)} ${f.required ? "required" : ""} />`,
    )
    .join("\n");
  return `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = Record<string, string | number | undefined> & { id: string; label: string; status: string };

export function ${opts.comp}() {
  const [items, setItems] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
${stateDecls}

  const load = async (query = q) => {
    try {
      setItems(
        (await api<{ items: Row[] }>(\`/api/${api}?q=\${encodeURIComponent(query)}\`))
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
      await api("/api/${api}", {
        method: "POST",
        body: JSON.stringify(${createBody}),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };
${
  archiveAction
    ? `
  const archive = async (id: string) => {
    await api("/api/${api}", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  };
`
    : ""
}
  return (
    <StudioShell title="${title}" subtitle="${subtitle}">
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
${formFields}
          <Button type="submit">Create</Button>
        </form>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Button type="button" variant="outline" onClick={() => void load()}>
              Search
            </Button>
          </div>
          <ul className="space-y-2">
            {items.map((row) => (
              <li key={row.id} className="row-lift flex items-center justify-between rounded-lg border bg-white px-4 py-3">
                <div>
                  <p className="font-medium">{row.label}</p>
                  <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                    ${listHint}
                  </p>
                </div>
                ${
                  archiveAction
                    ? `<Button type="button" variant="outline" onClick={() => void archive(row.id)}>
                  Archive
                </Button>`
                    : ""
                }
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}

export default ${opts.comp};
`;
}

w(
  "src/app/packs/page.tsx",
  entityPage({
    file: "packs",
    comp: "PacksPage",
    title: "Care packs",
    subtitle:
      "Version the older-adult iCBT care context before comparing therapist-supported designs against waitlist or self-guided baselines.",
    api: "packs",
    fields: [
      { name: "label", Name: "Label", label: "Label", initial: "", required: true },
      { name: "version", Name: "Version", label: "Version", initial: "1.0", required: true },
      {
        name: "careFocus",
        Name: "CareFocus",
        label: "Care focus",
        initial: "",
        required: true,
      },
    ],
    createBody: "{ label, version, careFocus }",
    listHint: "{row.careFocus as string} · {row.version as string} · {row.status}",
  }),
);

w(
  "src/app/cohorts/page.tsx",
  `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = Record<string, string | number | undefined> & { id: string; label: string; status: string };
type Pack = { id: string; label: string };

export function CohortsPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("community_older_adults");
  const [inclusionHint, setInclusionHint] = useState("");
  const [supportFloor, setSupportFloor] = useState("0.45");
  const [completionFloor, setCompletionFloor] = useState("0.4");

  const load = async (query = q) => {
    try {
      const [cohorts, packList] = await Promise.all([
        api<{ items: Row[] }>(\`/api/cohorts?q=\${encodeURIComponent(query)}\`),
        api<{ items: Pack[] }>("/api/packs"),
      ]);
      setItems(cohorts.items);
      setPacks(packList.items);
      if (!packId && packList.items[0]) setPackId(packList.items[0].id);
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
      await api("/api/cohorts", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          inclusionHint,
          supportFloor: Number(supportFloor),
          completionFloor: Number(completionFloor),
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  const archive = async (id: string) => {
    await api("/api/cohorts", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  };

  return (
    <StudioShell
      title="Cohorts"
      subtitle="Configure older-adult cohort soft-sim inclusions before locking a care pack."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="pack">Pack</Label>
          <select
            id="pack"
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={packId}
            onChange={(e) => setPackId(e.target.value)}
          >
            {packs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Kind</Label>
          <Input id="kind" value={kind} onChange={(e) => setKind(e.target.value)} required />
          <Label htmlFor="inclusion">Inclusion hint</Label>
          <Input id="inclusion" value={inclusionHint} onChange={(e) => setInclusionHint(e.target.value)} required />
          <Label htmlFor="support">Support floor</Label>
          <Input id="support" value={supportFloor} onChange={(e) => setSupportFloor(e.target.value)} />
          <Label htmlFor="completion">Completion floor</Label>
          <Input id="completion" value={completionFloor} onChange={(e) => setCompletionFloor(e.target.value)} />
          <Button type="submit">Create</Button>
        </form>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
            <Button type="button" variant="outline" onClick={() => void load()}>
              Search
            </Button>
          </div>
          <ul className="space-y-2">
            {items.map((row) => (
              <li key={row.id} className="row-lift flex items-center justify-between rounded-lg border bg-white px-4 py-3">
                <div>
                  <p className="font-medium">{row.label}</p>
                  <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                    {row.kind as string} · {row.status}
                  </p>
                </div>
                <Button type="button" variant="outline" onClick={() => void archive(row.id)}>
                  Archive
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}

export default CohortsPage;
`,
);

w(
  "src/app/modules/page.tsx",
  `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = Record<string, string | number | undefined> & { id: string; label: string; status: string };
type Pack = { id: string; label: string };

export function ModulesPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("behavioral_activation");
  const [pathHint, setPathHint] = useState("");
  const [engagementFloor, setEngagementFloor] = useState("0.4");
  const [dropoutCeiling, setDropoutCeiling] = useState("0.35");

  const load = async (query = q) => {
    try {
      const [modules, packList] = await Promise.all([
        api<{ items: Row[] }>(\`/api/modules?q=\${encodeURIComponent(query)}\`),
        api<{ items: Pack[] }>("/api/packs"),
      ]);
      setItems(modules.items);
      setPacks(packList.items);
      if (!packId && packList.items[0]) setPackId(packList.items[0].id);
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
      await api("/api/modules", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          pathHint,
          engagementFloor: Number(engagementFloor),
          dropoutCeiling: Number(dropoutCeiling),
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  const archive = async (id: string) => {
    await api("/api/modules", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  };

  return (
    <StudioShell
      title="Modules"
      subtitle="Configure internet CBT module paths for older-adult soft-sim — not live therapist delivery."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="pack">Pack</Label>
          <select
            id="pack"
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={packId}
            onChange={(e) => setPackId(e.target.value)}
          >
            {packs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Kind</Label>
          <Input id="kind" value={kind} onChange={(e) => setKind(e.target.value)} required />
          <Label htmlFor="path">Path hint</Label>
          <Input id="path" value={pathHint} onChange={(e) => setPathHint(e.target.value)} required />
          <Label htmlFor="engagement">Engagement floor</Label>
          <Input id="engagement" value={engagementFloor} onChange={(e) => setEngagementFloor(e.target.value)} />
          <Label htmlFor="dropout">Dropout ceiling</Label>
          <Input id="dropout" value={dropoutCeiling} onChange={(e) => setDropoutCeiling(e.target.value)} />
          <Button type="submit">Create</Button>
        </form>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
            <Button type="button" variant="outline" onClick={() => void load()}>
              Search
            </Button>
          </div>
          <ul className="space-y-2">
            {items.map((row) => (
              <li key={row.id} className="row-lift flex items-center justify-between rounded-lg border bg-white px-4 py-3">
                <div>
                  <p className="font-medium">{row.label}</p>
                  <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                    {row.kind as string} · {row.status}
                  </p>
                </div>
                <Button type="button" variant="outline" onClick={() => void archive(row.id)}>
                  Archive
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}

export default ModulesPage;
`,
);

console.log("pages part 1 done");
