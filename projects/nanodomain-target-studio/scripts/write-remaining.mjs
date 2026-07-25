/**
 * Remaining commercial + platform pages, tests, try.html, package scripts.
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
  localized: { overall: number };
  systemic: { overall: number };
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
      subtitle="Ranked soft-sim compares by localized nanodomain overall."
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
                A {row.localized.overall} · B {row.systemic.overall} · winner{" "}
                {row.winner} · gap {row.gap}
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

w(
  "src/app/settings/page.tsx",
  `"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GUIDE_PATH } from "@/claim";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Org = {
  name: string;
  webhookUrl: string;
  webhookSecret: string;
  defaultTargetBias: string;
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
      const [o, m, a] = await Promise.all([
        api<{ org: Org }>("/api/settings"),
        api<{ items: Member[] }>("/api/members"),
        api<{ items: Audit[] }>("/api/audit"),
      ]);
      setOrg(o.org);
      setMembers(m.items);
      setAudits(a.items);
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
      await api("/api/settings", { method: "POST", body: JSON.stringify(org) });
      setMsg("Saved");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Save failed");
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
      setError(x instanceof Error ? x.message : "Invite failed");
    }
  };

  const fireWebhook = async () => {
    try {
      await api("/api/webhook", {
        method: "POST",
        body: JSON.stringify({
          sign: true,
          idempotencyKey: \`demo-\${Date.now()}\`,
          payload: { event: "pack.locked", softSim: true },
        }),
      });
      setMsg("Webhook ingested");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Webhook failed");
    }
  };

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, members, audit, export, and webhook soft-sim controls."
    >
      {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
      {msg ? <p className="mb-3 text-sm text-[var(--nt-teal)]">{msg}</p> : null}
      {org ? (
        <form onSubmit={save} className="mb-8 grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-2">
          <div>
            <Label htmlFor="name">Org name</Label>
            <Input id="name" value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="bias">Default target bias</Label>
            <Input
              id="bias"
              value={org.defaultTargetBias}
              onChange={(e) => setOrg({ ...org, defaultTargetBias: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="wh">Webhook URL</Label>
            <Input id="wh" value={org.webhookUrl} onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="rl">Rate limit / min</Label>
            <Input
              id="rl"
              value={String(org.rateLimitPerMinute)}
              onChange={(e) =>
                setOrg({ ...org, rateLimitPerMinute: Number(e.target.value) || 120 })
              }
            />
          </div>
          <Button>Save org</Button>
        </form>
      ) : null}
      <div className="mb-8 flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={() => void fireWebhook()}>
          Test webhook
        </Button>
        <a href="/api/export?format=json" className="rounded-md border px-3 py-2 text-sm">
          Export packs JSON
        </a>
        <a href="/api/export?format=csv" className="rounded-md border px-3 py-2 text-sm">
          Export compares CSV
        </a>
        <Link href={GUIDE_PATH} className="rounded-md border px-3 py-2 text-sm">
          Tutor guide
        </Link>
      </div>
      <form onSubmit={invite} className="mb-8 flex flex-wrap items-end gap-3 rounded-lg border bg-white p-4">
        <div>
          <Label htmlFor="email">Invite member</Label>
          <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <Button>Invite</Button>
      </form>
      <h2 className="mb-2 font-semibold">Members</h2>
      <ul className="mb-8 space-y-2">
        {members.map((m) => (
          <li key={m.id} className="text-sm">
            {m.email} · {m.role}
          </li>
        ))}
      </ul>
      <h2 className="mb-2 font-semibold">Audit trail</h2>
      <ul className="space-y-2">
        {audits.map((a) => (
          <li key={a.id} className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
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
    name: "Starter",
    price: "$0 method-lab",
    blurb: "Single therapy pack soft-sim for localized nanodomain explores.",
    includes: ["1 therapy pack", "Nanodomain + peptide editors", "A/B compare"],
  },
  {
    name: "Team",
    price: "$490 / seat · hypothetical",
    blurb: "Shared packs, scoreboard, and webhook soft-sim for cardio analytics leads.",
    includes: ["Unlimited packs", "Scoreboard + export", "Members + audit"],
  },
  {
    name: "Site",
    price: "Talk to us · hypothetical",
    blurb: "Org-wide soft-sim for precision-therapy design reviews.",
    includes: ["Org settings", "Rate limits", "HMAC webhooks"],
  },
] as const;

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical method-lab packaging — not a live checkout."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div key={tier.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--nt-crimson)]">
              {tier.name}
            </h2>
            <p className="mt-1 text-sm font-medium">{tier.price}</p>
            <p className="mt-3 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              {tier.blurb}
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
              {tier.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        Soft-sim packaging only — not wet-lab validated IND/NDA, not live patient
        dosing, not clinical heart-failure diagnosis.
      </p>
      <p className="mt-4">
        <Link href="/onboarding" className="underline text-[var(--nt-teal)]">
          Start onboarding
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
import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

const STEPS = [
  {
    title: "Open a therapy pack",
    body: "Start from the seeded Troponin Nanodomain Soft-Sim Pack.",
    href: "/packs",
  },
  {
    title: "Review nanodomain locus",
    body: "Confirm cAMP/PKA localization and diastolic floors.",
    href: "/nanodomains",
  },
  {
    title: "Review peptide pry",
    body: "Confirm PDE pry strength and systolic preservation.",
    href: "/peptides",
  },
  {
    title: "Run A/B compare",
    body: "Score localized nanodomain target against systemic phosphorylation baseline.",
    href: "/compare",
    action: "compare",
  },
  {
    title: "Check scoreboard + honesty",
    body: "Rank soft-sim deltas, then read the honesty fence before any lock talk.",
    href: "/scoreboard",
  },
] as const;

export function DemoPage() {
  const [step, setStep] = useState(0);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const current = STEPS[step];

  const runCompare = async () => {
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name: "Guided demo compare" }),
      });
      setMsg("Compare ran — check scoreboard next.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compare failed");
    }
  };

  return (
    <StudioShell
      title="Guided demo"
      subtitle="Five steps from therapy pack to localized vs systemic compare."
    >
      <ol className="mb-8 space-y-2">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className={
              i === step
                ? "font-semibold text-[var(--nt-crimson)]"
                : "text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]"
            }
          >
            {i + 1}. {s.title}
          </li>
        ))}
      </ol>
      <div className="rounded-lg border bg-white p-5">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">
          Step {step + 1}: {current.title}
        </h2>
        <p className="mt-2 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          {current.body}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={current.href} className="rounded-md border px-3 py-2 text-sm">
            Open {current.href}
          </Link>
          {"action" in current && current.action === "compare" ? (
            <Button type="button" onClick={() => void runCompare()}>
              Run compare now
            </Button>
          ) : null}
        </div>
        {msg ? <p className="mt-3 text-sm text-[var(--nt-teal)]">{msg}</p> : null}
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        <div className="mt-6 flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            Back
          </Button>
          <Button
            type="button"
            disabled={step === STEPS.length - 1}
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          >
            Next
          </Button>
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
import { useMemo, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const CHECKS = [
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
  { id: "pack", label: "Open or create a therapy pack", href: "/packs" },
  { id: "nano", label: "Configure a nanodomain", href: "/nanodomains" },
  { id: "pep", label: "Configure a peptide pry", href: "/peptides" },
  { id: "assay", label: "Create an assay run", href: "/assays" },
  { id: "compare", label: "Run an A/B compare", href: "/compare" },
  { id: "settings", label: "Review org settings / export", href: "/settings" },
] as const;

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = useMemo(
    () => Math.round((Object.values(done).filter(Boolean).length / CHECKS.length) * 100),
    [done],
  );

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist with visible progress for first-run cardio soft-sim setup."
    >
      <p className="mb-2 text-sm font-medium">Progress {progress}%</p>
      <div className="mb-8 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
        <div
          className="score-bar h-full bg-[var(--nt-teal)]"
          style={{ width: \`\${progress}%\` }}
        />
      </div>
      <ul className="space-y-3">
        {CHECKS.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white p-4"
          >
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={!!done[c.id]}
                onChange={(e) =>
                  setDone((d) => ({ ...d, [c.id]: e.target.checked }))
                }
              />
              {c.label}
            </label>
            <Link href={c.href} className="text-sm underline text-[var(--nt-teal)]">
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
    name: "Create therapy pack",
    actor: "Precision-therapy analytics lead",
    job: "Version a soft-sim pack before scoring nanodomain options.",
    steps: "/packs → label + version + therapy focus → active pack",
    success: "Pack appears in registry with version and focus.",
    failure: "Empty label rejected; archived packs stay searchable.",
    href: "/packs",
  },
  {
    name: "Configure nanodomain",
    actor: "Cardio discovery scientist",
    job: "Make cAMP/PKA locus localization and diastolic floors explicit.",
    steps: "/nanodomains → kind + locus + floors → active nanodomain",
    success: "Nanodomain listed with locus hint and floors.",
    failure: "Missing pack id returns bad_pack.",
    href: "/nanodomains",
  },
  {
    name: "Configure peptide pry",
    actor: "Cardio discovery scientist",
    job: "Set PDE pry and systolic preservation floors.",
    steps: "/peptides → kind + pry hint + floors → active peptide",
    success: "Peptide listed with pry and systolic floors.",
    failure: "Bad pack reference blocked.",
    href: "/peptides",
  },
  {
    name: "Run A/B compare",
    actor: "Analytics lead",
    job: "Compare localized nanodomain target vs systemic phosphorylation baseline.",
    steps: "/assays → /compare → dual scores → /scoreboard",
    success: "Winner + gap recorded; scoreboard ranks localized overall.",
    failure: "Missing assay/nanodomain/peptide refs return bad_refs.",
    href: "/compare",
  },
  {
    name: "Export + webhook",
    actor: "Org owner / reviewer",
    job: "Export packs/compares and ingest an HMAC webhook event.",
    steps: "/settings → export JSON/CSV → test webhook → audit trail",
    success: "Export downloads; webhook idempotent; audit shows ingest.",
    failure: "Bad signature rejected; duplicate key returns duplicate.",
    href: "/settings",
  },
] as const;

export function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Five sophisticated journeys for localized cardio nanodomain soft-sim."
    >
      <div className="space-y-6">
        {FLOWS.map((flow) => (
          <article key={flow.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--nt-crimson)]">
              {flow.name}
            </h2>
            <p className="mt-2 text-sm">
              <strong>Actor:</strong> {flow.actor}
            </p>
            <p className="mt-1 text-sm">
              <strong>Job:</strong> {flow.job}
            </p>
            <p className="mt-1 text-sm">
              <strong>Steps:</strong> {flow.steps}
            </p>
            <p className="mt-1 text-sm">
              <strong>Success:</strong> {flow.success}
            </p>
            <p className="mt-1 text-sm">
              <strong>Failure / empty:</strong> {flow.failure}
            </p>
            <p className="mt-3">
              <Link href={flow.href} className="underline text-[var(--nt-teal)]">
                Enter flow
              </Link>
            </p>
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
      title="Honesty fence"
      subtitle="What this soft-sim studio is — and what it is not."
    >
      <div className="space-y-4 rounded-lg border bg-white p-5 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          Nanodomain Target Studio is a method-lab soft-sim bench inspired by
          precision targeting of troponin I phosphorylation via localized
          cAMP/PKA nanodomains. It helps cardio discovery teams compare
          localized targeting to systemic phosphorylation baselines before
          locking a therapy pack narrative.
        </p>
        <p className="font-semibold text-[var(--nt-crimson)]">This is not:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Wet-lab validated IND/NDA evidence</li>
          <li>Live patient dosing or clinical decision support</li>
          <li>Clinical heart-failure diagnosis</li>
          <li>The authors&apos; peptide system or a rebrand of their work</li>
        </ul>
        <p>
          Dual scorers are soft-sim heuristics:{" "}
          <code>localized_nanodomain_target</code> vs{" "}
          <code>systemic_phosphorylation_baseline</code>. Goldens{" "}
          <code>nt-001</code>…<code>nt-030</code> lock dual-impl expectations.
        </p>
        <p>
          Source:{" "}
          <a href={PAPER_URL} className="underline text-[var(--nt-teal)]" target="_blank" rel="noreferrer">
            bioRxiv 10.1101/2025.11.18.689162
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          <Link href="/flows" className="underline text-[var(--nt-teal)]">
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

// Update package.json scripts without BOM
const pkgPath = join(root, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
pkg.scripts = {
  ...pkg.scripts,
  test: "tsx --test test/goldens.test.ts test/store.test.ts test/ui-critical.test.ts",
  "test:app-up": "tsx --test test/app-up.test.ts",
  "test:unit": "tsx --test test/goldens.test.ts test/store.test.ts",
  "gen:goldens": "node scripts/gen-goldens.mjs",
};
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log("updated package.json scripts");

console.log("remaining pages done");
