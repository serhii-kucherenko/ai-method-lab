"use client";

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
