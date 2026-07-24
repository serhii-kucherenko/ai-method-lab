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
  "src/app/rules/page.tsx",
  `"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { DomainKind, RulePack } from "@/store";

const DOMAINS: DomainKind[] = [
  "physics",
  "chemistry",
  "biology",
  "math",
  "materials",
];

export default function RulesPage() {
  const [items, setItems] = useState<RulePack[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [domainKind, setDomainKind] = useState<DomainKind>("physics");
  const [coverage, setCoverage] = useState("0.75");
  const [ruleCount, setRuleCount] = useState("12");
  const [error, setError] = useState("");
  const [checklist, setChecklist] = useState(false);

  async function load(search = q) {
    const res = await api<{ items: RulePack[] }>(
      \`/api/rules?q=\${encodeURIComponent(search)}\`,
    );
    setItems(res.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/rules", {
        method: "POST",
        body: JSON.stringify({
          name,
          domainKind,
          coverage: Number(coverage),
          ruleCount: Number(ruleCount),
          status: "active",
          notes: "Captured from rules page",
        }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Scientific rule packs"
      subtitle="Define the rule-based domain your agents must respect before any fluent answer ships."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <label className="flex items-start gap-2 text-sm text-stone-600">
          <input
            type="checkbox"
            checked={checklist}
            onChange={(e) => setChecklist(e.target.checked)}
            className="mt-1"
          />
          <span>
            Onboarding: confirm packs encode scientific constraints (not prompt
            fluff), and that this studio is a method-lab planner — not a live
            LLM gateway. Guide:{" "}
            <a
              className="text-[var(--studio-amber)] underline-offset-2 hover:underline"
              href="/docs/guides/60-reason-frame-studio-lessons.md"
            >
              lessons
            </a>
          </span>
        </label>
      </div>

      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
      >
        <Input
          placeholder="Pack name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={domainKind}
          onChange={(e) => setDomainKind(e.target.value as DomainKind)}
        >
          {DOMAINS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <Input
          type="number"
          step="0.01"
          placeholder="Coverage"
          value={coverage}
          onChange={(e) => setCoverage(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Rule count"
          value={ruleCount}
          onChange={(e) => setRuleCount(e.target.value)}
        />
        <div className="flex gap-2 md:col-span-2">
          <Button type="submit">Add rule pack</Button>
          <Input
            placeholder="Search packs"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => load().catch((e) => setError(String(e)))}
          >
            Search
          </Button>
        </div>
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
              <span className="text-xs uppercase tracking-wide text-stone-500">
                {item.domainKind} · {item.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-stone-600">
              coverage {(item.coverage * 100).toFixed(0)}% · {item.ruleCount}{" "}
              rules
            </p>
            {item.notes ? (
              <p className="mt-2 text-sm text-stone-500">{item.notes}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
`,
);

