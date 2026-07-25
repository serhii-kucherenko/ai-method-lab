/**
 * Write remaining pages + all API routes.
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
  "src/app/prefs/page.tsx",
  `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Run = {
  id: string;
  safetyPreference: number;
  oversightSupport: number;
  coordinationPreference: number;
  packReadiness: number;
  status: string;
};

export function PrefsPage() {
  const [items, setItems] = useState<Run[]>([]);
  const [safetyPreference, setSafety] = useState(0.7);
  const [oversightSupport, setOversight] = useState(0.72);
  const [coordinationPreference, setCoord] = useState(0.68);
  const [packReadiness, setReady] = useState(0.7);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setItems((await api<{ items: Run[] }>("/api/prefs")).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load prefs");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/prefs", {
        method: "POST",
        body: JSON.stringify({
          packId: "pack-demo",
          optionId: "option-demo",
          countryId: "country-demo",
          surveyId: "survey-demo",
          safetyPreference,
          oversightSupport,
          coordinationPreference,
          packReadiness,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create run");
    }
  };

  return (
    <StudioShell
      title="Preference runs"
      subtitle="Soft-sim preference runs feed dual A/B compares — not certified polling."
    >
      <form onSubmit={create} className="mb-8 grid max-w-lg gap-3 rounded-lg border bg-white p-4">
        <Label htmlFor="safety">Safety preference</Label>
        <Input id="safety" type="number" step="0.01" min={0} max={1} value={safetyPreference} onChange={(e) => setSafety(Number(e.target.value))} />
        <Label htmlFor="oversight">Oversight support</Label>
        <Input id="oversight" type="number" step="0.01" min={0} max={1} value={oversightSupport} onChange={(e) => setOversight(Number(e.target.value))} />
        <Label htmlFor="coord">Coordination preference</Label>
        <Input id="coord" type="number" step="0.01" min={0} max={1} value={coordinationPreference} onChange={(e) => setCoord(Number(e.target.value))} />
        <Label htmlFor="ready">Pack readiness</Label>
        <Input id="ready" type="number" step="0.01" min={0} max={1} value={packReadiness} onChange={(e) => setReady(Number(e.target.value))} />
        <Button>Create pref run</Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((r) => (
          <li key={r.id} className="row-lift rounded-lg border bg-white p-4">
            <p className="font-semibold">{r.id}</p>
            <p className="text-sm">
              safety {r.safetyPreference} · oversight {r.oversightSupport} · coord {r.coordinationPreference} · ready {r.packReadiness}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default PrefsPage;
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
  safetyOversight: { overall: number };
  innovationSelf: { overall: number };
};

export function ComparePage() {
  const [items, setItems] = useState<Compare[]>([]);
  const [name, setName] = useState("Pack lock compare");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setItems((await api<{ items: Compare[] }>("/api/compare")).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load compares");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name,
          packId: "pack-demo",
          optionId: "option-demo",
          countryId: "country-demo",
          surveyId: "survey-demo",
          prefRunId: "run-demo",
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Compare failed");
    }
  };

  return (
    <StudioShell
      title="Dual compare"
      subtitle="safety_first_public_oversight vs innovation_first_self_regulation"
    >
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
            <p className="text-sm">
              Winner <span className="text-[var(--cp-teal)]">{c.winner}</span> ·
              gap {c.gap}
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase">Safety-first oversight</p>
                <div className="mt-1 h-2 rounded-full bg-[var(--studio-gauze-soft)]">
                  <div
                    className="score-bar h-full rounded-full bg-[var(--cp-teal)]"
                    style={{ width: \`\${c.safetyOversight.overall}%\` }}
                  />
                </div>
                <p className="mt-1 text-sm">{c.safetyOversight.overall}</p>
              </div>
              <div>
                <p className="text-xs uppercase">Innovation-first</p>
                <div className="mt-1 h-2 rounded-full bg-[var(--studio-gauze-soft)]">
                  <div
                    className="score-bar h-full rounded-full bg-[var(--cp-amber)]"
                    style={{ width: \`\${c.innovationSelf.overall}%\` }}
                  />
                </div>
                <p className="mt-1 text-sm">{c.innovationSelf.overall}</p>
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

w(
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
  safetyOversight: { overall: number };
  innovationSelf: { overall: number };
};

export function ScoreboardPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        setItems((await api<{ items: Row[] }>("/api/scoreboard")).items);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load scoreboard");
      }
    })();
  }, []);

  return (
    <StudioShell title="Scoreboard" subtitle="Ranked dual compares by safety-first public-oversight overall.">
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ol className="space-y-3">
        {items.map((c, i) => (
          <li key={c.id} className="row-lift rounded-lg border bg-white p-4">
            <p className="text-xs uppercase text-[var(--cp-teal)]">#{i + 1}</p>
            <h2 className="font-semibold">{c.name}</h2>
            <p className="text-sm">
              {c.winner} · gap {c.gap} · A {c.safetyOversight.overall} · B {c.innovationSelf.overall}
            </p>
          </li>
        ))}
      </ol>
      {items.length === 0 ? (
        <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
          No compares yet — run one on /compare.
        </p>
      ) : null}
    </StudioShell>
  );
}

export default ScoreboardPage;
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
  { title: "Open a policy pack", body: "Start from the seed Safety-First Public Oversight pack.", href: "/packs" },
  { title: "Review options & countries", body: "Public oversight option + seven-country cohort.", href: "/options" },
  { title: "Check survey + pref run", body: "Conjoint batch and soft-sim preference run.", href: "/prefs" },
  { title: "Run dual compare", body: "safety_first_public_oversight vs innovation_first_self_regulation.", href: "/compare" },
  { title: "Read honesty", body: "Confirm soft-sim fence before any lock story.", href: "/honesty" },
] as const;

export function DemoPage() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const runCompare = async () => {
    try {
      const res = await api<{ compare: { winner: string; gap: number } }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo compare",
          packId: "pack-demo",
          optionId: "option-demo",
          countryId: "country-demo",
          surveyId: "survey-demo",
          prefRunId: "run-demo",
        }),
      });
      setResult(\`Winner \${res.compare.winner} · gap \${res.compare.gap}\`);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compare failed");
    }
  };

  const current = STEPS[step];

  return (
    <StudioShell title="Guided demo" subtitle="Five numbered steps through citizen preference soft-sim.">
      <p className="mb-4 text-sm">Step {step + 1} of {STEPS.length}</p>
      <article className="rounded-lg border bg-white p-5">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">{current.title}</h2>
        <p className="mt-2 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">{current.body}</p>
        <Link href={current.href} className="mt-3 inline-block text-sm underline text-[var(--cp-teal)]">Open {current.href}</Link>
      </article>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Back</Button>
        <Button type="button" disabled={step >= STEPS.length - 1} onClick={() => setStep((s) => s + 1)}>Next</Button>
        <Button type="button" onClick={() => void runCompare()}>Run /api/compare</Button>
      </div>
      {result ? <p className="mt-4 text-sm text-[var(--cp-teal)]">{result}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
    </StudioShell>
  );
}

export default DemoPage;
`,
);

w(
  "src/app/onboarding/page.tsx",
  `"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const CHECKS = [
  { id: "pack", label: "Create or open a policy pack", href: "/packs" },
  { id: "option", label: "Configure a regulatory option", href: "/options" },
  { id: "country", label: "Add a country cohort", href: "/countries" },
  { id: "survey", label: "Register a survey batch", href: "/surveys" },
  { id: "compare", label: "Run a dual compare", href: "/compare" },
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
] as const;

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = useMemo(
    () => Math.round((Object.values(done).filter(Boolean).length / CHECKS.length) * 100),
    [done],
  );

  return (
    <StudioShell title="Onboarding" subtitle="Checklist to get a safety-first policy pack soft-sim running.">
      <p className="mb-4 text-sm font-medium">Progress {progress}%</p>
      <div className="mb-6 h-2 rounded-full bg-[var(--studio-gauze-soft)]">
        <div className="score-bar h-full rounded-full bg-[var(--cp-teal)]" style={{ width: \`\${progress}%\` }} />
      </div>
      <ul className="space-y-3">
        {CHECKS.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white p-4">
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={!!done[c.id]}
                onChange={(e) => setDone((d) => ({ ...d, [c.id]: e.target.checked }))}
              />
              {c.label}
            </label>
            <Link href={c.href} className="text-sm underline text-[var(--cp-teal)]">{c.href}</Link>
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
  "src/app/settings/page.tsx",
  `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Org = {
  name: string;
  webhookUrl: string;
  webhookSecret: string;
  bearerToken: string;
  rateLimitPerMinute: number;
};

type Member = { id: string; email: string; role: string };

export function SettingsPage() {
  const [org, setOrg] = useState<Org | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [audit, setAudit] = useState<{ action: string; detail: string; at: string }[]>([]);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const s = await api<{ org: Org; members: Member[] }>("/api/settings");
    setOrg(s.org);
    setMembers(s.members);
    const a = await api<{ items: { action: string; detail: string; at: string }[] }>("/api/audit");
    setAudit(a.items);
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;
    await api("/api/settings", { method: "POST", body: JSON.stringify(org) });
    setMsg("Org saved");
    await load();
  };

  const invite = async () => {
    await api("/api/members", {
      method: "POST",
      body: JSON.stringify({ email, role: "evaluator" }),
    });
    setEmail("");
    await load();
  };

  const exportJson = async () => {
    const text = await api<string>("/api/export?format=json");
    const blob = new Blob([typeof text === "string" ? text : JSON.stringify(text)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "citizen-pref-export.json";
    a.click();
    setMsg("Exported JSON");
  };

  const pingWebhook = async () => {
    const res = await api<{ ok: boolean; id?: string }>("/api/webhook", {
      method: "POST",
      body: JSON.stringify({ demo: true, payload: { event: "pack.soft_sim" } }),
    });
    setMsg(\`Webhook \${res.ok ? "ok" : "fail"} \${res.id ?? ""}\`);
  };

  if (!org) {
    return (
      <StudioShell title="Settings" subtitle="Org, members, export, webhook.">
        <p>Loading…</p>
      </StudioShell>
    );
  }

  return (
    <StudioShell title="Settings" subtitle="Org, members, bearer auth, export, HMAC webhook, audit.">
      <form onSubmit={save} className="mb-8 max-w-lg space-y-3 rounded-lg border bg-white p-4">
        <Label htmlFor="name">Org name</Label>
        <Input id="name" value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} />
        <Label htmlFor="webhook">Webhook URL</Label>
        <Input id="webhook" value={org.webhookUrl} onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })} />
        <Label htmlFor="rl">Rate limit / min</Label>
        <Input id="rl" type="number" value={org.rateLimitPerMinute} onChange={(e) => setOrg({ ...org, rateLimitPerMinute: Number(e.target.value) })} />
        <p className="text-xs">Bearer token: {org.bearerToken}</p>
        <Button>Save org</Button>
      </form>
      <div className="mb-8 flex flex-wrap gap-2">
        <Button type="button" onClick={() => void exportJson()}>Export JSON</Button>
        <Button type="button" variant="outline" onClick={() => void pingWebhook()}>Demo webhook</Button>
      </div>
      <div className="mb-8 flex gap-2">
        <Input placeholder="member@org.local" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="button" onClick={() => void invite()}>Invite</Button>
      </div>
      <ul className="mb-8 space-y-2 text-sm">
        {members.map((m) => (
          <li key={m.id}>{m.email} · {m.role}</li>
        ))}
      </ul>
      <h2 className="font-[family-name:var(--font-display)] text-xl">Audit</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {audit.slice(0, 12).map((a, i) => (
          <li key={\`\${a.at}-\${i}\`}>{a.at} · {a.action} · {a.detail}</li>
        ))}
      </ul>
      {msg ? <p className="mt-4 text-sm text-[var(--cp-teal)]">{msg}</p> : null}
    </StudioShell>
  );
}

export default SettingsPage;
`,
);

// --- APIs ---
const listCreate = (name, listFn, createFn, archiveFn, createBody) => `import { guard, json } from "@/lib/api";
import { ${archiveFn}, ${createFn}, ${listFn} } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    ${listFn}({
      q: url.searchParams.get("q") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      packId: url.searchParams.get("packId") ?? undefined,
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
    const row = ${archiveFn}(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json({ ${name}: row });
  }
  const row = ${createFn}(${createBody});
  if (!row) return json({ error: "bad_request" }, { status: 400 });
  return json({ ${name}: row }, { status: 201 });
}
`;

w(
  "src/app/api/packs/route.ts",
  `import { guard, json } from "@/lib/api";
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
    studyFocus: body.studyFocus ?? "",
    sessionBudget: body.sessionBudget,
    notes: body.notes,
  });
  return json({ pack }, { status: 201 });
}
`,
);

w(
  "src/app/api/options/route.ts",
  listCreate(
    "option",
    "listOptions",
    "createOption",
    "archiveOption",
    `{
    packId: body.packId,
    label: body.label,
    kind: body.kind,
    oversightHint: body.oversightHint ?? "",
    attributeCount: Number(body.attributeCount ?? 5),
    safetyFloor: Number(body.safetyFloor ?? 0.35),
    metricHint: body.metricHint,
    notes: body.notes,
  }`,
  ),
);

w(
  "src/app/api/countries/route.ts",
  listCreate(
    "country",
    "listCountries",
    "createCountry",
    "archiveCountry",
    `{
    packId: body.packId,
    label: body.label,
    region: body.region,
    countryHint: body.countryHint ?? "",
    strataCount: Number(body.strataCount ?? 1),
    prefMin: Number(body.prefMin ?? 0.3),
    prefMax: Number(body.prefMax ?? 0.9),
    metricHint: body.metricHint,
    notes: body.notes,
  }`,
  ),
);

w(
  "src/app/api/surveys/route.ts",
  listCreate(
    "survey",
    "listSurveys",
    "createSurvey",
    "archiveSurvey",
    `{
    packId: body.packId,
    label: body.label,
    mode: body.mode,
    instrumentHint: body.instrumentHint ?? "",
    itemCount: Number(body.itemCount ?? 10),
    responseFloor: Number(body.responseFloor ?? 0.3),
    metricHint: body.metricHint,
    notes: body.notes,
  }`,
  ),
);

w(
  "src/app/api/prefs/route.ts",
  `import { guard, json } from "@/lib/api";
import { createPrefRun, listPrefRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listPrefRuns({
      packId: url.searchParams.get("packId") ?? undefined,
      optionId: url.searchParams.get("optionId") ?? undefined,
      countryId: url.searchParams.get("countryId") ?? undefined,
      surveyId: url.searchParams.get("surveyId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const run = createPrefRun({
    packId: body.packId,
    optionId: body.optionId,
    countryId: body.countryId,
    surveyId: body.surveyId,
    safetyPreference: Number(body.safetyPreference),
    oversightSupport: Number(body.oversightSupport),
    coordinationPreference: Number(body.coordinationPreference),
    packReadiness: Number(body.packReadiness),
    runNotes: body.runNotes,
  });
  if (!run) return json({ error: "refs_not_found" }, { status: 400 });
  return json({ run }, { status: 201 });
}
`,
);

w(
  "src/app/api/compare/route.ts",
  `import { guard, json } from "@/lib/api";
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
    name: body.name ?? "compare",
    packId: body.packId,
    optionId: body.optionId,
    countryId: body.countryId,
    surveyId: body.surveyId,
    prefRunId: body.prefRunId,
    prefBias: body.prefBias ?? body.bias,
    innovationAdherence: body.innovationAdherence,
    innovationTunnel: body.innovationTunnel,
    surveyNoise: body.surveyNoise,
    overclaimRisk: body.overclaimRisk,
  });
  if (!compare) return json({ error: "refs_not_found" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
`,
);

w(
  "src/app/api/scoreboard/route.ts",
  `import { guard, json } from "@/lib/api";
import { getScoreboard } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: getScoreboard() });
}
`,
);

w(
  "src/app/api/settings/route.ts",
  `import { guard, json } from "@/lib/api";
import { getOrg, listMembers, updateOrg } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ org: getOrg(), members: listMembers() });
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  return json({ org: updateOrg(body) });
}
`,
);

w(
  "src/app/api/members/route.ts",
  `import { guard, json } from "@/lib/api";
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
);

w(
  "src/app/api/audit/route.ts",
  `import { guard, json } from "@/lib/api";
import { listAudits } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: listAudits() });
}
`,
);

w(
  "src/app/api/export/route.ts",
  `import { NextResponse } from "next/server";
import { guard } from "@/lib/api";
import { exportComparesCsv, exportPacksJson } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const format = new URL(req.url).searchParams.get("format") ?? "json";
  if (format === "csv") {
    return new NextResponse(exportComparesCsv(), {
      headers: { "content-type": "text/csv; charset=utf-8" },
    });
  }
  return new NextResponse(exportPacksJson(), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export async function POST(req: Request) {
  return GET(req);
}
`,
);

w(
  "src/app/api/webhook/route.ts",
  `import { createHmac } from "node:crypto";
import { json } from "@/lib/api";
import { getOrg, ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const idempotencyKey =
    req.headers.get("x-idempotency-key") ??
    (typeof body === "object" &&
    body &&
    "idempotencyKey" in body &&
    typeof (body as { idempotencyKey?: string }).idempotencyKey === "string"
      ? (body as { idempotencyKey: string }).idempotencyKey
      : crypto.randomUUID());

  const auth = req.headers.get("authorization");
  const org = getOrg();
  if (
    body &&
    typeof body === "object" &&
    "demo" in body &&
    (body as { demo?: boolean }).demo === true &&
    auth === \`Bearer \${org.bearerToken}\`
  ) {
    const payload = (body as { payload?: unknown }).payload ?? {
      event: "pack.soft_sim",
      at: new Date().toISOString(),
    };
    const signature = \`sha256=\${createHmac("sha256", org.webhookSecret)
      .update(JSON.stringify(payload))
      .digest("hex")}\`;
    const result = ingestWebhook(String(idempotencyKey), payload, signature);
    if (!result.ok) {
      return json({ error: result.error }, { status: 401 });
    }
    return json(result, { status: result.duplicate ? 200 : 201 });
  }

  const signature = req.headers.get("x-signature");
  const result = ingestWebhook(String(idempotencyKey), body, signature);
  if (!result.ok) {
    return json({ error: result.error }, { status: 401 });
  }
  return json(result, { status: result.duplicate ? 200 : 201 });
}
`,
);

w(
  "src/app/api/features/route.ts",
  `import { guard, json } from "@/lib/api";
import { featureInventory } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const features = featureInventory();
  return json({ count: features.length, features });
}
`,
);

w(
  "src/app/api/goldens-sample/route.ts",
  `import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ count: GOLDENS.length, sample: GOLDENS.slice(0, 3) });
}
`,
);

console.log("surfaces + apis done");
