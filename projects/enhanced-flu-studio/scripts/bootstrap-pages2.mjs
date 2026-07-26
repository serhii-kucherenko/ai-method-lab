/**
 * Remaining pages for Enhanced Flu Studio.
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
  "src/app/outcomes/page.tsx",
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
  coverage65Plus: number;
  eivUptakeShare: number;
  status: string;
};

export function OutcomesPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("pack-demo");
  const [countryId, setCountryId] = useState("country-demo");
  const [programId, setProgramId] = useState("program-demo");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("hospitalizations_averted");
  const [coverage65Plus, setCoverage] = useState("0.7");
  const [eivUptakeShare, setEiv] = useState("0.65");
  const [winterBurdenIndex, setWinter] = useState("0.3");

  const load = async () => {
    try {
      setItems((await api<{ items: Row[] }>("/api/outcomes")).items);
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
      await api("/api/outcomes", {
        method: "POST",
        body: JSON.stringify({
          packId,
          countryId,
          programId,
          label,
          kind,
          coverage65Plus: Number(coverage65Plus),
          eivUptakeShare: Number(eivUptakeShare),
          winterBurdenIndex: Number(winterBurdenIndex),
          assaySignal: 0.7,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Outcomes"
      subtitle="Record outcome metric runs — hospitalizations, GP visits, winter burden — as soft-sim inputs for dual compare."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="packId">Pack id</Label>
          <Input id="packId" value={packId} onChange={(e) => setPackId(e.target.value)} required />
          <Label htmlFor="countryId">Country id</Label>
          <Input id="countryId" value={countryId} onChange={(e) => setCountryId(e.target.value)} required />
          <Label htmlFor="programId">Program id</Label>
          <Input id="programId" value={programId} onChange={(e) => setProgramId(e.target.value)} required />
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Outcome kind</Label>
          <Input id="kind" value={kind} onChange={(e) => setKind(e.target.value)} required />
          <Label htmlFor="coverage">Coverage ≥65</Label>
          <Input id="coverage" value={coverage65Plus} onChange={(e) => setCoverage(e.target.value)} />
          <Label htmlFor="eiv">EIV uptake share</Label>
          <Input id="eiv" value={eivUptakeShare} onChange={(e) => setEiv(e.target.value)} />
          <Label htmlFor="winter">Winter burden</Label>
          <Input id="winter" value={winterBurdenIndex} onChange={(e) => setWinter(e.target.value)} />
          <Button type="submit">Create outcome</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {row.kind} · cov {row.coverage65Plus} · eiv {row.eivUptakeShare} · {row.status}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default OutcomesPage;
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
  expanded: { overall: number };
  baseline: { overall: number };
};

export function ComparePage() {
  const [items, setItems] = useState<Compare[]>([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("Nordic EIV vs policy");
  const [packId, setPackId] = useState("pack-demo");
  const [countryId, setCountryId] = useState("country-demo");
  const [programId, setProgramId] = useState("program-demo");
  const [outcomeId, setOutcomeId] = useState("outcome-demo");

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
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name, packId, countryId, programId, outcomeId }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not compare");
    }
  };

  return (
    <StudioShell
      title="Compare"
      subtitle="Dual A/B: expanded_eiv_program vs current_policy_baseline — soft-sim only."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
        <form onSubmit={run} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Compare name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Label htmlFor="packId">Pack id</Label>
          <Input id="packId" value={packId} onChange={(e) => setPackId(e.target.value)} required />
          <Label htmlFor="countryId">Country id</Label>
          <Input id="countryId" value={countryId} onChange={(e) => setCountryId(e.target.value)} required />
          <Label htmlFor="programId">Program id</Label>
          <Input id="programId" value={programId} onChange={(e) => setProgramId(e.target.value)} required />
          <Label htmlFor="outcomeId">Outcome id</Label>
          <Input id="outcomeId" value={outcomeId} onChange={(e) => setOutcomeId(e.target.value)} required />
          <Button type="submit">Run A/B compare</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.name}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                Winner {row.winner} · gap {row.gap} · expanded {row.expanded.overall} ·
                baseline {row.baseline.overall}
              </p>
            </li>
          ))}
        </ul>
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
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  expanded: { overall: number };
  baseline: { overall: number };
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
      title="Scoreboard"
      subtitle="Rank compares by expanded EIV overall — method-lab soft-sim leaderboard."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="mb-4 flex gap-2">
        <Button asChild variant="outline">
          <Link href="/compare">Run compare</Link>
        </Button>
        <Button asChild variant="outline">
          <a href="/api/export?format=csv">Export CSV</a>
        </Button>
      </div>
      <ol className="space-y-2">
        {items.length === 0 ? (
          <li className="rounded-lg border bg-white px-4 py-6 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
            No compares yet — run an A/B compare to populate the board.
          </li>
        ) : (
          items.map((row, i) => (
            <li key={row.id} className="row-lift flex items-center gap-4 rounded-lg border bg-white px-4 py-3">
              <span className="font-[family-name:var(--font-display)] text-xl text-[var(--ef-teal)]">
                {i + 1}
              </span>
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                  {row.winner} · expanded {row.expanded.overall} · baseline{" "}
                  {row.baseline.overall} · gap {row.gap}
                </p>
              </div>
            </li>
          ))
        )}
      </ol>
    </StudioShell>
  );
}

export default ScoreboardPage;
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
  defaultProgramBias: string;
  defaultMode: string;
  rateLimitPerMinute: number;
};

type Member = { id: string; email: string; role: string };
type Audit = { id: string; at: string; actor: string; action: string; detail: string };

export function SettingsPage() {
  const [org, setOrg] = useState<Org | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const load = async () => {
    try {
      setOrg(await api<Org>("/api/settings"));
      setMembers((await api<{ items: Member[] }>("/api/members")).items);
      setAudits((await api<{ items: Audit[] }>("/api/audit")).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;
    try {
      setOrg(await api<Org>("/api/settings", { method: "POST", body: JSON.stringify(org) }));
      setMsg("Settings saved");
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not save");
    }
  };

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/members", {
        method: "POST",
        body: JSON.stringify({ email, role: "evaluator" }),
      });
      setEmail("");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not invite");
    }
  };

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, members, webhook, audit trail, and export — platform must-haves for vaccine-program analytics."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      {msg ? <p className="mb-4 text-sm text-[var(--ef-teal)]">{msg}</p> : null}
      {org ? (
        <form onSubmit={save} className="mb-10 max-w-lg space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Org name</Label>
          <Input id="name" value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} />
          <Label htmlFor="webhookUrl">Webhook URL</Label>
          <Input
            id="webhookUrl"
            value={org.webhookUrl}
            onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
          />
          <Label htmlFor="bias">Default program bias</Label>
          <Input
            id="bias"
            value={org.defaultProgramBias}
            onChange={(e) => setOrg({ ...org, defaultProgramBias: e.target.value })}
          />
          <Label htmlFor="rl">Rate limit / min</Label>
          <Input
            id="rl"
            type="number"
            value={org.rateLimitPerMinute}
            onChange={(e) =>
              setOrg({ ...org, rateLimitPerMinute: Number(e.target.value) })
            }
          />
          <Button type="submit">Save settings</Button>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button asChild variant="outline" type="button">
              <a href="/api/export?format=json">Export packs JSON</a>
            </Button>
            <Button asChild variant="outline" type="button">
              <a href="/api/export?format=csv">Export compares CSV</a>
            </Button>
          </div>
        </form>
      ) : null}
      <form onSubmit={invite} className="mb-8 flex max-w-lg gap-2">
        <Input
          placeholder="Invite email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit">Invite</Button>
      </form>
      <h2 className="mb-2 font-semibold">Members</h2>
      <ul className="mb-8 space-y-1 text-sm">
        {members.map((m) => (
          <li key={m.id}>
            {m.email} · {m.role}
          </li>
        ))}
      </ul>
      <h2 className="mb-2 font-semibold">Audit</h2>
      <ul className="space-y-1 text-sm">
        {audits.slice(0, 12).map((a) => (
          <li key={a.id}>
            {a.at} · {a.actor} · {a.action} · {a.detail}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default SettingsPage;
`,
);

w(
  "src/app/pricing/page.tsx",
  `import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Pilot",
    price: "$0 method-lab",
    includes: ["1 org", "Demo pack", "30 goldens browser", "Honesty fence"],
  },
  {
    name: "Program desk",
    price: "$480 / seat / yr (hypothetical)",
    includes: [
      "Unlimited program packs",
      "Country + program workspaces",
      "Dual A/B compare",
      "Scoreboard + CSV export",
    ],
  },
  {
    name: "Agency license",
    price: "$12k / site / yr (hypothetical)",
    includes: [
      "Multi-country Nordic parity",
      "Webhook + audit",
      "Member roles",
      "Priority soft-sim review",
    ],
  },
];

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical Method Lab packaging for vaccine-program analytics desks — not live checkout."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <div key={t.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ef-teal)]">
              {t.name}
            </h2>
            <p className="mt-2 text-sm font-medium">{t.price}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              {t.includes.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm">
        <Link href="/onboarding" className="underline text-[var(--ef-teal)]">
          Start onboarding
        </Link>
        {" · "}
        Method-lab packaging only — not a live payment product.
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
  "Open the seeded Nordic EIV program pack",
  "Review the Sweden country scenario",
  "Confirm the expanded EIV 65+ program spec",
  "Inspect the hospitalizations outcome run",
  "Run expanded EIV vs current policy compare",
];

export function DemoPage() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const runCompare = async () => {
    try {
      const row = await api<{
        winner: string;
        gap: number;
        expanded: { overall: number };
        baseline: { overall: number };
      }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo Nordic EIV vs policy",
          packId: "pack-demo",
          countryId: "country-demo",
          programId: "program-demo",
          outcomeId: "outcome-demo",
        }),
      });
      setResult(
        \`Winner \${row.winner} · gap \${row.gap} · expanded \${row.expanded.overall} · baseline \${row.baseline.overall}\`,
      );
      setStep(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compare failed");
    }
  };

  return (
    <StudioShell
      title="Demo"
      subtitle="Guided walkthrough of the core happy path — create context, score outcomes, dual-compare."
    >
      <ol className="mb-6 space-y-3">
        {STEPS.map((s, i) => (
          <li
            key={s}
            className={\`rounded-lg border px-4 py-3 \${i === step ? "border-[var(--ef-teal)] bg-white" : "bg-white/70"}\`}
          >
            <span className="mr-2 font-[family-name:var(--font-display)] text-[var(--ef-teal)]">
              {i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))}>
          Back
        </Button>
        <Button
          type="button"
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
        >
          Next step
        </Button>
        <Button type="button" onClick={() => void runCompare()}>
          Run demo compare
        </Button>
        <Button asChild variant="outline">
          <Link href="/packs">Open packs</Link>
        </Button>
      </div>
      {result ? <p className="mt-4 text-sm text-[var(--ef-teal)]">{result}</p> : null}
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
import { Button } from "@/components/ui/button";

const ITEMS = [
  { id: "pack", label: "Create or open a program pack", href: "/packs" },
  { id: "country", label: "Configure a country scenario", href: "/countries" },
  { id: "program", label: "Define an EIV program spec", href: "/programs" },
  { id: "outcome", label: "Add an outcome metric run", href: "/outcomes" },
  { id: "compare", label: "Run expanded vs baseline compare", href: "/compare" },
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
];

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = useMemo(
    () => Math.round((Object.values(done).filter(Boolean).length / ITEMS.length) * 100),
    [done],
  );

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist for vaccine-program analytics leads — progress is local until you export."
    >
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--studio-gauze-soft)]">
          <div
            className="h-full bg-[var(--ef-teal)] transition-all"
            style={{ width: \`\${progress}%\` }}
          />
        </div>
      </div>
      <ul className="space-y-3">
        {ITEMS.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white px-4 py-3"
          >
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={!!done[item.id]}
                onChange={(e) =>
                  setDone((d) => ({ ...d, [item.id]: e.target.checked }))
                }
              />
              {item.label}
            </label>
            <Button asChild variant="outline" size="sm">
              <Link href={item.href}>Open</Link>
            </Button>
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
  "src/app/flows/page.tsx",
  `import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const FLOWS = [
  {
    name: "Create program pack",
    actor: "Program analytics lead",
    job: "Version a Nordic EIV expansion soft-sim pack",
    pages: "/packs → /settings",
    success: "Active pack listed with program focus",
    failure: "Missing label/version blocks create",
    href: "/packs",
  },
  {
    name: "Configure country scenario",
    actor: "Public-health analyst",
    job: "Make country ≥65 coverage and parity floors explicit",
    pages: "/countries → /packs",
    success: "Country row active under a pack",
    failure: "Bad pack id returns error",
    href: "/countries",
  },
  {
    name: "Configure outcome metrics",
    actor: "Health-econ modeler",
    job: "Attach hospitalizations / winter-burden outcomes to pack+country+program",
    pages: "/programs → /outcomes",
    success: "Outcome run with coverage and EIV share",
    failure: "Missing refs reject create",
    href: "/outcomes",
  },
  {
    name: "Run A/B compare",
    actor: "Vaccine-program lead",
    job: "Compare expanded_eiv_program vs current_policy_baseline",
    pages: "/compare → /scoreboard",
    success: "Winner + gap on scoreboard",
    failure: "Empty refs show error; empty board message",
    href: "/compare",
  },
  {
    name: "Export + webhook",
    actor: "Org owner / reviewer",
    job: "Export packs/compares and ingest idempotent webhook events",
    pages: "/settings → /api/export → /api/webhook",
    success: "JSON/CSV download + audit trail",
    failure: "Missing auth or idempotency key fails",
    href: "/settings",
  },
];

export function FlowsPage() {
  return (
    <StudioShell
      title="Flows"
      subtitle="Five named journeys for Enhanced Flu Studio — not a single happy path."
    >
      <div className="space-y-4">
        {FLOWS.map((f) => (
          <article key={f.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ef-teal)]">
              {f.name}
            </h2>
            <dl className="mt-3 grid gap-2 text-sm md:grid-cols-2">
              <div>
                <dt className="font-medium">Actor</dt>
                <dd className="text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                  {f.actor}
                </dd>
              </div>
              <div>
                <dt className="font-medium">Job</dt>
                <dd className="text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                  {f.job}
                </dd>
              </div>
              <div>
                <dt className="font-medium">Steps</dt>
                <dd className="text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                  {f.pages}
                </dd>
              </div>
              <div>
                <dt className="font-medium">Success</dt>
                <dd className="text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                  {f.success}
                </dd>
              </div>
              <div className="md:col-span-2">
                <dt className="font-medium">Failure / empty</dt>
                <dd className="text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                  {f.failure}
                </dd>
              </div>
            </dl>
            <Button asChild className="mt-4" variant="outline">
              <Link href={f.href}>Start flow</Link>
            </Button>
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
      subtitle="What this Method Lab product is — and is not."
    >
      <div className="max-w-2xl space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_70%,transparent)]">
        <p>
          Enhanced Flu Studio is a soft-simulation bench for comparing expanded
          enhanced influenza vaccine programs for adults ≥65 against current
          national policy baselines.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not live immunization logistics or appointment booking</li>
          <li>Not clinical prescribing or dose selection for patients</li>
          <li>Not national policy adoption or official recommendation tooling</li>
          <li>Not a rebrand of the authors&apos; Nordic EIV model</li>
        </ul>
        <p>
          Inspired by{" "}
          <a href={PAPER_URL} className="underline text-[var(--ef-teal)]">
            Vaccine 10.1016/j.vaccine.2026.128934
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          <Link href="/flows" className="underline text-[var(--ef-teal)]">
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

console.log("pages2 done");
