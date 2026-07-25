"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Reasoner = {
  id: string;
  label: string;
  reasonerSummary: string;
  successCondition: string;
  reasonerChannel: string;
  status: string;
};

export default function ReasonersPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Reasoner[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Clinical reasoner config");
  const [summary, setSummary] = useState(
    "Soft-sim clinical-reasoning LLM for HCC risk.",
  );
  const [successCondition, setSuccessCondition] = useState("elevated");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [p, r] = await Promise.all([
      api<{ items: Pack[] }>("/api/pathways"),
      api<{ items: Reasoner[] }>(`/api/reasoners?q=${encodeURIComponent(q)}`),
    ]);
    setPacks(p.items);
    setItems(r.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/reasoners", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          reasonerSummary: summary,
          successCondition,
          reasonerChannel: "soft_sim_reasoner",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Clinical reasoners"
      subtitle="Reasoner configs and success conditions for soft-sim."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search reasoners"
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
          <Label htmlFor="pack">Pathway pack</Label>
          <select
            id="pack"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={packId}
            onChange={(e) => setPackId(e.target.value)}
          >
            {packs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="summary">Summary</Label>
          <Input
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="success">Success condition</Label>
          <Input
            id="success"
            value={successCondition}
            onChange={(e) => setSuccessCondition(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={create}>Create reasoner</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-[var(--hr-wine)]">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{r.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {r.reasonerChannel} · {r.successCondition} · {r.status}
            </div>
            <p className="mt-1 text-sm">{r.reasonerSummary}</p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
