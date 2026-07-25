"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Optimizer = {
  id: string;
  label: string;
  optimizerSummary: string;
  successCondition: string;
  optimizerChannel: string;
  status: string;
};

type Pack = { id: string; label: string };

export default function OptimizersPage() {
  const [items, setItems] = useState<Optimizer[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [label, setLabel] = useState("Sample-efficient optimizer");
  const [summary, setSummary] = useState(
    "Soft-sim sample-efficient generative optimization ring.",
  );
  const [error, setError] = useState("");

  async function load() {
    const [o, p] = await Promise.all([
      api<{ items: Optimizer[] }>(
        `/api/optimizers?q=${encodeURIComponent(q)}`,
      ),
      api<{ items: Pack[] }>("/api/campaigns"),
    ]);
    setItems(o.items);
    setPacks(p.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/optimizers", {
        method: "POST",
        body: JSON.stringify({
          packId: packs[0]?.id,
          label,
          optimizerSummary: summary,
          successCondition: "lock_soft_sim",
          optimizerChannel: "soft_sim_optimizer",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Optimizers"
      subtitle="Sample-efficient generative optimizer configs and success conditions."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search optimizers"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          onClick={() => load().catch((e) => setError(String(e)))}
        >
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label>Label</Label>
          <Input value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>
        <div>
          <Label>Summary</Label>
          <Input value={summary} onChange={(e) => setSummary(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Create optimizer config</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--ms-teal)]">{error}</p>
      ) : null}
      <ul className="space-y-2">
        {items.map((o) => (
          <li
            key={o.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{o.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {o.optimizerChannel} · {o.successCondition} · {o.status}
            </div>
            <div className="mt-1 text-xs">{o.optimizerSummary}</div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
