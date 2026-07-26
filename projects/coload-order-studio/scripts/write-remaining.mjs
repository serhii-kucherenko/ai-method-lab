/**
 * Write remaining Coload Order Studio surfaces.
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
  ordered: { overall: number; orderScore: number; chemoScore: number };
  simultaneous: { overall: number; synergyScore: number; leakPenalty: number };
};

export function ComparePage() {
  const [items, setItems] = useState<Compare[]>([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("Ordered vs simultaneous");
  const [packId, setPackId] = useState("pack-demo");
  const [carrierId, setCarrierId] = useState("carrier-demo");
  const [loadId, setLoadId] = useState("load-demo");
  const [assayRunId, setAssayRunId] = useState("assay-demo");
  const [loadBias, setLoadBias] = useState("chemo_first");

  const refresh = async () => {
    try {
      setItems((await api<{ items: Compare[] }>("/api/compare")).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name,
          packId,
          carrierId,
          loadId,
          assayRunId,
          loadBias,
        }),
      });
      await refresh();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Compare failed");
    }
  };

  return (
    <StudioShell
      title="Dual compare"
      subtitle="Scorer A ordered_coload_sequence vs scorer B simultaneous_load_baseline."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
        <form onSubmit={run} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Compare name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Label htmlFor="packId">Pack</Label>
          <Input id="packId" value={packId} onChange={(e) => setPackId(e.target.value)} />
          <Label htmlFor="carrierId">Carrier</Label>
          <Input id="carrierId" value={carrierId} onChange={(e) => setCarrierId(e.target.value)} />
          <Label htmlFor="loadId">Load</Label>
          <Input id="loadId" value={loadId} onChange={(e) => setLoadId(e.target.value)} />
          <Label htmlFor="assay">Assay</Label>
          <Input id="assay" value={assayRunId} onChange={(e) => setAssayRunId(e.target.value)} />
          <Label htmlFor="bias">Load bias</Label>
          <Input id="bias" value={loadBias} onChange={(e) => setLoadBias(e.target.value)} />
          <Button type="submit">Run A/B compare</Button>
        </form>
        <ul className="space-y-3">
          {items.map((c) => (
            <li key={c.id} className="rounded-lg border bg-white p-4">
              <p className="font-medium">{c.name}</p>
              <p className="mt-1 text-sm">
                Winner: <span className="text-[var(--co-amber)]">{c.winner}</span> · gap{" "}
                {c.gap}
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[var(--co-slate)]">
                    Ordered co-load
                  </p>
                  <div className="mt-1 h-2 rounded bg-[var(--co-mist)]">
                    <div
                      className="score-bar h-2 rounded bg-[var(--co-amber)]"
                      style={{ width: \`\${c.ordered.overall}%\` }}
                    />
                  </div>
                  <p className="mt-1 text-sm">{c.ordered.overall}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-[var(--co-slate)]">
                    Simultaneous baseline
                  </p>
                  <div className="mt-1 h-2 rounded bg-[var(--co-mist)]">
                    <div
                      className="score-bar h-2 rounded bg-[var(--co-slate)]"
                      style={{ width: \`\${c.simultaneous.overall}%\` }}
                    />
                  </div>
                  <p className="mt-1 text-sm">{c.simultaneous.overall}</p>
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
  ordered: { overall: number };
  simultaneous: { overall: number };
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
      subtitle="Ordered co-load soft-sim leaderboard — method-lab only."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--co-line)]">
            <th className="py-2 pr-3">Compare</th>
            <th className="py-2 pr-3">Ordered</th>
            <th className="py-2 pr-3">Simultaneous</th>
            <th className="py-2 pr-3">Winner</th>
            <th className="py-2">Gap</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.id} className="border-b border-[var(--co-line)]/60">
              <td className="py-2 pr-3">{r.name}</td>
              <td className="py-2 pr-3">{r.ordered.overall}</td>
              <td className="py-2 pr-3">{r.simultaneous.overall}</td>
              <td className="py-2 pr-3">{r.winner}</td>
              <td className="py-2">{r.gap}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
          No compares yet — run one from /compare.
        </p>
      ) : null}
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
  defaultLoadBias: string;
  rateLimitPerMinute: number;
};
type Member = { id: string; email: string; role: string };
type Audit = { id: string; at: string; actor: string; action: string; detail: string };

export function SettingsPage() {
  const [org, setOrg] = useState<Org | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const refresh = async () => {
    const s = await api<{
      org: Org;
      members: Member[];
      audits: Audit[];
    }>("/api/settings");
    setOrg(s.org);
    setMembers(s.members);
    setAudits(s.audits);
  };

  useEffect(() => {
    void refresh().catch((e) => setMsg(e instanceof Error ? e.message : "Error"));
  }, []);

  if (!org) {
    return (
      <StudioShell title="Settings" subtitle="Org, members, audit, export, webhooks.">
        <p>{msg || "Loading…"}</p>
      </StudioShell>
    );
  }

  return (
    <StudioShell title="Settings" subtitle="Org, members, audit, export, webhooks.">
      {msg ? <p className="mb-4 text-sm text-[var(--co-slate)]">{msg}</p> : null}
      <div className="grid gap-8 lg:grid-cols-2">
        <form
          className="space-y-3 rounded-lg border bg-white p-4"
          onSubmit={async (e) => {
            e.preventDefault();
            await api("/api/settings", {
              method: "POST",
              body: JSON.stringify({ action: "updateOrg", org }),
            });
            setMsg("Org saved");
            await refresh();
          }}
        >
          <Label htmlFor="orgName">Org name</Label>
          <Input
            id="orgName"
            value={org.name}
            onChange={(e) => setOrg({ ...org, name: e.target.value })}
          />
          <Label htmlFor="webhook">Webhook URL</Label>
          <Input
            id="webhook"
            value={org.webhookUrl}
            onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
          />
          <Label htmlFor="bias">Default load bias</Label>
          <Input
            id="bias"
            value={org.defaultLoadBias}
            onChange={(e) => setOrg({ ...org, defaultLoadBias: e.target.value })}
          />
          <Button type="submit">Save org</Button>
        </form>
        <div className="space-y-4">
          <form
            className="space-y-3 rounded-lg border bg-white p-4"
            onSubmit={async (e) => {
              e.preventDefault();
              await api("/api/members", {
                method: "POST",
                body: JSON.stringify({ email, role: "evaluator" }),
              });
              setEmail("");
              await refresh();
            }}
          >
            <Label htmlFor="email">Invite member</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit">Invite</Button>
          </form>
          <ul className="rounded-lg border bg-white p-4 text-sm">
            {members.map((m) => (
              <li key={m.id}>
                {m.email} · {m.role}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                const text = await api<string>("/api/export?format=json");
                const blob = new Blob([text], { type: "application/json" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = "coload-packs.json";
                a.click();
              }}
            >
              Export JSON
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                const text = await api<string>("/api/export?format=csv");
                const blob = new Blob([text], { type: "text/csv" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = "coload-compares.csv";
                a.click();
              }}
            >
              Export CSV
            </Button>
          </div>
          <div className="rounded-lg border bg-white p-4">
            <h3 className="font-medium">Audit trail</h3>
            <ul className="mt-2 max-h-48 space-y-1 overflow-auto text-xs">
              {audits.map((a) => (
                <li key={a.id}>
                  {a.at} · {a.actor} · {a.action} · {a.detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
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
    name: "Bench",
    price: "$0",
    blurb: "Single evaluator soft-sim for ordered co-load drafts.",
    includes: ["1 seat", "Demo pack", "30 goldens browser", "Honesty fence"],
  },
  {
    name: "Formulation",
    price: "$480 / mo",
    blurb: "Team carrier packs and dual A/B compares for formulation leads.",
    includes: ["8 seats", "Versioned packs", "Export + webhooks", "Scoreboard"],
  },
  {
    name: "Site",
    price: "Talk to us",
    blurb: "Site license for nanomedicine analytics orgs — method-lab packaging only.",
    includes: ["Unlimited seats", "Audit export", "Rate-limit controls", "Guide link"],
  },
] as const;

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical plans for method-lab packaging — not a live checkout."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <div key={t.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              {t.name}
            </h2>
            <p className="mt-1 text-lg text-[var(--co-amber)]">{t.price}</p>
            <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              {t.blurb}
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
              {t.includes.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm">
        <Link href="/onboarding" className="underline text-[var(--co-slate)]">
          Start onboarding
        </Link>
        {" · "}
        <Link href="/honesty" className="underline text-[var(--co-slate)]">
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
  `import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const STEPS = [
  {
    n: 1,
    title: "Open a carrier pack",
    body: "Start from the seeded HSN chemo-photothermal pack or create your own version.",
    href: "/packs",
  },
  {
    n: 2,
    title: "Confirm carrier + load order",
    body: "Hollow mesoporous carrier and DTX-then-ICG sequence make pore fill intent explicit.",
    href: "/carriers",
  },
  {
    n: 3,
    title: "Run an assay soft-sim",
    body: "Capture order fidelity and encapsulation signals — soft-sim only.",
    href: "/assays",
  },
  {
    n: 4,
    title: "Compare ordered vs simultaneous",
    body: "Dual scorers show whether load order beats the simultaneous baseline.",
    href: "/compare",
  },
  {
    n: 5,
    title: "Export or invite",
    body: "Export JSON/CSV and invite evaluators from settings when the delta is clear.",
    href: "/settings",
  },
] as const;

export function DemoPage() {
  return (
    <StudioShell
      title="Guided demo"
      subtitle="Five steps a stranger can complete to see ordered co-load soft-sim."
    >
      <ol className="space-y-4">
        {STEPS.map((s) => (
          <li key={s.n} className="rounded-lg border bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-[var(--co-amber)]">
              Step {s.n}
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl">
              {s.title}
            </h2>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              {s.body}
            </p>
            <Link
              href={s.href}
              className="mt-3 inline-block text-sm underline text-[var(--co-slate)]"
            >
              Go
            </Link>
          </li>
        ))}
      </ol>
    </StudioShell>
  );
}

export default DemoPage;
`,
);

w(
  "src/app/onboarding/page.tsx",
  `"use client";
import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const CHECKS = [
  { id: "honesty", label: "Read honesty fence", href: "/honesty" },
  { id: "pack", label: "Open or create a carrier pack", href: "/packs" },
  { id: "carrier", label: "Confirm a carrier pore hint", href: "/carriers" },
  { id: "load", label: "Configure a load sequence", href: "/loads" },
  { id: "assay", label: "Create an assay soft-sim", href: "/assays" },
  { id: "compare", label: "Run ordered vs simultaneous compare", href: "/compare" },
  { id: "export", label: "Export or invite a teammate", href: "/settings" },
] as const;

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = CHECKS.filter((c) => done[c.id]).length;

  return (
    <StudioShell
      title="Onboarding"
      subtitle={\`Checklist progress: \${progress} / \${CHECKS.length}\`}
    >
      <div className="mb-6 h-2 rounded bg-[var(--co-mist)]">
        <div
          className="score-bar h-2 rounded bg-[var(--co-amber)]"
          style={{ width: \`\${(progress / CHECKS.length) * 100}%\` }}
        />
      </div>
      <ul className="space-y-3">
        {CHECKS.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between rounded-lg border bg-white px-4 py-3"
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
            <Link href={c.href} className="text-sm underline text-[var(--co-slate)]">
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
    name: "Create carrier pack",
    actor: "Formulation lead",
    job: "Version a hollow mesoporous co-load context",
    steps: "/packs → label/version/focus → active pack",
    success: "Pack appears in registry with version",
    failure: "Empty label rejected; archived packs filtered",
    href: "/packs",
  },
  {
    name: "Configure load sequence",
    actor: "Formulation analyst",
    job: "Make chemo-then-photo order explicit",
    steps: "/loads → order kind + hint → save",
    success: "Load sequence linked to pack",
    failure: "Missing pack id returns not_found",
    href: "/loads",
  },
  {
    name: "Configure assay",
    actor: "Assay soft-sim operator",
    job: "Capture order fidelity and encapsulation signals",
    steps: "/assays → carrier + load + metrics → create",
    success: "Assay run listed with fidelity scores",
    failure: "Unknown carrier/load blocked",
    href: "/assays",
  },
  {
    name: "Run A/B compare",
    actor: "Evaluator",
    job: "Decide if ordered co-load beats simultaneous baseline",
    steps: "/compare → select entities → run → /scoreboard",
    success: "Winner + gap recorded on scoreboard",
    failure: "Missing assay id returns error",
    href: "/compare",
  },
  {
    name: "Export + webhook",
    actor: "Org admin",
    job: "Hand off packs/compares and ingest signed events",
    steps: "/settings → export JSON/CSV → webhook HMAC",
    success: "Download + idempotent webhook ack",
    failure: "Bad signature rejected; rate limit 429",
    href: "/settings",
  },
] as const;

export function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Five sophisticated journeys for ordered chemo-photothermal co-load soft-sim."
    >
      <div className="space-y-4">
        {FLOWS.map((f) => (
          <article key={f.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-xl">
              {f.name}
            </h2>
            <p className="mt-1 text-sm">
              <strong>Actor:</strong> {f.actor}
            </p>
            <p className="text-sm">
              <strong>Job:</strong> {f.job}
            </p>
            <p className="text-sm">
              <strong>Steps:</strong> {f.steps}
            </p>
            <p className="text-sm">
              <strong>Success:</strong> {f.success}
            </p>
            <p className="text-sm">
              <strong>Failure:</strong> {f.failure}
            </p>
            <Link
              href={f.href}
              className="mt-3 inline-block text-sm underline text-[var(--co-slate)]"
            >
              Enter flow
            </Link>
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
      subtitle="What this product is — and is not."
    >
      <div className="max-w-2xl space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          Coload Order Studio is a <strong>method-lab soft-sim</strong> for
          comparing ordered chemo-photothermal co-load sequences against
          simultaneous-load baselines on hollow mesoporous carriers.
        </p>
        <p>It does <strong>not</strong> claim:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Wet-lab validated GMP nanomedicine manufacture</li>
          <li>Live patient dosing</li>
          <li>Clinical oncology clearance</li>
          <li>Branding as the authors&apos; HSN system</li>
        </ul>
        <p>
          Inspired by{" "}
          <a href={PAPER_URL} className="underline text-[var(--co-slate)]">
            Nanomaterials 10.3390/nano16130805
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          <Link href="/flows" className="underline text-[var(--co-slate)]">
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

console.log("remaining pages done");
