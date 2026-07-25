"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { ChannelPlan, CompareResult } from "@/store";

export default function ComparePage() {
  const [items, setItems] = useState<CompareResult[]>([]);
  const [plans, setPlans] = useState<ChannelPlan[]>([]);
  const [name, setName] = useState("");
  const [channelPlanId, setChannelPlanId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [compares, channels] = await Promise.all([
      api<{ items: CompareResult[] }>("/api/compare"),
      api<{ items: ChannelPlan[] }>("/api/channels"),
    ]);
    setItems(compares.items);
    setPlans(channels.items);
    if (!channelPlanId && channels.items[0]) {
      setChannelPlanId(channels.items[0].id);
    }
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
        body: JSON.stringify({ name, channelPlanId }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Uniform vs channel-aware"
      subtitle="Dual score A (channel-aware plan quality) vs B (naive uniform bit-width)."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3"
      >
        <Input
          placeholder="Compare name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={channelPlanId}
          onChange={(e) => setChannelPlanId(e.target.value)}
        >
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <Button type="submit">Run compare</Button>
      </form>

      <div className="mb-6 flex flex-wrap gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={async () => {
            const csv = await api<string>("/api/export?kind=compares");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "compares.csv";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Export compares CSV
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={async () => {
            const body = await api<string>("/api/export?kind=plans");
            const blob = new Blob([body], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "plans.json";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Export plans JSON
        </Button>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">
                {c.name}
              </span>
              <span className="text-xs uppercase tracking-wide text-slate-500">
                winner {c.winner} · gap {c.gap}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              channel-aware {c.channelAware.overall.toFixed(1)} · uniform{" "}
              {c.uniform.overall.toFixed(1)}
            </p>
          </li>
        ))}
        {items.length === 0 ? (
          <li className="text-sm text-slate-500">
            Score a channel plan, then compare against uniform.
          </li>
        ) : null}
      </ul>
    </StudioShell>
  );
}
