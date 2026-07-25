import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const w = (rel, content) => {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content, "utf8");
  console.log("wrote", rel);
};

w(
  "src/app/assays/page.tsx",
  `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = { id: string; cycleDepth: number; enrichmentFold: number; status: string };

export function AssaysPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [cycleDepth, setCycleDepth] = useState("0.65");
  const [enrichmentFold, setEnrichmentFold] = useState("0.7");
  const [diversityRetention, setDiversityRetention] = useState("0.72");
  const [hitPrecision, setHitPrecision] = useState("0.68");
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
          packId: "pack-demo",
          libraryId: "library-demo",
          cycleId: "cycle-demo",
          hitId: "hit-demo",
          cycleDepth: Number(cycleDepth),
          enrichmentFold: Number(enrichmentFold),
          diversityRetention: Number(diversityRetention),
          hitPrecision: Number(hitPrecision),
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Assay runs"
      subtitle="Soft-sim assay runs that feed iterative DELT vs single-pass compares."
    >
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="cycleDepth">Cycle depth</Label>
          <Input id="cycleDepth" value={cycleDepth} onChange={(e) => setCycleDepth(e.target.value)} />
          <Label htmlFor="enrichmentFold">Enrichment fold</Label>
          <Input id="enrichmentFold" value={enrichmentFold} onChange={(e) => setEnrichmentFold(e.target.value)} />
          <Label htmlFor="diversityRetention">Diversity retention</Label>
          <Input id="diversityRetention" value={diversityRetention} onChange={(e) => setDiversityRetention(e.target.value)} />
          <Label htmlFor="hitPrecision">Hit precision</Label>
          <Input id="hitPrecision" value={hitPrecision} onChange={(e) => setHitPrecision(e.target.value)} />
          <Button>Create assay run</Button>
        </form>
        <section>
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          <ul className="space-y-3">
            {items.map((row) => (
              <li key={row.id} className="row-lift rounded-lg border bg-white p-4">
                <p className="font-semibold">{row.id}</p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                  depth {row.cycleDepth} · enrichment {row.enrichmentFold} · {row.status}
                </p>
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
  iterative: { overall: number };
  singlePass: { overall: number };
};

export function ComparePage() {
  const [items, setItems] = useState<Compare[]>([]);
  const [name, setName] = useState("Seed DELT compare");
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
      subtitle="Iterative DELT optimize (A) vs single-pass library screen (B)."
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
                <span className="mr-4">A iterative {c.iterative.overall}</span>
                <span>B single-pass {c.singlePass.overall}</span>
              </div>
            </div>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <div className="h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
                <div className="score-bar h-full bg-[var(--el-sea)]" style={{ width: \`\${c.iterative.overall}%\` }} />
              </div>
              <div className="h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
                <div className="score-bar h-full bg-[var(--el-copper)]" style={{ width: \`\${c.singlePass.overall}%\` }} />
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
  iterative: { overall: number };
  singlePass: { overall: number };
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
      subtitle="Ranked iterative DELT soft-sim compares — method-lab only."
    >
      {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
          No compares yet. Run one from Compare.
        </p>
      ) : (
        <ol className="space-y-3">
          {items.map((row, i) => (
            <li key={row.id} className="row-lift flex items-center justify-between gap-3 rounded-lg border bg-white p-4">
              <div>
                <p className="font-semibold">
                  #{i + 1} {row.name}
                </p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                  {row.winner} · gap {row.gap}
                </p>
              </div>
              <p className="text-sm">
                A {row.iterative.overall} / B {row.singlePass.overall}
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
  defaultDeltBias: string;
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
    await api("/api/settings", { method: "POST", body: JSON.stringify(org) });
    await load();
  };

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    await api("/api/members", {
      method: "POST",
      body: JSON.stringify({ email, role: "evaluator" }),
    });
    setEmail("");
    await load();
  };

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, members, audit, export, and webhook — platform must-haves for DELT soft-sim."
    >
      {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
      {org ? (
        <form onSubmit={save} className="mb-8 space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Org name</Label>
          <Input id="name" value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} />
          <Label htmlFor="webhookUrl">Webhook URL</Label>
          <Input id="webhookUrl" value={org.webhookUrl} onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })} />
          <Label htmlFor="bias">Default DELT bias</Label>
          <Input id="bias" value={org.defaultDeltBias} onChange={(e) => setOrg({ ...org, defaultDeltBias: e.target.value })} />
          <Button>Save org</Button>
        </form>
      ) : null}
      <form onSubmit={invite} className="mb-8 flex flex-wrap items-end gap-3 rounded-lg border bg-white p-4">
        <div>
          <Label htmlFor="email">Invite member</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <Button type="submit">Invite</Button>
      </form>
      <ul className="mb-8 space-y-2">
        {members.map((m) => (
          <li key={m.id} className="text-sm">
            {m.email} · {m.role}
          </li>
        ))}
      </ul>
      <div className="mb-8 flex flex-wrap gap-3">
        <a className="underline text-[var(--el-sea)]" href="/api/export?format=json">
          Export packs JSON
        </a>
        <a className="underline text-[var(--el-sea)]" href="/api/export?format=csv">
          Export compares CSV
        </a>
        <Link className="underline text-[var(--el-sea)]" href={GUIDE_PATH}>
          Tutor guide
        </Link>
      </div>
      <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl">Audit trail</h2>
      <ul className="space-y-2 text-sm">
        {audits.map((a) => (
          <li key={a.id}>
            {a.at} · {a.actor} · {a.action} — {a.detail}
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
    price: "Method-lab seat",
    blurb: "One evaluator seat, library packs, and dual A/B soft-sim compares.",
  },
  {
    name: "Team",
    price: "Lab cohort",
    blurb: "Shared packs, construct cycles, hit shortlists, export, and webhook.",
  },
  {
    name: "Site",
    price: "Site license (hypothetical)",
    blurb: "Org members, audit trail, scoreboard, and rate-limited API access.",
  },
] as const;

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical method-lab packaging for DELT chemistry analytics leads — not a live checkout."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <div key={t.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">{t.name}</h2>
            <p className="mt-1 text-sm text-[var(--el-sea)]">{t.price}</p>
            <p className="mt-3 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">{t.blurb}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        Soft-sim only. Not wet-lab validated IND/NDA. Not live screening robotics. Not clinical candidate nomination.
      </p>
      <p className="mt-4">
        <Link href="/packs" className="underline text-[var(--el-sea)]">
          Open packs
        </Link>
      </p>
    </StudioShell>
  );
}

export default PricingPage;
`,
);

w(
  "src/app/honesty/page.tsx",
  `import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="What Encoded Library Studio is — and is not."
    >
      <ul className="list-disc space-y-3 pl-5 text-[color-mix(in_srgb,var(--studio-ink)_70%,transparent)]">
        <li>Method-lab soft-sim for iterative DNA-encoded library construct-and-screen cycles.</li>
        <li>Not wet-lab validated IND/NDA evidence.</li>
        <li>Not live screening robotics or lab automation control.</li>
        <li>Not clinical candidate nomination.</li>
        <li>Not the authors&apos; DELT system brand.</li>
      </ul>
      <p className="mt-8 text-sm">
        Source paper:{" "}
        <a className="underline text-[var(--el-sea)]" href={PAPER_URL}>
          ChemRxiv 10.26434/chemrxiv.15004709/v2
        </a>
      </p>
    </StudioShell>
  );
}

export default HonestyPage;
`,
);

console.log("workspace pages done");
