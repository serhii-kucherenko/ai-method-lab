"use client";

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