write(
  "src/app/debates/page.tsx",
  `"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { DebateRound, RulePack } from "@/store";

export default function DebatesPage() {
  const [items, setItems] = useState<DebateRound[]>([]);
  const [packs, setPacks] = useState<RulePack[]>([]);
  const [rulePackId, setRulePackId] = useState("");
  const [name, setName] = useState("");
  const [turnCount, setTurnCount] = useState("6");
  const [depth, setDepth] = useState("0.7");
  const [error, setError] = useState("");

  async function load(packId = rulePackId) {
    const qs = packId ? \`?rulePackId=\${encodeURIComponent(packId)}\` : "";
    const res = await api<{ items: DebateRound[] }>(\`/api/debates\${qs}\`);
    setItems(res.items);
  }

  useEffect(() => {
    Promise.all([
      api<{ items: RulePack[] }>("/api/rules"),
      api<{ items: DebateRound[] }>("/api/debates"),
    ])
      .then(([p, d]) => {
        setPacks(p.items);
        setItems(d.items);
        if (p.items[0]) setRulePackId(p.items[0].id);
      })
      .catch((e) => setError(String(e)));
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/debates", {
        method: "POST",
        body: JSON.stringify({
          rulePackId,
          name,
          turnCount: Number(turnCount),
          depth: Number(depth),
          status: "running",
          challengerPressure: 0.7,
          consensusStrength: 0.65,
          notes: "Debate round from studio",
        }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Multi-agent debates"
      subtitle="Run challenger–proposer rounds against your rule packs before trusting a fluent answer."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
      >
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm md:col-span-2"
          value={rulePackId}
          onChange={(e) => {
            setRulePackId(e.target.value);
            load(e.target.value).catch((err) => setError(String(err)));
          }}
        >
          {packs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <Input
          placeholder="Debate name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="number"
          placeholder="Turns"
          value={turnCount}
          onChange={(e) => setTurnCount(e.target.value)}
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Depth"
          value={depth}
          onChange={(e) => setDepth(e.target.value)}
        />
        <Button type="submit">Start debate</Button>
      </form>

      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="debate-pulse rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-[family-name:var(--font-display)] text-lg">
                {item.name}
              </h2>
              <span className="text-xs uppercase tracking-wide text-stone-500">
                {item.status} · {item.turnCount} turns
              </span>
            </div>
            <p className="mt-1 text-sm text-stone-600">
              depth {(item.depth * 100).toFixed(0)}% · pressure{" "}
              {(item.challengerPressure * 100).toFixed(0)}% · consensus{" "}
              {(item.consensusStrength * 100).toFixed(0)}%
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
`,
);

write(
  "src/app/scores/page.tsx",
  `"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { DebateRound, GameScoreRecord, RulePack } from "@/store";

export default function ScoresPage() {
  const [items, setItems] = useState<GameScoreRecord[]>([]);
  const [packs, setPacks] = useState<RulePack[]>([]);
  const [debates, setDebates] = useState<DebateRound[]>([]);
  const [rulePackId, setRulePackId] = useState("");
  const [debateId, setDebateId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api<{ items: RulePack[] }>("/api/rules"),
      api<{ items: DebateRound[] }>("/api/debates"),
      api<{ items: GameScoreRecord[] }>("/api/scores"),
    ])
      .then(([p, d, s]) => {
        setPacks(p.items);
        setDebates(d.items);
        setItems(s.items);
        if (p.items[0]) setRulePackId(p.items[0].id);
        if (d.items[0]) setDebateId(d.items[0].id);
      })
      .catch((e) => setError(String(e)));
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/scores", {
        method: "POST",
        body: JSON.stringify({
          rulePackId,
          debateId,
          name,
          status: "computed",
          bayesianUpdate: 0.72,
          teamCoordination: 0.7,
          evidenceGrounding: 0.74,
        }),
      });
      setName("");
      const res = await api<{ items: GameScoreRecord[] }>("/api/scores");
      setItems(res.items);
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Game scores"
      subtitle="Bayesian updates and team-game coordination after multi-agent debate."
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
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={debateId}
          onChange={(e) => setDebateId(e.target.value)}
        >
          {debates.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <Input
          className="md:col-span-2"
          placeholder="Score name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Button type="submit">Record score</Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <h2 className="font-[family-name:var(--font-display)] text-lg">
              {item.name}
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              bayesian {(item.bayesianUpdate * 100).toFixed(0)}% · team{" "}
              {(item.teamCoordination * 100).toFixed(0)}% · evidence{" "}
              {(item.evidenceGrounding * 100).toFixed(0)}% · {item.status}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
`,
);

