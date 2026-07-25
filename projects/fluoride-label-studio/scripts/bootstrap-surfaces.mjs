/**
 * Bootstrap remaining Fluoride Label Studio surfaces.
 * Run: node scripts/bootstrap-surfaces.mjs
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function write(rel, content) {
  const path = join(root, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
  console.log("wrote", rel);
}

// --- shared libs ---
write(
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

write(
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

write(
  "src/components/studio-shell.tsx",
  `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DISPLAY_NAME } from "@/claim";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/packs", label: "Packs" },
  { href: "/precursors", label: "Precursors" },
  { href: "/exchanges", label: "Exchanges" },
  { href: "/tracers", label: "Tracers" },
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
            className="font-[family-name:var(--font-display)] text-xl tracking-tight text-[var(--fl-cobalt)]"
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
    tracerFocus: body.tracerFocus ?? body.assayFocus ?? "",
    sessionBudget: body.sessionBudget,
    notes: body.notes,
  });
  return json({ pack }, { status: 201 });
}
`,
  precursors: `import { guard, json } from "@/lib/api";
import { archivePrecursor, createPrecursor, listPrecursors } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listPrecursors({
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
    const row = archivePrecursor(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json({ precursor: row });
  }
  const precursor = createPrecursor({
    packId: body.packId ?? "pack-demo",
    label: body.label,
    kind: body.kind ?? "iminosulfur_oxydifluoride",
    scaffoldHint: body.scaffoldHint ?? "",
    purityFloor: Number(body.purityFloor ?? 0.4),
    amineCount: Number(body.amineCount ?? 1),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!precursor) return json({ error: "bad_pack" }, { status: 400 });
  return json({ precursor }, { status: 201 });
}
`,
  exchanges: `import { guard, json } from "@/lib/api";
import { archiveExchange, createExchange, listExchanges } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listExchanges({
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
    const row = archiveExchange(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json({ exchange: row });
  }
  const exchange = createExchange({
    packId: body.packId ?? "pack-demo",
    label: body.label,
    kind: body.kind ?? "isotopic_18f_swap",
    exchangeHint: body.exchangeHint ?? "",
    cycleMinutes: Number(body.cycleMinutes ?? 12),
    exchangeFloor: Number(body.exchangeFloor ?? 0.4),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!exchange) return json({ error: "bad_pack" }, { status: 400 });
  return json({ exchange }, { status: 201 });
}
`,
  tracers: `import { guard, json } from "@/lib/api";
import { archiveTracer, createTracer, listTracers } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listTracers({
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
    const row = archiveTracer(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json({ tracer: row });
  }
  const tracer = createTracer({
    packId: body.packId ?? "pack-demo",
    label: body.label,
    kind: body.kind ?? "small_molecule_pet",
    targetHint: body.targetHint ?? "",
    specificActivityFloor: Number(body.specificActivityFloor ?? 0.35),
    yieldFloor: Number(body.yieldFloor ?? 0.4),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!tracer) return json({ error: "bad_pack" }, { status: 400 });
  return json({ tracer }, { status: 201 });
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
      precursorId: url.searchParams.get("precursorId") ?? undefined,
      exchangeId: url.searchParams.get("exchangeId") ?? undefined,
      tracerId: url.searchParams.get("tracerId") ?? undefined,
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
    precursorId: body.precursorId ?? "precursor-demo",
    exchangeId: body.exchangeId ?? "exchange-demo",
    tracerId: body.tracerId ?? "tracer-demo",
    exchangeRate: Number(body.exchangeRate ?? 0.6),
    precursorPurity: Number(body.precursorPurity ?? 0.7),
    leavingGroupEase: Number(body.leavingGroupEase ?? 0.7),
    amineAvailability: Number(body.amineAvailability ?? 0.65),
    runNotes: body.runNotes,
  });
  if (!run) return json({ error: "bad_refs" }, { status: 400 });
  return json({ assay: run }, { status: 201 });
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
    name: body.name ?? "Seed fluoride compare",
    packId: body.packId ?? "pack-demo",
    precursorId: body.precursorId ?? "precursor-demo",
    exchangeId: body.exchangeId ?? "exchange-demo",
    tracerId: body.tracerId ?? "tracer-demo",
    assayRunId: body.assayRunId ?? "assay-demo",
    labelBias: body.labelBias ?? body.bias,
    prostheticStepBurden: body.prostheticStepBurden,
    solventHarshness: body.solventHarshness,
    activationBarrier: body.activationBarrier,
    overclaimRisk: body.overclaimRisk,
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
        "content-disposition": 'attachment; filename="compares.csv"',
      },
    });
  }
  return new Response(exportPacksJson(), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": 'attachment; filename="packs.json"',
    },
  });
}
`,
  webhook: `import { json } from "@/lib/api";
import { ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const body = await req.json();
  const key =
    req.headers.get("idempotency-key") ??
    body.idempotencyKey ??
    crypto.randomUUID();
  const signature = req.headers.get("x-signature");
  const result = ingestWebhook(key, body, signature);
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
  return json({ items: GOLDENS.slice(0, 5), total: GOLDENS.length });
}
`,
};

for (const [name, content] of Object.entries(apis)) {
  write(`src/app/api/${name}/route.ts`, content);
}

function entityPage({
  title,
  subtitle,
  apiPath,
  entityLabel,
  fields,
  createBody,
}) {
  const fieldState = fields
    .map((f) => `  const [${f.name}, set${f.Name}] = useState(${JSON.stringify(f.default)});`)
    .join("\n");
  const fieldInputs = fields
    .map(
      (f) => `          <Label htmlFor="${f.name}">${f.label}</Label>
          <Input id="${f.name}" value={${f.name}} onChange={(e) => set${f.Name}(e.target.value)} required />`,
    )
    .join("\n");
  return `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = { id: string; label: string; status: string; [k: string]: string | number };

export function ${title.replace(/\\s/g, "")}Page() {
  const [items, setItems] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
${fieldState}

  const load = async (query = q) => {
    try {
      setItems(
        (await api<{ items: Row[] }>(\`${apiPath}?q=\${encodeURIComponent(query)}\`)).items,
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
${fieldInputs}
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
              <li key={row.id} className="row-lift flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white p-4">
                <div>
                  <p className="font-semibold">{row.label}</p>
                  <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">${entityLabel} · {row.status}</p>
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

export default ${title.replace(/\\s/g, "")}Page;
`;
}

write(
  "src/app/packs/page.tsx",
  entityPage({
    title: "Label packs",
    subtitle:
      "Version the fluorine-18 labeling context before comparing fast isotopic exchange vs prosthetic baselines.",
    apiPath: "/api/packs",
    entityLabel: "Label pack",
    fields: [
      { name: "label", Name: "Label", label: "Label", default: "" },
      { name: "version", Name: "Version", label: "Version", default: "1.0" },
      {
        name: "tracerFocus",
        Name: "TracerFocus",
        label: "Tracer focus",
        default: "",
      },
    ],
    createBody: "{ label, version, tracerFocus }",
  }),
);

write(
  "src/app/precursors/page.tsx",
  entityPage({
    title: "Precursors",
    subtitle:
      "Configure iminosulfur / triflimidoyl precursor scaffolds for isotopic 18F exchange soft-sim.",
    apiPath: "/api/precursors",
    entityLabel: "Precursor",
    fields: [
      { name: "label", Name: "Label", label: "Label", default: "" },
      {
        name: "scaffoldHint",
        Name: "ScaffoldHint",
        label: "Scaffold hint",
        default: "SuFEx,primary-amine",
      },
    ],
    createBody:
      '{ packId: "pack-demo", label, kind: "iminosulfur_oxydifluoride", scaffoldHint, purityFloor: 0.4, amineCount: 1 }',
  }),
);

write(
  "src/app/exchanges/page.tsx",
  entityPage({
    title: "Exchange runs",
    subtitle:
      "Define late-stage isotopic 18F swap cycles before locking a label pack.",
    apiPath: "/api/exchanges",
    entityLabel: "Exchange",
    fields: [
      { name: "label", Name: "Label", label: "Label", default: "" },
      {
        name: "exchangeHint",
        Name: "ExchangeHint",
        label: "Exchange hint",
        default: "exchange,cassette",
      },
    ],
    createBody:
      '{ packId: "pack-demo", label, kind: "isotopic_18f_swap", exchangeHint, cycleMinutes: 12, exchangeFloor: 0.4 }',
  }),
);

write(
  "src/app/tracers/page.tsx",
  entityPage({
    title: "Tracers",
    subtitle:
      "Register PET tracer drafts and yield floors for soft-sim labeling compares.",
    apiPath: "/api/tracers",
    entityLabel: "Tracer",
    fields: [
      { name: "label", Name: "Label", label: "Label", default: "" },
      {
        name: "targetHint",
        Name: "TargetHint",
        label: "Target hint",
        default: "CNS,PET",
      },
    ],
    createBody:
      '{ packId: "pack-demo", label, kind: "small_molecule_pet", targetHint, specificActivityFloor: 0.35, yieldFloor: 0.4 }',
  }),
);

write(
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
  exchangeRate: number;
  precursorPurity: number;
  leavingGroupEase: number;
  amineAvailability: number;
  runNotes: string;
};

export function AssaysPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [exchangeRate, setExchangeRate] = useState("0.62");
  const [precursorPurity, setPrecursorPurity] = useState("0.7");
  const [leavingGroupEase, setLeavingGroupEase] = useState("0.74");
  const [amineAvailability, setAmineAvailability] = useState("0.68");
  const [runNotes, setRunNotes] = useState("");
  const [error, setError] = useState("");

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
          exchangeRate: Number(exchangeRate),
          precursorPurity: Number(precursorPurity),
          leavingGroupEase: Number(leavingGroupEase),
          amineAvailability: Number(amineAvailability),
          runNotes,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Assay soft-sim"
      subtitle="Capture exchange-rate and precursor-purity inputs for dual A/B labeling compares."
    >
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="exchangeRate">Exchange rate</Label>
          <Input id="exchangeRate" value={exchangeRate} onChange={(e) => setExchangeRate(e.target.value)} />
          <Label htmlFor="precursorPurity">Precursor purity</Label>
          <Input id="precursorPurity" value={precursorPurity} onChange={(e) => setPrecursorPurity(e.target.value)} />
          <Label htmlFor="leavingGroupEase">Leaving-group ease</Label>
          <Input id="leavingGroupEase" value={leavingGroupEase} onChange={(e) => setLeavingGroupEase(e.target.value)} />
          <Label htmlFor="amineAvailability">Amine availability</Label>
          <Input id="amineAvailability" value={amineAvailability} onChange={(e) => setAmineAvailability(e.target.value)} />
          <Label htmlFor="runNotes">Notes</Label>
          <Input id="runNotes" value={runNotes} onChange={(e) => setRunNotes(e.target.value)} />
          <Button>Create assay</Button>
        </form>
        <section>
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          <ul className="space-y-3">
            {items.map((row) => (
              <li key={row.id} className="row-lift rounded-lg border bg-white p-4">
                <p className="font-semibold">Assay {row.id.slice(0, 8)}</p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                  exchange {row.exchangeRate} · purity {row.precursorPurity} · leaving {row.leavingGroupEase}
                </p>
                {row.runNotes ? <p className="mt-1 text-sm">{row.runNotes}</p> : null}
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

write(
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
  exchange: { overall: number };
  prosthetic: { overall: number };
};

export function ComparePage() {
  const [items, setItems] = useState<Compare[]>([]);
  const [name, setName] = useState("Seed fluoride compare");
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
      subtitle="Fast isotopic exchange (A) vs multistep prosthetic baseline (B)."
    >
      <form onSubmit={run} className="mb-8 flex flex-wrap items-end gap-3 rounded-lg border bg-white p-4">
        <div>
          <Label htmlFor="name">Compare name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
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
                <span className="mr-4">A exchange {c.exchange.overall}</span>
                <span>B prosthetic {c.prosthetic.overall}</span>
              </div>
            </div>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <div className="h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
                <div className="score-bar h-full bg-[var(--fl-cobalt)]" style={{ width: \`\${c.exchange.overall}%\` }} />
              </div>
              <div className="h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
                <div className="score-bar h-full bg-[var(--fl-amber)]" style={{ width: \`\${c.prosthetic.overall}%\` }} />
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

write(
  "src/app/scoreboard/page.tsx",
  `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  exchange: { overall: number };
  prosthetic: { overall: number };
};

export function ScoreboardPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        setItems((await api<{ items: Row[] }>("/api/scoreboard")).items);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load");
      }
    })();
  }, []);

  return (
    <StudioShell
      title="Labeling scoreboard"
      subtitle="Rank soft-sim compares by fast isotopic exchange overall."
    >
      {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
          No compares yet — run one from Compare.
        </p>
      ) : (
        <ol className="space-y-3">
          {items.map((row, i) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white p-4">
              <p className="font-semibold">
                #{i + 1} {row.name}
              </p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                A {row.exchange.overall} · B {row.prosthetic.overall} · winner {row.winner} · gap {row.gap}
              </p>
            </li>
          ))}
        </ol>
      )}
    </StudioShell>
  );
}

export default ScoreboardPage;
`,
);

console.log("bootstrap core APIs/pages done");
