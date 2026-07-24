"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type {
  DesignBrief,
  MaterialSequence,
  MultilayerStack,
  ThicknessPlan,
} from "@/store";

export default function StacksPage() {
  const [items, setItems] = useState<MultilayerStack[]>([]);
  const [briefs, setBriefs] = useState<DesignBrief[]>([]);
  const [sequences, setSequences] = useState<MaterialSequence[]>([]);
  const [plans, setPlans] = useState<ThicknessPlan[]>([]);
  const [briefId, setBriefId] = useState("");
  const [sequenceId, setSequenceId] = useState("");
  const [thicknessPlanId, setThicknessPlanId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [stacks, br, seq, th] = await Promise.all([
      api<{ items: MultilayerStack[] }>("/api/stacks"),
      api<{ items: DesignBrief[] }>("/api/briefs"),
      api<{ items: MaterialSequence[] }>("/api/materials"),
      api<{ items: ThicknessPlan[] }>("/api/thicknesses"),
    ]);
    setItems(stacks.items);
    setBriefs(br.items);
    setSequences(seq.items);
    setPlans(th.items);
    if (!briefId && br.items[0]) setBriefId(br.items[0].id);
    if (!sequenceId && seq.items[0]) setSequenceId(seq.items[0].id);
    if (!thicknessPlanId && th.items[0]) setThicknessPlanId(th.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/stacks", {
        method: "POST",
        body: JSON.stringify({
          briefId,
          sequenceId,
          thicknessPlanId,
          name,
          status: "assembled",
          coherence: 0.78,
          notes: "Assembled multilayer stack",
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
      title="Multilayer stacks"
      subtitle="Assemble materials and thicknesses into coherent coating stacks."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
      >
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={briefId}
          onChange={(e) => setBriefId(e.target.value)}
          required
        >
          {briefs.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <Input
          placeholder="Stack name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={sequenceId}
          onChange={(e) => setSequenceId(e.target.value)}
          required
        >
          {sequences.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={thicknessPlanId}
          onChange={(e) => setThicknessPlanId(e.target.value)}
          required
        >
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <Button type="submit" className="md:col-span-2 md:w-fit">
          Assemble stack
        </Button>
      </form>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((c, i) => (
          <li
            key={c.id}
            className="animate-layer-peel rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-medium text-slate-900">{c.name}</span>
              <span className="text-xs text-slate-500">
                {c.layerCount} layers · coherence{" "}
                {Math.round(c.coherence * 100)}% · {c.status}
              </span>
            </div>
            <div className="mt-3 flex gap-1">
              {Array.from({ length: Math.min(c.layerCount, 8) }).map((_, j) => (
                <div
                  key={j}
                  className="h-3 flex-1 rounded-sm"
                  style={{
                    background:
                      j % 2 === 0
                        ? "var(--studio-cyan)"
                        : "var(--studio-magenta)",
                    opacity: 0.45 + j * 0.06,
                  }}
                />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
