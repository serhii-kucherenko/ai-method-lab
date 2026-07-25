"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { ChannelPlan, EdgeTarget, ModelPack } from "@/store";

export default function ChannelsPage() {
  const [items, setItems] = useState<ChannelPlan[]>([]);
  const [packs, setPacks] = useState<ModelPack[]>([]);
  const [targets, setTargets] = useState<EdgeTarget[]>([]);
  const [name, setName] = useState("");
  const [packId, setPackId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [avgBitBudget, setAvgBitBudget] = useState("3.7");
  const [error, setError] = useState("");

  async function load() {
    const [plans, packRes, targetRes] = await Promise.all([
      api<{ items: ChannelPlan[] }>("/api/channels"),
      api<{ items: ModelPack[] }>("/api/packs"),
      api<{ items: EdgeTarget[] }>("/api/targets"),
    ]);
    setItems(plans.items);
    setPacks(packRes.items);
    setTargets(targetRes.items);
    if (!packId && packRes.items[0]) setPackId(packRes.items[0].id);
    if (!targetId && targetRes.items[0]) setTargetId(targetRes.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/channels", {
        method: "POST",
        body: JSON.stringify({
          name,
          packId,
          targetId,
          avgBitBudget: Number(avgBitBudget),
          profile: "channel",
          score: true,
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
      title="Channel bit-width plans"
      subtitle="Fractional average-bit budgets with activation-aware channel allocation — soft-sim only."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
      >
        <Input
          placeholder="Plan name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          placeholder="Avg bit budget"
          value={avgBitBudget}
          onChange={(e) => setAvgBitBudget(e.target.value)}
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={packId}
          onChange={(e) => setPackId(e.target.value)}
          required
        >
          {packs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={targetId}
          onChange={(e) => setTargetId(e.target.value)}
          required
        >
          {targets.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <Button type="submit" className="md:col-span-2">
          Score channel plan
        </Button>
      </form>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((p) => (
          <li
            key={p.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">
                {p.name}
              </span>
              <span className="text-xs uppercase tracking-wide text-slate-500">
                {p.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              budget {p.avgBitBudget}b · channel{" "}
              {p.channelOverall?.toFixed(1) ?? "—"} · uniform{" "}
              {p.uniformOverall?.toFixed(1) ?? "—"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Soft-sim plan quality — not measured silicon.
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
