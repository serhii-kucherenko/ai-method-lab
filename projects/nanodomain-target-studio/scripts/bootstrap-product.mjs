/**
 * Bootstrap Nanodomain Target Studio surfaces (APIs, pages, CSS, tests).
 * Run: node scripts/bootstrap-product.mjs
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
  { href: "/nanodomains", label: "Nanodomains" },
  { href: "/peptides", label: "Peptides" },
  { href: "/assays", label: "Assays" },
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
            className="font-[family-name:var(--font-display)] text-xl tracking-tight text-[var(--nt-crimson)]"
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
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--studio-ink)]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
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

// --- API routes ---
const apis = {
  packs: `import { guard, json } from "@/lib/api";
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
    therapyFocus: body.therapyFocus ?? body.focus ?? "",
    sessionBudget: body.sessionBudget,
    notes: body.notes,
  });
  return json({ pack }, { status: 201 });
}
`,
  nanodomains: `import { guard, json } from "@/lib/api";
import { archiveNanodomain, createNanodomain, listNanodomains } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listNanodomains({
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
    const nanodomain = archiveNanodomain(body.id);
    if (!nanodomain) return json({ error: "not_found" }, { status: 404 });
    return json({ nanodomain });
  }
  const nanodomain = createNanodomain({
    packId: body.packId ?? "pack-demo",
    label: body.label,
    kind: body.kind ?? "camp_pka_local",
    locusHint: body.locusHint ?? "",
    localizationFloor: Number(body.localizationFloor ?? 0.4),
    diastolicFloor: Number(body.diastolicFloor ?? 0.4),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!nanodomain) return json({ error: "bad_pack" }, { status: 400 });
  return json({ nanodomain }, { status: 201 });
}
`,
  peptides: `import { guard, json } from "@/lib/api";
import { archivePeptide, createPeptide, listPeptides } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listPeptides({
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
    const peptide = archivePeptide(body.id);
    if (!peptide) return json({ error: "not_found" }, { status: 404 });
    return json({ peptide });
  }
  const peptide = createPeptide({
    packId: body.packId ?? "pack-demo",
    label: body.label,
    kind: body.kind ?? "pde_pry",
    pryHint: body.pryHint ?? "",
    pryFloor: Number(body.pryFloor ?? 0.4),
    systolicFloor: Number(body.systolicFloor ?? 0.5),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!peptide) return json({ error: "bad_pack" }, { status: 400 });
  return json({ peptide }, { status: 201 });
}
`,
  assays: `import { guard, json } from "@/lib/api";
import { createAssayRun, listAssayRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listAssayRuns({
      packId: url.searchParams.get("packId") ?? undefined,
      nanodomainId: url.searchParams.get("nanodomainId") ?? undefined,
      peptideId: url.searchParams.get("peptideId") ?? undefined,
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
    packId: body.packId ?? "pack-demo",
    nanodomainId: body.nanodomainId ?? "nanodomain-demo",
    peptideId: body.peptideId ?? "peptide-demo",
    label: body.label,
    kind: body.kind ?? "diastolic_restore",
    nanodomainLocalization: Number(body.nanodomainLocalization ?? 0.6),
    pdePryStrength: Number(body.pdePryStrength ?? 0.55),
    assaySignal: Number(body.assaySignal ?? 0.6),
    runNotes: body.runNotes,
  });
  if (!run) return json({ error: "bad_refs" }, { status: 400 });
  return json({ run }, { status: 201 });
}
`,
  compare: `import { guard, json } from "@/lib/api";
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
    name: body.name ?? "Nanodomain compare",
    packId: body.packId ?? "pack-demo",
    nanodomainId: body.nanodomainId ?? "nanodomain-demo",
    peptideId: body.peptideId ?? "peptide-demo",
    assayRunId: body.assayRunId ?? "assay-demo",
    targetBias: body.targetBias ?? body.bias,
    overclaimRisk: body.overclaimRisk,
    diastolicGain: body.diastolicGain,
    systolicPreserve: body.systolicPreserve,
    systemicSpillover: body.systemicSpillover,
    phosphorylationCoverage: body.phosphorylationCoverage,
  });
  if (!compare) return json({ error: "bad_refs" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
`,
  scoreboard: `import { guard, json } from "@/lib/api";
import { getScoreboard } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: getScoreboard() });
}
`,
  settings: `import { guard, json } from "@/lib/api";
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
  members: `import { guard, json } from "@/lib/api";
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
  audit: `import { guard, json } from "@/lib/api";
import { listAudits } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json({ items: listAudits(Number(url.searchParams.get("limit") ?? 50)) });
}
`,
  export: `import { guard, json } from "@/lib/api";
import { exportComparesCsv, exportPacksJson } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  const format = url.searchParams.get("format") ?? "json";
  if (format === "csv") {
    return new Response(exportComparesCsv(), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": 'attachment; filename="nanodomain-compares.csv"',
      },
    });
  }
  return new Response(exportPacksJson(), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": 'attachment; filename="nanodomain-packs.json"',
    },
  });
}
`,
  webhook: `import { createHmac } from "node:crypto";
import { json } from "@/lib/api";
import { getOrg, ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const body = await req.json();
  const key =
    req.headers.get("idempotency-key") ??
    body.idempotencyKey ??
    \`auto-\${Date.now()}\`;
  let signature = req.headers.get("x-signature");
  if (!signature && body.sign === true) {
    const secret = getOrg().webhookSecret;
    const expected = createHmac("sha256", secret)
      .update(JSON.stringify(body.payload ?? body))
      .digest("hex");
    signature = \`sha256=\${expected}\`;
  }
  const result = ingestWebhook(key, body.payload ?? body, signature);
  if (!result.ok) return json(result, { status: 401 });
  return json(result, { status: result.duplicate ? 200 : 201 });
}
`,
  features: `import { guard, json } from "@/lib/api";
import { featureInventory } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: featureInventory() });
}
`,
  "goldens-sample": `import { guard, json } from "@/lib/api";
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
};

for (const [name, content] of Object.entries(apis)) {
  w(`src/app/api/${name}/route.ts`, content);
}

console.log("API routes done");
