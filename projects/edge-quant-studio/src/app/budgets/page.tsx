"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { EdgeTarget, MemoryBudget } from "@/store";

export default function BudgetsPage() {
  const [items, setItems] = useState<MemoryBudget[]>([]);
  const [targets, setTargets] = useState<EdgeTarget[]>([]);
  const [name, setName] = useState("");
  const [targetId, setTargetId] = useState("");
  const [weightMb, setWeightMb] = useState("2800");
  const [error, setError] = useState("");

  async function load() {
    const [budgets, targetRes] = await Promise.all([
      api<{ items: MemoryBudget[] }>("/api/budgets"),
      api<{ items: EdgeTarget[] }>("/api/targets"),
    ]);
    setItems(budgets.items);
    setTargets(targetRes.items);
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
      await api("/api/budgets", {
        method: "POST",
        body: JSON.stringify({
          name,
          targetId,
          weightMb: Number(weightMb),
          kvMb: 900,
          activationMb: 400,
          headroomMb: 600,
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
      title="Latency / memory budgets"
      subtitle="Honesty envelopes for weight, KV, activations, and headroom — estimates only."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3"
      >
        <Input
          placeholder="Budget name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <Input
          placeholder="Weight MB"
          value={weightMb}
          onChange={(e) => setWeightMb(e.target.value)}
        />
        <Button type="submit" className="md:col-span-3">
          Add budget
        </Button>
      </form>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((b) => (
          <li
            key={b.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <span className="font-[family-name:var(--font-display)] text-lg">
              {b.name}
            </span>
            <p className="mt-1 text-sm text-slate-600">
              weights {b.weightMb} · KV {b.kvMb} · act {b.activationMb} ·
              headroom {b.headroomMb} MB
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Soft-sim honesty — not a silicon bench result.
            </p>
          </li>
        ))}
        {items.length === 0 ? (
          <li className="text-sm text-slate-500">
            Link a target, then record a memory envelope.
          </li>
        ) : null}
      </ul>
    </StudioShell>
  );
}
