"use client";

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
