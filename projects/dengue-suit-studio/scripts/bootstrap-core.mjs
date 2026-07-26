/**
 * Core libs, shell, CSS, layout, APIs for Dengue Suit Studio.
 * Run: node scripts/bootstrap-core.mjs
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
  "src/lib/api.ts",
  `import { NextResponse } from "next/server";
import { checkBearer, checkRateLimit } from "@/store";

export function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function unauthorized() {
  return json({ error: "unauthorized" }, { status: 401 });
}

export function tooMany() {
  return json(
    { error: "rate_limit", message: "Too many requests" },
    { status: 429 },
  );
}

export function guard(req: Request): NextResponse | null {
  if (!checkBearer(req.headers.get("authorization"))) {
    return unauthorized();
  }
  const rl = checkRateLimit();
  if (!rl.ok) return tooMany();
  return null;
}
`,
);

w(
  "src/lib/client-api.ts",
  `import { DEV_TOKEN } from "@/claim";

export const API_TOKEN = DEV_TOKEN;

export async function api<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "content-type": "application/json",
      authorization: \`Bearer \${API_TOKEN}\`,
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(
      typeof err === "object" && err && "error" in err
        ? String((err as { error: string }).error)
        : res.statusText,
    );
  }
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("text/csv") || ct.includes("text/plain")) {
    return (await res.text()) as T;
  }
  return (await res.json()) as T;
}
`,
);

w(
  "src/components/studio-shell.tsx",
  `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DISPLAY_NAME } from "@/claim";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/packs", label: "Packs" },
  { href: "/scenarios", label: "Scenarios" },
  { href: "/species", label: "Species" },
  { href: "/populations", label: "Populations" },
  { href: "/compare", label: "Compare" },
  { href: "/scoreboard", label: "Scoreboard" },
  { href: "/flows", label: "Flows" },
  { href: "/demo", label: "Demo" },
  { href: "/onboarding", label: "Onboarding" },
  { href: "/pricing", label: "Pricing" },
  { href: "/settings", label: "Settings" },
  { href: "/honesty", label: "Honesty" },
] as const;

export function StudioShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-ink)]">
      <header className="border-b border-[var(--studio-line)] bg-[color-mix(in_srgb,var(--studio-panel)_92%,transparent)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-xl tracking-tight text-[var(--ds-amber)]"
          >
            {DISPLAY_NAME}
          </Link>
          <nav className="flex flex-wrap gap-1 text-sm">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(\`\${item.href}/\`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-2.5 py-1.5 transition-colors",
                    active
                      ? "bg-[var(--studio-accent-soft)] text-[var(--studio-ink-deep)]"
                      : "text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)] hover:bg-[var(--studio-gauze-soft)] hover:text-[var(--studio-ink)]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              {subtitle}
            </p>
          ) : null}
        </div>
        {children}
      </main>
    </div>
  );
}
`,
);

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
  --ds-ink: #12171c;
  --ds-teal: #1f6a6e;
  --ds-mist: #eef3f4;
  --ds-line: #c3c9ce;
  --ds-amber: #b4833a;
  --studio-ink: var(--ds-ink);
  --studio-ink-deep: #0a0e11;
  --studio-accent: var(--ds-teal);
  --studio-accent-deep: #164e52;
  --studio-accent-soft: #d3e4e5;
  --studio-gauze-soft: #e2eaec;
  --studio-bg: #eef3f4;
  --studio-panel: #ffffff;
  --studio-line: #c3c9ce;
  --studio-signal: #b4833a;
  --studio-wash: radial-gradient(ellipse 55% 45% at 10% 0%, #1f6a6e55 0%, transparent 55%),
    radial-gradient(ellipse 40% 35% at 90% 20%, #b4833a44 0%, transparent 50%),
    linear-gradient(165deg, #0a0e11 0%, #12171c 48%, #1a2426 100%);

  --background: #eef3f4;
  --foreground: #12171c;
  --card: #ffffff;
  --card-foreground: #12171c;
  --popover: #ffffff;
  --popover-foreground: #12171c;
  --primary: #1f6a6e;
  --primary-foreground: #eef3f4;
  --secondary: #e2eaec;
  --secondary-foreground: #12171c;
  --muted: #e2eaec;
  --muted-foreground: #556066;
  --accent: #d3e4e5;
  --accent-foreground: #12171c;
  --destructive: #8b3a45;
  --border: #c3c9ce;
  --input: #c3c9ce;
  --ring: #1f6a6e;
  --radius: 0.5rem;
}

body {
  background: var(--studio-bg);
  color: var(--studio-ink);
  font-family: var(--font-sans), system-ui, sans-serif;
}

.hero-fade {
  animation: heroIn 1.1s ease-out both;
}
@keyframes heroIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: none; }
}
.mist-fade {
  animation: mistPulse 8s ease-in-out infinite alternate;
}
@keyframes mistPulse {
  from { opacity: 0.45; }
  to { opacity: 0.85; }
}
.schema-grid {
  background-image:
    linear-gradient(to right, #1f6a6e22 1px, transparent 1px),
    linear-gradient(to bottom, #1f6a6e22 1px, transparent 1px);
  background-size: 48px 48px;
  animation: gridDrift 18s linear infinite;
}
@keyframes gridDrift {
  from { background-position: 0 0; }
  to { background-position: 48px 24px; }
}
.thermal-mist {
  background:
    radial-gradient(ellipse 40% 30% at 30% 40%, #1f6a6e66 0%, transparent 60%),
    radial-gradient(ellipse 35% 40% at 70% 60%, #b4833a44 0%, transparent 55%);
  animation: thermalShift 10s ease-in-out infinite alternate;
}
@keyframes thermalShift {
  from { transform: scale(1) translate(0, 0); }
  to { transform: scale(1.05) translate(2%, -1%); }
}
.signal-underline {
  display: block;
  width: 4rem;
  height: 3px;
  margin-top: 0.75rem;
  background: var(--ds-amber);
  animation: underlineGrow 0.9s ease-out 0.3s both;
}
@keyframes underlineGrow {
  from { width: 0; opacity: 0; }
  to { width: 4rem; opacity: 1; }
}
.row-lift {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.row-lift:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px #12171c14;
}
.score-bar {
  transition: width 0.6s ease;
}
`,
);

const apiRoutes = {
  "src/app/api/packs/route.ts": `import { guard, json } from "@/lib/api";
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
    riskFocus: body.riskFocus ?? body.focus ?? "",
    gridBudget: body.gridBudget,
    notes: body.notes,
  });
  return json({ pack }, { status: 201 });
}
`,
  "src/app/api/scenarios/route.ts": `import { guard, json } from "@/lib/api";
import { archiveScenario, createScenario, listScenarios } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listScenarios({
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
    const row = archiveScenario(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json({ scenario: row });
  }
  const scenario = createScenario({
    packId: body.packId,
    label: body.label,
    kind: body.kind,
    horizonHint: body.horizonHint ?? "",
    thermalFloor: Number(body.thermalFloor ?? 0.4),
    shiftFloor: Number(body.shiftFloor ?? 0.4),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!scenario) return json({ error: "bad_pack" }, { status: 400 });
  return json({ scenario }, { status: 201 });
}
`,
  "src/app/api/species/route.ts": `import { guard, json } from "@/lib/api";
import { archiveSpecies, createSpecies, listSpecies } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listSpecies({
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
    const row = archiveSpecies(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json({ species: row });
  }
  const species = createSpecies({
    packId: body.packId,
    label: body.label,
    kind: body.kind,
    nicheHint: body.nicheHint ?? "",
    nicheFloor: Number(body.nicheFloor ?? 0.4),
    stickinessCeiling: Number(body.stickinessCeiling ?? 0.35),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!species) return json({ error: "bad_pack" }, { status: 400 });
  return json({ species }, { status: 201 });
}
`,
  "src/app/api/populations/route.ts": `import { guard, json } from "@/lib/api";
import { createPopulation, listPopulations } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listPopulations({
      packId: url.searchParams.get("packId") ?? undefined,
      scenarioId: url.searchParams.get("scenarioId") ?? undefined,
      speciesId: url.searchParams.get("speciesId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const population = createPopulation({
    packId: body.packId,
    scenarioId: body.scenarioId,
    speciesId: body.speciesId,
    label: body.label,
    kind: body.kind,
    thermalSuitIndex: Number(body.thermalSuitIndex ?? 0.5),
    populationAtRisk: Number(body.populationAtRisk ?? 0.5),
    climateShiftSignal: Number(body.climateShiftSignal ?? 0.5),
    assaySignal: Number(body.assaySignal ?? 0.5),
    runNotes: body.runNotes,
  });
  if (!population) return json({ error: "bad_refs" }, { status: 400 });
  return json({ population }, { status: 201 });
}
`,
  "src/app/api/compare/route.ts": `import { guard, json } from "@/lib/api";
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
    scenarioId: body.scenarioId,
    speciesId: body.speciesId,
    populationId: body.populationId,
    climateBias: body.climateBias ?? body.bias,
    overclaimRisk: body.overclaimRisk,
    vectorNicheFidelity: body.vectorNicheFidelity,
    spatialCoverage: body.spatialCoverage,
    historicalStickiness: body.historicalStickiness,
  });
  if (!compare) return json({ error: "bad_refs" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
`,
  "src/app/api/scoreboard/route.ts": `import { guard, json } from "@/lib/api";
import { getScoreboard } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: getScoreboard() });
}
`,
  "src/app/api/settings/route.ts": `import { guard, json } from "@/lib/api";
import { getOrg, updateOrg } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ org: getOrg() });
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  return json({ org: updateOrg(body) });
}
`,
  "src/app/api/members/route.ts": `import { guard, json } from "@/lib/api";
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
  const member = inviteMember(body.email, body.role ?? "viewer");
  return json({ member }, { status: 201 });
}
`,
  "src/app/api/audit/route.ts": `import { guard, json } from "@/lib/api";
import { listAudits } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit") ?? 50);
  return json({ items: listAudits(limit) });
}
`,
  "src/app/api/export/route.ts": `import { NextResponse } from "next/server";
import { guard, json } from "@/lib/api";
import { exportComparesCsv, exportPacksJson } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  const format = url.searchParams.get("format") ?? "json";
  if (format === "csv") {
    return new NextResponse(exportComparesCsv(), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": 'attachment; filename="dengue-compares.csv"',
      },
    });
  }
  return new NextResponse(exportPacksJson(), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": 'attachment; filename="dengue-packs.json"',
    },
  });
}
`,
  "src/app/api/webhook/route.ts": `import { json } from "@/lib/api";
import { checkBearer, checkRateLimit, ingestWebhook } from "@/store";

export async function POST(req: Request) {
  if (!checkBearer(req.headers.get("authorization"))) {
    return json({ error: "unauthorized" }, { status: 401 });
  }
  const rl = checkRateLimit();
  if (!rl.ok) {
    return json({ error: "rate_limit" }, { status: 429 });
  }
  const idempotencyKey =
    req.headers.get("idempotency-key") ??
    req.headers.get("x-idempotency-key") ??
    "";
  if (!idempotencyKey) {
    return json({ error: "missing_idempotency_key" }, { status: 400 });
  }
  const payload = await req.json();
  const result = ingestWebhook(
    idempotencyKey,
    payload,
    req.headers.get("x-signature") ?? req.headers.get("x-hub-signature-256"),
  );
  if (!result.ok) {
    return json({ error: result.error }, { status: 401 });
  }
  return json(result, { status: result.duplicate ? 200 : 201 });
}
`,
  "src/app/api/features/route.ts": `import { guard, json } from "@/lib/api";
import { featureInventory } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const features = featureInventory();
  return json({ count: features.length, features });
}
`,
  "src/app/api/goldens-sample/route.ts": `import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ count: GOLDENS.length, sample: GOLDENS.slice(0, 3) });
}
`,
};

for (const [rel, content] of Object.entries(apiRoutes)) {
  w(rel, content);
}

console.log("bootstrap-core done");
