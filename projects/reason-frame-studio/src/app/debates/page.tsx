"use client";

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
    const qs = packId ? `?rulePackId=${encodeURIComponent(packId)}` : "";
    const res = await api<{ items: DebateRound[] }>(`/api/debates${qs}`);
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
