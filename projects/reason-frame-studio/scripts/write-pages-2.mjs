import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function write(rel, content) {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content, "utf8");
  console.log("wrote", rel);
}

write(
  "src/app/compare/page.tsx",
  `"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { CompareResult, RulePack } from "@/store";

export default function ComparePage() {
  const [items, setItems] = useState<CompareResult[]>([]);
  const [packs, setPacks] = useState<RulePack[]>([]);
  const [rulePackId, setRulePackId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const res = await api<{ items: CompareResult[] }>("/api/compare");
    setItems(res.items);
  }

  useEffect(() => {
    Promise.all([
      api<{ items: RulePack[] }>("/api/rules"),
      api<{ items: CompareResult[] }>("/api/compare"),
    ])
      .then(([p, c]) => {
        setPacks(p.items);
        setItems(c.items);
        if (p.items[0]) setRulePackId(p.items[0].id);
      })
      .catch((e) => setError(String(e)));
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name, rulePackId }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Multi-agent vs single-agent"
      subtitle="Score A: game-theoretic multi-agent plan. Score B: fluent single-agent baseline."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
      >
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={rulePackId}
          onChange={(e) => setRulePackId(e.target.value)}
        >
          {packs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <Input
          placeholder="Compare name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Button type="submit">Run compare</Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-[family-name:var(--font-display)] text-lg">
                {item.name}
              </h2>
              <span className="text-xs uppercase tracking-wide text-[var(--studio-amber)]">
                winner: {item.winner}
              </span>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="rounded-md bg-stone-100/80 p-3 text-sm">
                <p className="font-medium text-stone-800">A · multi-agent</p>
                <p className="text-stone-600">
                  overall {item.multiAgent.overall.toFixed(1)} · resist{" "}
                  {item.multiAgent.hallucinationResistance.toFixed(1)} · game{" "}
                  {item.multiAgent.gameScore.toFixed(1)}
                </p>
              </div>
              <div className="rounded-md bg-stone-100/80 p-3 text-sm">
                <p className="font-medium text-stone-800">B · single-agent</p>
                <p className="text-stone-600">
                  overall {item.singleAgent.overall.toFixed(1)} · resist{" "}
                  {item.singleAgent.hallucinationResistance.toFixed(1)} · game{" "}
                  {item.singleAgent.gameScore.toFixed(1)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
`,
);

write(
  "src/app/settings/page.tsx",
  `"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { Member, OrgSettings, PlanKind } from "@/store";

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [o, m] = await Promise.all([
      api<{ org: OrgSettings }>("/api/settings"),
      api<{ items: Member[] }>("/api/members"),
    ]);
    setOrg(o.org);
    setMembers(m.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!org) return;
    setError("");
    try {
      const res = await api<{ org: OrgSettings }>("/api/settings", {
        method: "PATCH",
        body: JSON.stringify({
          name: org.name,
          webhookUrl: org.webhookUrl,
          defaultPlan: org.defaultPlan,
          rateLimitPerMinute: org.rateLimitPerMinute,
        }),
      });
      setOrg(res.org);
    } catch (err) {
      setError(String(err));
    }
  }

  async function onInvite(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/members", {
        method: "POST",
        body: JSON.stringify({ email, role: "reader" }),
      });
      setEmail("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  if (!org) {
    return (
      <StudioShell title="Settings" subtitle="Org, members, webhook.">
        <p className="text-sm text-stone-500">Loading…</p>
      </StudioShell>
    );
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Organization, member invites, and webhook configuration."
    >
      <form
        onSubmit={onSave}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
      >
        <Input
          value={org.name}
          onChange={(e) => setOrg({ ...org, name: e.target.value })}
          placeholder="Org name"
        />
        <Input
          value={org.webhookUrl}
          onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
          placeholder="Webhook URL"
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={org.defaultPlan}
          onChange={(e) =>
            setOrg({ ...org, defaultPlan: e.target.value as PlanKind })
          }
        >
          <option value="multi_agent">multi_agent</option>
          <option value="single_agent">single_agent</option>
        </select>
        <Input
          type="number"
          value={org.rateLimitPerMinute}
          onChange={(e) =>
            setOrg({
              ...org,
              rateLimitPerMinute: Number(e.target.value),
            })
          }
          placeholder="Rate limit / min"
        />
        <Button type="submit">Save settings</Button>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" asChild>
            <a href="/api/export/audits">Export audits CSV</a>
          </Button>
          <Button type="button" variant="outline" asChild>
            <a href="/api/export/rules">Export rules JSON</a>
          </Button>
          <Button type="button" variant="outline" asChild>
            <a href="/api/export/debates">Export debates JSON</a>
          </Button>
        </div>
      </form>

      <form
        onSubmit={onInvite}
        className="mb-8 flex flex-wrap gap-2 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
      >
        <Input
          className="max-w-sm"
          placeholder="Invite email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit">Invite member</Button>
      </form>

      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      <ul className="space-y-2">
        {members.map((m) => (
          <li
            key={m.id}
            className="rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
          >
            {m.email} · {m.role}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
`,
);

