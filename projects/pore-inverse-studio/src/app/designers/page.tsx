"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Designer = {
  id: string;
  label: string;
  designerSummary: string;
  successCondition: string;
  designerChannel: string;
  status: string;
};

type Pack = { id: string; label: string };

export default function DesignersPage() {
  const [items, setItems] = useState<Designer[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Unified inverse designer");
  const [designerSummary, setDesignerSummary] = useState(
    "Soft-sim unified inverse design across CO₂ and storage.",
  );
  const [successCondition, setSuccessCondition] = useState("lock_soft_sim");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [designers, packsRes] = await Promise.all([
      api<{ items: Designer[] }>(
        `/api/designers?q=${encodeURIComponent(q)}`,
      ),
      api<{ items: Pack[] }>("/api/materials"),
    ]);
    setItems(designers.items);
    setPacks(packsRes.items);
    if (!packId && packsRes.items[0]) setPackId(packsRes.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/designers", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          designerSummary,
          successCondition,
          designerChannel: "soft_sim_pore",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Inverse designers"
      subtitle="Configure unified inverse-design summaries and pack lock success conditions."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search designers"
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
          <Label htmlFor="pack">Materials pack</Label>
          <select
            id="pack"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
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
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="summary">Designer summary</Label>
          <Input
            id="summary"
            value={designerSummary}
            onChange={(e) => setDesignerSummary(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="success">Success condition</Label>
          <select
            id="success"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={successCondition}
            onChange={(e) => setSuccessCondition(e.target.value)}
          >
            <option value="hold_pack">hold_pack</option>
            <option value="review">review</option>
            <option value="lock_soft_sim">lock_soft_sim</option>
            <option value="strong_lock">strong_lock</option>
          </select>
        </div>
        <div className="flex items-end">
          <Button onClick={create}>Create designer config</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((d) => (
          <li
            key={d.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{d.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {d.designerSummary} · {d.successCondition} · {d.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
