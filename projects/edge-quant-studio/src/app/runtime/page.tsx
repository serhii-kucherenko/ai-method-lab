"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { ChannelPlan, RuntimePlan } from "@/store";

export default function RuntimePage() {
  const [items, setItems] = useState<RuntimePlan[]>([]);
  const [plans, setPlans] = useState<ChannelPlan[]>([]);
  const [name, setName] = useState("");
  const [channelPlanId, setChannelPlanId] = useState("");
  const [clusterBlocks, setClusterBlocks] = useState("12");
  const [error, setError] = useState("");

  async function load() {
    const [runtime, channels] = await Promise.all([
      api<{ items: RuntimePlan[] }>("/api/runtime"),
      api<{ items: ChannelPlan[] }>("/api/channels"),
    ]);
    setItems(runtime.items);
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
      await api("/api/runtime", {
        method: "POST",
        body: JSON.stringify({
          name,
          channelPlanId,
          clusterBlocks: Number(clusterBlocks),
          kernelPaths: 4,
          reorderTrafficPct: 20,
          status: "planned",
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
      title="Compile / runtime plans"
      subtitle="Soft-sim cluster blocks, kernel paths, and reorder traffic — layout merge off the hot path."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3"
      >
        <Input
          placeholder="Runtime plan name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={channelPlanId}
          onChange={(e) => setChannelPlanId(e.target.value)}
          required
        >
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <Input
          placeholder="Cluster blocks"
          value={clusterBlocks}
          onChange={(e) => setClusterBlocks(e.target.value)}
        />
        <Button type="submit" className="md:col-span-3">
          Plan runtime
        </Button>
      </form>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((r) => (
          <li
            key={r.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">
                {r.name}
              </span>
              <span className="text-xs uppercase tracking-wide text-slate-500">
                {r.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {r.clusterBlocks} clusters · {r.kernelPaths} kernel paths ·{" "}
              {r.reorderTrafficPct}% reorder traffic (soft-sim)
            </p>
          </li>
        ))}
        {items.length === 0 ? (
          <li className="text-sm text-slate-500">
            Link a channel plan first, then soft-sim runtime.
          </li>
        ) : null}
      </ul>
    </StudioShell>
  );
}