write(
  "src/app/flags/page.tsx",
  `"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type {
  DebateRound,
  FlagSeverity,
  HallucinationFlag,
  RulePack,
} from "@/store";

const SEVERITIES: FlagSeverity[] = ["low", "medium", "high", "critical"];

export default function FlagsPage() {
  const [items, setItems] = useState<HallucinationFlag[]>([]);
  const [packs, setPacks] = useState<RulePack[]>([]);
  const [debates, setDebates] = useState<DebateRound[]>([]);
  const [rulePackId, setRulePackId] = useState("");
  const [debateId, setDebateId] = useState("");
  const [name, setName] = useState("");
  const [severity, setSeverity] = useState<FlagSeverity>("medium");
  const [error, setError] = useState("");

  async function load() {
    const res = await api<{ items: HallucinationFlag[] }>("/api/flags");
    setItems(res.items);
  }

  useEffect(() => {
    Promise.all([
      api<{ items: RulePack[] }>("/api/rules"),
      api<{ items: DebateRound[] }>("/api/debates"),
      api<{ items: HallucinationFlag[] }>("/api/flags"),
    ])
      .then(([p, d, f]) => {
        setPacks(p.items);
        setDebates(d.items);
        setItems(f.items);
        if (p.items[0]) setRulePackId(p.items[0].id);
        if (d.items[0]) setDebateId(d.items[0].id);
      })
      .catch((e) => setError(String(e)));
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/flags", {
        method: "POST",
        body: JSON.stringify({
          rulePackId,
          debateId,
          name,
          severity,
          fluencyBias: 0.55,
          contradictionRate: 0.4,
          notes: "Flagged from console",
        }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  async function onResolve(id: string) {
    try {
      await api("/api/flags", {
        method: "POST",
        body: JSON.stringify({ resolve: true, id, status: "resolved" }),
      });
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Hallucination flags"
      subtitle="Catch fluent-but-false scientific answers that break your rule packs."
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
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={debateId}
          onChange={(e) => setDebateId(e.target.value)}
        >
          {debates.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <Input
          placeholder="Flag name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={severity}
          onChange={(e) => setSeverity(e.target.value as FlagSeverity)}
        >
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <Button type="submit">Raise flag</Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="flag-rise rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-[family-name:var(--font-display)] text-lg">
                {item.name}
              </h2>
              <span className="text-xs uppercase tracking-wide text-[var(--studio-amber)]">
                {item.severity} · {item.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-stone-600">
              fluency bias {(item.fluencyBias * 100).toFixed(0)}% ·
              contradictions {(item.contradictionRate * 100).toFixed(0)}%
            </p>
            {item.status === "open" || item.status === "reviewing" ? (
              <Button
                className="mt-3"
                size="sm"
                variant="outline"
                onClick={() => onResolve(item.id)}
              >
                Resolve
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
`,
);

write(
  "src/app/agents/page.tsx",
  `"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { AgentConfig, AgentRole } from "@/store";

const ROLES: AgentRole[] = [
  "proposer",
  "challenger",
  "referee",
  "synthesizer",
];

export default function AgentsPage() {
  const [items, setItems] = useState<AgentConfig[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState<AgentRole>("challenger");
  const [temperature, setTemperature] = useState("0.6");
  const [error, setError] = useState("");

  async function load() {
    const res = await api<{ items: AgentConfig[] }>("/api/agents");
    setItems(res.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/agents", {
        method: "POST",
        body: JSON.stringify({
          name,
          role,
          temperature: Number(temperature),
          notes: "Configured from agents page",
        }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Agent roles"
      subtitle="Configure proposers, challengers, referees, and synthesizers for game-aware checks."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
      >
        <Input
          placeholder="Agent name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={role}
          onChange={(e) => setRole(e.target.value as AgentRole)}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <Input
          type="number"
          step="0.1"
          placeholder="Temperature"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
        />
        <Button type="submit">Add agent</Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <h2 className="font-[family-name:var(--font-display)] text-lg">
              {item.name}
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              {item.role} · temp {item.temperature}
            </p>
            {item.notes ? (
              <p className="mt-2 text-sm text-stone-500">{item.notes}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
`,
);

console.log("studio pages part1 done");