write(
  "src/app/honesty/page.tsx",
  `import Link from "next/link";
import {
  AUTHORS_CODE_URL,
  CLAIM,
  DISPLAY_NAME,
  PAPER_URL,
} from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What this method-lab studio is — and is not."
    >
      <div className="space-y-6 text-stone-700">
        <section className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
            Claim
          </h2>
          <p className="mt-2 leading-relaxed">{CLAIM}</p>
        </section>
        <section className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
            Limits
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            <li>
              Soft simulation of multi-agent game checks — not a production LLM
              gateway.
            </li>
            <li>
              Inspired by the paper pattern; not branded as G-Frame and not a
              reimplementation of authors’ code (none published).
            </li>
            <li>
              Dual scores compare multi-agent game quality vs single-agent
              fluency inside this studio only.
            </li>
          </ul>
        </section>
        <section className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
            Sources
          </h2>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              Paper:{" "}
              <a
                className="text-[var(--studio-amber)] underline-offset-2 hover:underline"
                href={PAPER_URL}
              >
                {PAPER_URL}
              </a>
            </li>
            <li>
              Authors’ code:{" "}
              {AUTHORS_CODE_URL ? (
                <a href={AUTHORS_CODE_URL}>{AUTHORS_CODE_URL}</a>
              ) : (
                "none"
              )}
            </li>
            <li>
              Product:{" "}
              <Link
                className="text-[var(--studio-amber)] underline-offset-2 hover:underline"
                href="/"
              >
                {DISPLAY_NAME}
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </StudioShell>
  );
}
`,
);

write(
  "src/app/page.tsx",
  `import Link from "next/link";
import {
  CLAIM,
  DISPLAY_NAME,
  PAPER_URL,
  TAGLINE,
} from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-ink)]">
      <section className="hero-fade relative overflow-hidden border-b border-[var(--studio-line)]">
        <div
          aria-hidden
          className="absolute inset-0 bg-[var(--studio-wash)]"
        />
        <div className="relative mx-auto flex min-h-[88vh] max-w-5xl flex-col justify-end px-6 pb-16 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl leading-none tracking-tight text-[var(--studio-amber)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-2xl text-stone-100 md:text-3xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-xl text-base text-stone-300 md:text-lg">
            Catch fluent-but-false scientific answers with game-aware
            multi-agent checks before you ship.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/rules"
              className="rounded-md bg-[var(--studio-amber)] px-5 py-2.5 text-sm font-medium text-[var(--studio-ink-deep)] transition hover:brightness-110"
            >
              Open rule packs
            </Link>
            <Link
              href="/honesty"
              className="rounded-md border border-stone-500 px-5 py-2.5 text-sm text-stone-200 transition hover:border-stone-300"
            >
              Honesty fence
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-900">
          The problem
        </h2>
        <p className="mt-3 max-w-2xl text-stone-600">
          Single-agent LLMs sound fluent in rule-based science while quietly
          breaking conservation laws, units, and domain constraints.
          Hallucinations slip past reviews that only check prose.
        </p>
      </section>

      <section className="border-y border-[var(--studio-line)] bg-[var(--studio-panel)]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-900">
            The product
          </h2>
          <p className="mt-3 max-w-2xl text-stone-600">{CLAIM}</p>
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              [
                "Scientific rule packs",
                "Encode physics, chemistry, biology, math, or materials constraints before debate.",
              ],
              [
                "Multi-agent debates",
                "Proposers and challengers argue under referee scoring — not one confident monologue.",
              ],
              [
                "Bayesian / team-game scores",
                "Update beliefs with coordination and evidence grounding, not vibes.",
              ],
              [
                "Hallucination flags",
                "Surface fluent falsehoods and resolve them against the rule pack.",
              ],
              [
                "Multi vs single compare",
                "Dual score A (game plan) vs B (fluent baseline) makes the gap falsifiable.",
              ],
            ].map(([title, body]) => (
              <li key={title}>
                <h3 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-stone-600">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-900">
          How it works
        </h2>
        <ol className="mt-6 list-decimal space-y-3 pl-5 text-stone-600">
          <li>Register a scientific rule pack for your domain.</li>
          <li>Configure proposer / challenger / referee agents.</li>
          <li>Run debate rounds and record game scores.</li>
          <li>Review hallucination flags, then compare multi-agent vs single-agent.</li>
        </ol>
        <p className="mt-8 text-sm text-stone-500">
          Inspired by{" "}
          <a
            className="text-[var(--studio-amber)] underline-offset-2 hover:underline"
            href={PAPER_URL}
          >
            arXiv:2607.08403
          </a>
          . Method-lab studio — not G-Frame, not a live production gateway.{" "}
          <Link
            className="text-[var(--studio-amber)] underline-offset-2 hover:underline"
            href="/honesty"
          >
            Full honesty fence
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
`,
);

console.log("remaining pages done");
