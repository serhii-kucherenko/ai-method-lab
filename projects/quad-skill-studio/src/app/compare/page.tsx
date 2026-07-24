"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { CompareResult, QuadRobot } from "@/store";

export default function ComparePage() {
  const [robots, setRobots] = useState<QuadRobot[]>([]);
  const [items, setItems] = useState<CompareResult[]>([]);
  const [robotId, setRobotId] = useState("");
  const [name, setName] = useState("Multi-skill vs single-gait");
  const [error, setError] = useState("");

  async function load() {
    const [r, c] = await Promise.all([
      api<{ items: QuadRobot[] }>("/api/robots"),
      api<{ items: CompareResult[] }>("/api/compare"),
    ]);
    setRobots(r.items);
    if (!robotId && r.items[0]) setRobotId(r.items[0].id);
    setItems(c.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name, robotId }),
      });
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Compare plans"
      subtitle="Multi-skill perceptive quality versus single-gait stall baselines."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3"
      >
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={robotId}
          onChange={(e) => setRobotId(e.target.value)}
          required
        >
          {robots.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <Button type="submit">Run compare</Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-4">
        {items.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
                {c.name}
              </h3>
              <span className="text-sm font-medium text-[var(--studio-earth)]">
                Winner: {c.winner.replace("_", " ")}
              </span>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-stone-500">
                  Multi-skill (A)
                </p>
                <p className="mt-1 text-2xl font-semibold text-stone-900">
                  {c.multiSkill.overall.toFixed(1)}
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  transition {c.multiSkill.transitionScore.toFixed(1)} · stall
                  avoid {c.multiSkill.stallRisk.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-stone-500">
                  Single-gait (B)
                </p>
                <p className="mt-1 text-2xl font-semibold text-stone-900">
                  {c.singleGait.overall.toFixed(1)}
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  transition {c.singleGait.transitionScore.toFixed(1)} · stall
                  avoid {c.singleGait.stallRisk.toFixed(1)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
