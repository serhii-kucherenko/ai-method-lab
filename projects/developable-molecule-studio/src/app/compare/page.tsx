"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { BindingPocket, CompareResult } from "@/store";

export default function ComparePage() {
  const [pockets, setPockets] = useState<BindingPocket[]>([]);
  const [items, setItems] = useState<CompareResult[]>([]);
  const [pocketId, setPocketId] = useState("");
  const [name, setName] = useState("Pocket+dev vs affinity-only");
  const [error, setError] = useState("");

  async function load() {
    const [p, c] = await Promise.all([
      api<{ items: BindingPocket[] }>("/api/pockets"),
      api<{ items: CompareResult[] }>("/api/compare"),
    ]);
    setPockets(p.items);
    if (!pocketId && p.items[0]) setPocketId(p.items[0].id);
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
        body: JSON.stringify({ name, pocketId }),
      });
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Compare plans"
      subtitle="Pocket-conditioned developability quality versus affinity-only baselines."
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
          value={pocketId}
          onChange={(e) => setPocketId(e.target.value)}
          required
        >
          {pockets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
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
              <span className="text-sm font-medium text-[var(--studio-teal)]">
                Winner: {c.winner.replaceAll("_", " ")}
              </span>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-stone-500">
                  Pocket + developability (A)
                </p>
                <p className="mt-1 text-2xl font-semibold text-stone-900">
                  {c.pocketDevelopability.overall.toFixed(1)}
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  developability{" "}
                  {c.pocketDevelopability.developabilityScore.toFixed(1)} ·
                  clearance avoid{" "}
                  {c.pocketDevelopability.clearanceAvoid.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-stone-500">
                  Affinity-only (B)
                </p>
                <p className="mt-1 text-2xl font-semibold text-stone-900">
                  {c.affinityOnly.overall.toFixed(1)}
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  affinity {c.affinityOnly.affinityScore.toFixed(1)} ·
                  clearance avoid {c.affinityOnly.clearanceAvoid.toFixed(1)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
