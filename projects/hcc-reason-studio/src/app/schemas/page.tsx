"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Schema = {
  id: string;
  label: string;
  cueCount: number;
  cues: string[];
  reasoningWeight: number;
  status: string;
};

export default function SchemasPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Schema[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Primary HCC cue schema");
  const [cues, setCues] = useState("AFP trend, Lesion size, LI-RADS cue");
  const [reasoningWeight, setReasoningWeight] = useState("0.65");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [p, s] = await Promise.all([
      api<{ items: Pack[] }>("/api/pathways"),
      api<{ items: Schema[] }>(`/api/schemas?q=${encodeURIComponent(q)}`),
    ]);
    setPacks(p.items);
    setItems(s.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      const cueList = cues
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      await api("/api/schemas", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          cues: cueList,
          cueCount: cueList.length,
          reasoningWeight: Number(reasoningWeight),
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Risk schemas"
      subtitle="Clinical cues and reasoning vs baseline weights."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search schemas"
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
        <div>
          <Label htmlFor="cues">Cues (comma-separated)</Label>
          <Input id="cues" value={cues} onChange={(e) => setCues(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="rw">Reasoning weight</Label>
          <Input
            id="rw"
            value={reasoningWeight}
            onChange={(e) => setReasoningWeight(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Create schema</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-[var(--hr-wine)]">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((s) => (
          <li
            key={s.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{s.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {s.cueCount} cues · reasoning {s.reasoningWeight} · {s.status}
            </div>
            <div className="mt-1 text-xs">{s.cues.join(", ")}</div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
