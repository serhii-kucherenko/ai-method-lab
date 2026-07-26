/**
 * Remaining Ageing Wisely pages, tests, try.html.
 * Run: node scripts/write-remaining.mjs
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
  "src/app/sessions/page.tsx",
  `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = Record<string, string | number | undefined> & { id: string; label: string };
type Ref = { id: string; label: string };

export function SessionsPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [packs, setPacks] = useState<Ref[]>([]);
  const [cohorts, setCohorts] = useState<Ref[]>([]);
  const [modules, setModules] = useState<Ref[]>([]);
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("");
  const [cohortId, setCohortId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("guided_checkin");
  const [therapistSupportFidelity, setTherapistSupportFidelity] = useState("0.7");
  const [moduleCompletion, setModuleCompletion] = useState("0.65");
  const [engagementAdherence, setEngagementAdherence] = useState("0.7");
  const [sessionSignal, setSessionSignal] = useState("0.7");

  const load = async () => {
    try {
      const [sessions, packList, cohortList, moduleList] = await Promise.all([
        api<{ items: Row[] }>("/api/sessions"),
        api<{ items: Ref[] }>("/api/packs"),
        api<{ items: Ref[] }>("/api/cohorts"),
        api<{ items: Ref[] }>("/api/modules"),
      ]);
      setItems(sessions.items);
      setPacks(packList.items);
      setCohorts(cohortList.items);
      setModules(moduleList.items);
      if (!packId && packList.items[0]) setPackId(packList.items[0].id);
      if (!cohortId && cohortList.items[0]) setCohortId(cohortList.items[0].id);
      if (!moduleId && moduleList.items[0]) setModuleId(moduleList.items[0].id);
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
      await api("/api/sessions", {
        method: "POST",
        body: JSON.stringify({
          packId,
          cohortId,
          moduleId,
          label,
          kind,
          therapistSupportFidelity: Number(therapistSupportFidelity),
          moduleCompletion: Number(moduleCompletion),
          engagementAdherence: Number(engagementAdherence),
          sessionSignal: Number(sessionSignal),
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Sessions"
      subtitle="Soft-sim session runs for therapist-supported iCBT — not live therapy or clinical diagnosis."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="pack">Pack</Label>
          <select id="pack" className="w-full rounded-md border px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)}>
            {packs.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <Label htmlFor="cohort">Cohort</Label>
          <select id="cohort" className="w-full rounded-md border px-3 py-2 text-sm" value={cohortId} onChange={(e) => setCohortId(e.target.value)}>
            {cohorts.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <Label htmlFor="module">Module</Label>
          <select id="module" className="w-full rounded-md border px-3 py-2 text-sm" value={moduleId} onChange={(e) => setModuleId(e.target.value)}>
            {modules.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Kind</Label>
          <Input id="kind" value={kind} onChange={(e) => setKind(e.target.value)} required />
          <Label htmlFor="support">Therapist support fidelity</Label>
          <Input id="support" value={therapistSupportFidelity} onChange={(e) => setTherapistSupportFidelity(e.target.value)} />
          <Label htmlFor="completion">Module completion</Label>
          <Input id="completion" value={moduleCompletion} onChange={(e) => setModuleCompletion(e.target.value)} />
          <Label htmlFor="engagement">Engagement adherence</Label>
          <Input id="engagement" value={engagementAdherence} onChange={(e) => setEngagementAdherence(e.target.value)} />
          <Label htmlFor="signal">Session signal</Label>
          <Input id="signal" value={sessionSignal} onChange={(e) => setSessionSignal(e.target.value)} />
          <Button type="submit">Create</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                support {row.therapistSupportFidelity as number} · completion {row.moduleCompletion as number} · engagement {row.engagementAdherence as number}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default SessionsPage;
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

type Ref = { id: string; label: string };
type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  therapist: { overall: number; supportScore: number };
  waitlist: { overall: number; supportScore: number };
};

export function ComparePage() {
  const [packs, setPacks] = useState<Ref[]>([]);
  const [cohorts, setCohorts] = useState<Ref[]>([]);
  const [modules, setModules] = useState<Ref[]>([]);
  const [sessions, setSessions] = useState<Ref[]>([]);
  const [items, setItems] = useState<Compare[]>([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("Therapist vs waitlist");
  const [packId, setPackId] = useState("");
  const [cohortId, setCohortId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [sessionRunId, setSessionRunId] = useState("");
  const [careBias, setCareBias] = useState("balanced");

  const load = async () => {
    try {
      const [packList, cohortList, moduleList, sessionList, compares] = await Promise.all([
        api<{ items: Ref[] }>("/api/packs"),
        api<{ items: Ref[] }>("/api/cohorts"),
        api<{ items: Ref[] }>("/api/modules"),
        api<{ items: Ref[] }>("/api/sessions"),
        api<{ items: Compare[] }>("/api/compare"),
      ]);
      setPacks(packList.items);
      setCohorts(cohortList.items);
      setModules(moduleList.items);
      setSessions(sessionList.items);
      setItems(compares.items);
      if (!packId && packList.items[0]) setPackId(packList.items[0].id);
      if (!cohortId && cohortList.items[0]) setCohortId(cohortList.items[0].id);
      if (!moduleId && moduleList.items[0]) setModuleId(moduleList.items[0].id);
      if (!sessionRunId && sessionList.items[0]) setSessionRunId(sessionList.items[0].id);
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
        body: JSON.stringify({ name, packId, cohortId, moduleId, sessionRunId, careBias }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not compare");
    }
  };

  return (
    <StudioShell
      title="Compare"
      subtitle="Dual soft-sim: therapist-supported iCBT (A) versus waitlist / self-guided baseline (B)."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
        <form onSubmit={run} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Compare name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Label htmlFor="pack">Pack</Label>
          <select id="pack" className="w-full rounded-md border px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)}>
            {packs.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="cohort">Cohort</Label>
          <select id="cohort" className="w-full rounded-md border px-3 py-2 text-sm" value={cohortId} onChange={(e) => setCohortId(e.target.value)}>
            {cohorts.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="module">Module</Label>
          <select id="module" className="w-full rounded-md border px-3 py-2 text-sm" value={moduleId} onChange={(e) => setModuleId(e.target.value)}>
            {modules.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="session">Session</Label>
          <select id="session" className="w-full rounded-md border px-3 py-2 text-sm" value={sessionRunId} onChange={(e) => setSessionRunId(e.target.value)}>
            {sessions.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="bias">Care bias</Label>
          <select id="bias" className="w-full rounded-md border px-3 py-2 text-sm" value={careBias} onChange={(e) => setCareBias(e.target.value)}>
            <option value="balanced">balanced</option>
            <option value="therapist_first">therapist_first</option>
            <option value="self_guided_first">self_guided_first</option>
            <option value="waitlist_first">waitlist_first</option>
          </select>
          <Button type="submit">Run A/B compare</Button>
        </form>
        <ul className="space-y-3">
          {items.map((row) => (
            <li key={row.id} className="rounded-lg border bg-white p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium">{row.name}</p>
                <p className="text-sm text-[var(--aw-sage)]">winner {row.winner} · gap {row.gap}</p>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[color-mix(in_srgb,var(--studio-ink)_50%,transparent)]">Therapist-supported</p>
                  <div className="mt-1 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
                    <div className="score-bar h-full bg-[var(--aw-sage)]" style={{ width: \`\${row.therapist.overall}%\` }} />
                  </div>
                  <p className="mt-1 text-sm">{row.therapist.overall}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-[color-mix(in_srgb,var(--studio-ink)_50%,transparent)]">Waitlist / self-guided</p>
                  <div className="mt-1 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
                    <div className="score-bar h-full bg-[var(--aw-amber)]" style={{ width: \`\${row.waitlist.overall}%\` }} />
                  </div>
                  <p className="mt-1 text-sm">{row.waitlist.overall}</p>
                </div>
              </div>
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
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  therapist: { overall: number };
  waitlist: { overall: number };
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
      subtitle="Ranked soft-sim compares by therapist-supported iCBT overall score."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <table className="w-full overflow-hidden rounded-lg border bg-white text-left text-sm">
        <thead className="bg-[var(--studio-gauze-soft)]">
          <tr>
            <th className="px-4 py-3">Compare</th>
            <th className="px-4 py-3">Therapist</th>
            <th className="px-4 py-3">Waitlist</th>
            <th className="px-4 py-3">Winner</th>
            <th className="px-4 py-3">Gap</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr key={row.id} className="border-t">
              <td className="px-4 py-3">{row.name}</td>
              <td className="px-4 py-3">{row.therapist.overall}</td>
              <td className="px-4 py-3">{row.waitlist.overall}</td>
              <td className="px-4 py-3">{row.winner}</td>
              <td className="px-4 py-3">{row.gap}</td>
            </tr>
          ))}
          {items.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]" colSpan={5}>
                No compares yet — run one from Compare.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </StudioShell>
  );
}

export default ScoreboardPage;
`,
);

w(
  "src/app/pricing/page.tsx",
  `import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Pilot desk",
    price: "$0 method-lab",
    includes: ["1 care pack", "Dual A/B soft-sim", "Honesty fence", "try.html"],
  },
  {
    name: "Care analytics",
    price: "$1.2k / seat / yr (hypothetical)",
    includes: ["Unlimited packs", "Cohorts + modules + sessions", "Scoreboard", "Export JSON/CSV"],
  },
  {
    name: "Delivery network",
    price: "Site license (hypothetical)",
    includes: ["Org members", "HMAC webhooks", "Audit trail", "Rate limits"],
  },
];

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical method-lab packaging for geriatric digital mental-health analytics — not live checkout."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div key={tier.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">{tier.name}</h2>
            <p className="mt-2 text-[var(--aw-sage)]">{tier.price}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              {tier.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm">
        <Link href="/onboarding" className="underline text-[var(--aw-sage)]">
          Start onboarding
        </Link>
        {" · "}
        <Link href="/honesty" className="underline text-[var(--aw-sage)]">
          Read honesty
        </Link>
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
import Link from "next/link";
import { useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const STEPS = [
  { title: "Open a care pack", body: "Start from Packs and version the older-adult iCBT soft-sim context.", href: "/packs" },
  { title: "Configure a cohort", body: "Set inclusion hints and support floors for the soft-sim cohort.", href: "/cohorts" },
  { title: "Shape the module path", body: "Choose psychoeducation, activation, or restructuring paths.", href: "/modules" },
  { title: "Log a session soft-sim", body: "Capture therapist support fidelity and engagement signals.", href: "/sessions" },
  { title: "Run A/B compare", body: "Score therapist-supported iCBT against waitlist / self-guided.", href: "/compare" },
];

export function DemoPage() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  return (
    <StudioShell
      title="Demo"
      subtitle="Guided walkthrough of the core care-pack → compare happy path."
    >
      <p className="mb-4 text-sm text-[var(--aw-sage)]">
        Step {step + 1} of {STEPS.length}
      </p>
      <div className="rounded-lg border bg-white p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">{current.title}</h2>
        <p className="mt-2 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">{current.body}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
          <Button type="button" disabled={step === STEPS.length - 1} onClick={() => setStep((s) => s + 1)}>
            Next
          </Button>
          <Link href={current.href} className="rounded-md bg-[var(--aw-sage)] px-3 py-2 text-sm text-white">
            Open step
          </Link>
        </div>
      </div>
    </StudioShell>
  );
}

export default DemoPage;
`,
);

w(
  "src/app/onboarding/page.tsx",
  `"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

const CHECKS = [
  { id: "pack", label: "Create or confirm a care pack", href: "/packs" },
  { id: "cohort", label: "Add a cohort soft-sim", href: "/cohorts" },
  { id: "module", label: "Add a module path", href: "/modules" },
  { id: "session", label: "Log a session run", href: "/sessions" },
  { id: "compare", label: "Run one A/B compare", href: "/compare" },
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
];

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const [packs, cohorts, modules, sessions, compares] = await Promise.all([
          api<{ total: number }>("/api/packs"),
          api<{ total: number }>("/api/cohorts"),
          api<{ total: number }>("/api/modules"),
          api<{ total: number }>("/api/sessions"),
          api<{ items: unknown[] }>("/api/compare"),
        ]);
        setDone({
          pack: packs.total > 0,
          cohort: cohorts.total > 0,
          module: modules.total > 0,
          session: sessions.total > 0,
          compare: compares.items.length > 0,
          honesty: true,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load");
      }
    })();
  }, []);

  const progress = CHECKS.filter((c) => done[c.id]).length;

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist with visible progress for first-run geriatric care soft-sim setup."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <p className="mb-4 text-sm text-[var(--aw-sage)]">
        {progress} / {CHECKS.length} complete
      </p>
      <div className="mb-6 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
        <div
          className="score-bar h-full bg-[var(--aw-sage)]"
          style={{ width: \`\${(progress / CHECKS.length) * 100}%\` }}
        />
      </div>
      <ul className="space-y-3">
        {CHECKS.map((c) => (
          <li key={c.id} className="flex items-center justify-between rounded-lg border bg-white px-4 py-3">
            <span>
              {done[c.id] ? "✓ " : "○ "}
              {c.label}
            </span>
            <Link href={c.href} className="text-sm underline text-[var(--aw-sage)]">
              Open
            </Link>
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

const FLOWS = [
  {
    name: "Create care pack",
    actor: "Care analytics lead",
    job: "Version a soft-sim care pack before cohort work",
    steps: "Landing → Packs → create → confirm in list",
    success: "Active pack with version and care focus",
    failure: "Empty label rejected; archived packs filtered",
    href: "/packs",
  },
  {
    name: "Configure cohort",
    actor: "Delivery analyst",
    job: "Make older-adult inclusion soft-sim explicit",
    steps: "Packs → Cohorts → set floors → save",
    success: "Cohort linked to pack with support floor",
    failure: "Missing pack id returns bad_pack",
    href: "/cohorts",
  },
  {
    name: "Configure module path",
    actor: "Program designer",
    job: "Shape internet CBT module path soft-sim",
    steps: "Modules → path hint → engagement floor → save",
    success: "Module active on the pack",
    failure: "Invalid pack blocks create",
    href: "/modules",
  },
  {
    name: "Run A/B compare",
    actor: "Evaluator",
    job: "Score therapist-supported iCBT vs waitlist baseline",
    steps: "Sessions → Compare → run → Scoreboard",
    success: "Winner + gap recorded on scoreboard",
    failure: "Missing session refs return bad_refs",
    href: "/compare",
  },
  {
    name: "Export + webhook",
    actor: "Org owner",
    job: "Export compares and prove HMAC webhook ingest",
    steps: "Settings → set secret → Export → webhook POST",
    success: "JSON/CSV download + idempotent webhook ack",
    failure: "Bad signature rejected; duplicate key returns 200",
    href: "/settings",
  },
];

export function FlowsPage() {
  return (
    <StudioShell
      title="Flows"
      subtitle="Five sophisticated journeys for therapist-supported older-adult iCBT soft-sim."
    >
      <div className="space-y-4">
        {FLOWS.map((flow) => (
          <article key={flow.name} className="rounded-lg border bg-white p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-[family-name:var(--font-display)] text-xl">{flow.name}</h2>
              <Link href={flow.href} className="text-sm underline text-[var(--aw-sage)]">
                Enter
              </Link>
            </div>
            <dl className="mt-3 grid gap-2 text-sm md:grid-cols-2">
              <div><dt className="font-medium">Actor</dt><dd>{flow.actor}</dd></div>
              <div><dt className="font-medium">Job</dt><dd>{flow.job}</dd></div>
              <div><dt className="font-medium">Steps</dt><dd>{flow.steps}</dd></div>
              <div><dt className="font-medium">Success</dt><dd>{flow.success}</dd></div>
              <div className="md:col-span-2"><dt className="font-medium">Failure / empty</dt><dd>{flow.failure}</dd></div>
            </dl>
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
      subtitle="What this soft-sim studio is — and what it is not."
    >
      <div className="max-w-2xl space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          Ageing Wisely Studio is a method-lab soft-simulation bench inspired by
          therapist-supported internet CBT co-design and RCT patterns for older
          adults. It is <strong>not</strong> clinical diagnosis, <strong>not</strong> a
          live therapist replacement, and <strong>not</strong> regulated digital
          therapeutic clearance.
        </p>
        <p>
          Scores are deterministic soft-sim heuristics for comparing
          therapist-supported iCBT designs against waitlist or self-guided
          baselines. They are not patient outcomes, not clinical endpoints, and
          not a rebrand of the authors&apos; Ageing Wisely Online program.
        </p>
        <p>
          Source paper:{" "}
          <a href={PAPER_URL} className="underline text-[var(--aw-sage)]">
            PsyArXiv hukx9
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          <Link href="/flows" className="underline text-[var(--aw-sage)]">
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
  defaultCareBias: string;
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
  const [exportMsg, setExportMsg] = useState("");

  const load = async () => {
    try {
      const [settings, memberList, auditList] = await Promise.all([
        api<{ org: Org }>("/api/settings"),
        api<{ items: Member[] }>("/api/members"),
        api<{ items: Audit[] }>("/api/audit"),
      ]);
      setOrg(settings.org);
      setMembers(memberList.items);
      setAudits(auditList.items);
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
      const res = await api<{ org: Org }>("/api/settings", {
        method: "POST",
        body: JSON.stringify(org),
      });
      setOrg(res.org);
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not save");
    }
  };

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/members", {
        method: "POST",
        body: JSON.stringify({ email, role: "viewer" }),
      });
      setEmail("");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not invite");
    }
  };

  const doExport = async (format: "json" | "csv") => {
    try {
      const text = await api<string>(\`/api/export?format=\${format}\`);
      setExportMsg(\`Exported \${format} (\${text.length} chars)\`);
    } catch (x) {
      setError(x instanceof Error ? x.message : "Export failed");
    }
  };

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, members, audit, export, and webhook configuration for the care soft-sim bench."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      {org ? (
        <form onSubmit={save} className="mb-8 max-w-lg space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Org name</Label>
          <Input id="name" value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} />
          <Label htmlFor="webhook">Webhook URL</Label>
          <Input id="webhook" value={org.webhookUrl} onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })} />
          <Label htmlFor="secret">Webhook secret</Label>
          <Input id="secret" value={org.webhookSecret} onChange={(e) => setOrg({ ...org, webhookSecret: e.target.value })} />
          <Label htmlFor="bias">Default care bias</Label>
          <Input id="bias" value={org.defaultCareBias} onChange={(e) => setOrg({ ...org, defaultCareBias: e.target.value })} />
          <Label htmlFor="rate">Rate limit / minute</Label>
          <Input
            id="rate"
            value={String(org.rateLimitPerMinute)}
            onChange={(e) => setOrg({ ...org, rateLimitPerMinute: Number(e.target.value) })}
          />
          <Button type="submit">Save org</Button>
        </form>
      ) : null}
      <form onSubmit={invite} className="mb-8 flex max-w-lg gap-2">
        <Input placeholder="member@org.local" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Button type="submit">Invite</Button>
      </form>
      <ul className="mb-8 space-y-1 text-sm">
        {members.map((m) => (
          <li key={m.id}>{m.email} · {m.role}</li>
        ))}
      </ul>
      <div className="mb-8 flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => void doExport("json")}>Export packs JSON</Button>
        <Button type="button" variant="outline" onClick={() => void doExport("csv")}>Export compares CSV</Button>
        {exportMsg ? <span className="text-sm text-[var(--aw-sage)]">{exportMsg}</span> : null}
      </div>
      <h2 className="mb-2 font-[family-name:var(--font-display)] text-xl">Audit</h2>
      <ul className="space-y-2 text-sm">
        {audits.map((a) => (
          <li key={a.id} className="rounded border bg-white px-3 py-2">
            {a.at} · {a.actor} · {a.action} — {a.detail}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        Guide: docs/guides/136-ageing-wisely-studio-lessons.md · Offline demo: try.html
      </p>
    </StudioShell>
  );
}

export default SettingsPage;
`,
);

console.log("remaining pages done");
