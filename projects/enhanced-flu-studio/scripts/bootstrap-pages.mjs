/**
 * Pages + layout + CSS for Enhanced Flu Studio.
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
  --ef-ink: #12171c;
  --ef-teal: #2a5f6a;
  --ef-mist: #eef2f4;
  --ef-line: #c4c9ce;
  --ef-amber: #b4833a;
  --studio-ink: var(--ef-ink);
  --studio-ink-deep: #0a0e11;
  --studio-accent: var(--ef-teal);
  --studio-accent-deep: #1c454d;
  --studio-accent-soft: #d5e3e6;
  --studio-gauze-soft: #e2eaec;
  --studio-bg: #eef2f4;
  --studio-panel: #ffffff;
  --studio-line: #c4c9ce;
  --studio-signal: #b4833a;
  --studio-wash: radial-gradient(ellipse 55% 45% at 10% 0%, #2a5f6a55 0%, transparent 55%),
    radial-gradient(ellipse 40% 35% at 90% 20%, #b4833a44 0%, transparent 50%),
    linear-gradient(165deg, #0a0e11 0%, #12171c 48%, #1a2428 100%);

  --background: #eef2f4;
  --foreground: #12171c;
  --card: #ffffff;
  --card-foreground: #12171c;
  --popover: #ffffff;
  --popover-foreground: #12171c;
  --primary: #2a5f6a;
  --primary-foreground: #eef2f4;
  --secondary: #e2eaec;
  --secondary-foreground: #12171c;
  --muted: #e2eaec;
  --muted-foreground: #556066;
  --accent: #d5e3e6;
  --accent-foreground: #12171c;
  --destructive: #8b3a45;
  --border: #c4c9ce;
  --input: #c4c9ce;
  --ring: #2a5f6a;
  --radius: 0.5rem;
}

body {
  background: var(--studio-bg);
  color: var(--studio-ink);
  font-family: var(--font-sans), system-ui, sans-serif;
}

.hero-fade {
  animation: hero-in 0.9s ease-out both;
}

.mist-fade {
  animation: mist-drift 14s ease-in-out infinite alternate;
}

.signal-underline {
  display: block;
  width: 4.5rem;
  height: 3px;
  margin-top: 0.75rem;
  background: var(--ef-amber);
  animation: underline-grow 0.7s ease-out 0.25s both;
}

.schema-grid {
  background-image:
    linear-gradient(to right, #ffffff0d 1px, transparent 1px),
    linear-gradient(to bottom, #ffffff0d 1px, transparent 1px);
  background-size: 48px 48px;
}

.winter-mist {
  background:
    radial-gradient(ellipse 70% 50% at 30% 80%, #2a5f6a33 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 80% 30%, #ffffff14 0%, transparent 55%);
}

.row-lift {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.row-lift:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px #12171c14;
}

@keyframes hero-in {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes mist-drift {
  from { transform: translateY(0) scale(1); }
  to { transform: translateY(-8px) scale(1.03); }
}
@keyframes underline-grow {
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
        <div aria-hidden className="winter-mist absolute inset-0 opacity-50" />
        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-6 pb-20 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl tracking-tight text-[var(--ef-amber)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <span className="signal-underline" aria-hidden />
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-3xl text-white md:text-4xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--ef-mist)]">
            Program packs for Nordic-style EIV planning — compare expanded
            enhanced flu programs against current national policy baselines
            before you lock a pack.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/packs"
              className="rounded-md bg-[var(--ef-amber)] px-5 py-2.5 text-sm font-medium text-white"
            >
              Open packs
            </Link>
            <Link
              href="/demo"
              className="rounded-md border border-[var(--ef-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              See demo
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border border-[var(--ef-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              Pricing
            </Link>
            <Link
              href="/onboarding"
              className="rounded-md border border-[var(--ef-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              Onboarding
            </Link>
            <Link
              href="/flows"
              className="rounded-md border border-[var(--ef-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              All flows
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          Current national flu policies for adults 65+ may under-use enhanced
          influenza vaccines.
        </h2>
        <p className="mt-3 max-w-2xl text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          {CLAIM}
        </p>
        <div className="mt-10 grid gap-7 md:grid-cols-3">
          <div>
            <h3 className="font-semibold">Program packs</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Versioned soft-sim packs for expanded EIV program planning.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Countries and programs</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Make Nordic country scenarios and EIV program designs explicit
              before scoring.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Dual A/B</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Test expanded EIV programs against current policy baselines.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">
          How it works
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          <li>Create a versioned program pack for your EIV expansion soft-sim case.</li>
          <li>Configure country scenarios, program designs, and outcome metrics.</li>
          <li>Run an expanded-EIV soft-sim, then compare against current policy.</li>
          <li>Lock only when deltas and honesty are understood.</li>
        </ol>
        <p className="mt-6 text-sm">
          <Link href="/pricing" className="underline text-[var(--ef-teal)]">
            Pricing
          </Link>
          {" · "}
          <Link href="/honesty" className="underline text-[var(--ef-teal)]">
            Honesty
          </Link>
          {" · "}
          <a href={PAPER_URL} className="underline text-[var(--ef-teal)]">
            Source paper
          </a>
        </p>
        <p className="mt-4 max-w-2xl text-xs text-[color-mix(in_srgb,var(--studio-ink)_50%,transparent)]">
          Soft-sim only — not live immunization logistics, not clinical
          prescribing, not national policy adoption, not the authors&apos; Nordic
          EIV model.
        </p>
      </section>
    </div>
  );
}

export default LandingPage;
`,
);

function entityPage({
  file,
  title,
  subtitle,
  endpoint,
  fields,
  createBody,
  listExtra,
}) {
  w(
    file,
    `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = Record<string, string | number | undefined> & {
  id: string;
  label: string;
  status: string;
};

export function Page() {
  const [items, setItems] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
${fields.state}

  const load = async (query = q) => {
    try {
      setItems(
        (
          await api<{ items: Row[] }>(
            \`${endpoint}?q=\${encodeURIComponent(query)}\`,
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
      await api("${endpoint}", {
        method: "POST",
        body: JSON.stringify(${createBody}),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  const archive = async (id: string) => {
    await api("${endpoint}", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  };

  return (
    <StudioShell title="${title}" subtitle="${subtitle}">
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
${fields.form}
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
                    ${listExtra} · {row.status}
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

export default Page;
`,
  );
}

entityPage({
  file: "src/app/packs/page.tsx",
  title: "Program packs",
  subtitle:
    "Version the vaccine-program context before comparing expanded EIV programs against current national policy baselines.",
  endpoint: "/api/packs",
  fields: {
    state: `  const [label, setLabel] = useState("");
  const [version, setVersion] = useState("1.0");
  const [programFocus, setProgramFocus] = useState("");`,
    form: `          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="version">Version</Label>
          <Input id="version" value={version} onChange={(e) => setVersion(e.target.value)} required />
          <Label htmlFor="programFocus">Program focus</Label>
          <Input id="programFocus" value={programFocus} onChange={(e) => setProgramFocus(e.target.value)} required />`,
  },
  createBody: "{ label, version, programFocus }",
  listExtra: "{row.programFocus as string} · {row.version as string}",
});

entityPage({
  file: "src/app/countries/page.tsx",
  title: "Countries",
  subtitle:
    "Configure Nordic-style country scenarios for adults ≥65 before outcome scoring.",
  endpoint: "/api/countries",
  fields: {
    state: `  const [packId, setPackId] = useState("pack-demo");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("sweden");
  const [regionHint, setRegionHint] = useState("nordic-65plus");`,
    form: `          <Label htmlFor="packId">Pack id</Label>
          <Input id="packId" value={packId} onChange={(e) => setPackId(e.target.value)} required />
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Country kind</Label>
          <Input id="kind" value={kind} onChange={(e) => setKind(e.target.value)} required />
          <Label htmlFor="regionHint">Region hint</Label>
          <Input id="regionHint" value={regionHint} onChange={(e) => setRegionHint(e.target.value)} required />`,
  },
  createBody:
    "{ packId, label, kind, regionHint, coverageFloor: 0.45, parityFloor: 0.4 }",
  listExtra: "{row.kind as string} · {row.regionHint as string}",
});

entityPage({
  file: "src/app/programs/page.tsx",
  title: "Programs",
  subtitle:
    "Design expanded enhanced influenza vaccine program specs — soft-sim only, not clinical prescribing.",
  endpoint: "/api/programs",
  fields: {
    state: `  const [packId, setPackId] = useState("pack-demo");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("expanded_eiv_65plus");
  const [eivHint, setEivHint] = useState("high-dose-adjuvanted-mix");`,
    form: `          <Label htmlFor="packId">Pack id</Label>
          <Input id="packId" value={packId} onChange={(e) => setPackId(e.target.value)} required />
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Program kind</Label>
          <Input id="kind" value={kind} onChange={(e) => setKind(e.target.value)} required />
          <Label htmlFor="eivHint">EIV hint</Label>
          <Input id="eivHint" value={eivHint} onChange={(e) => setEivHint(e.target.value)} required />`,
  },
  createBody:
    "{ packId, label, kind, eivHint, eivFloor: 0.45, stickinessCeiling: 0.35 }",
  listExtra: "{row.kind as string} · {row.eivHint as string}",
});

console.log("pages batch 1 done");
