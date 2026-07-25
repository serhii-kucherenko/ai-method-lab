"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Fusion = {
  id: string;
  label: string;
  fusionSummary: string;
  successCondition: string;
  fusionChannel: string;
  status: string;
};

export default function FusionsPage() {
  const [items, setItems] = useState<Fusion[]>([]);
  const [q, setQ] = useState("");
  const [label, setLabel] = useState("Marker-free deformable config");
  const [fusionSummary, setFusionSummary] = useState(
    "Soft-sim marker-free deformable registration for positive margin localization.",
  );
  const [successCondition, setSuccessCondition] = useState("lock_soft_sim");
  const [fusionChannel, setFusionChannel] = useState("soft_sim_margin");
  const [error, setError] = useState("");

  async function load() {
    const data = await api<{ items: Fusion[] }>(
      `/api/fusions?q=${encodeURIComponent(q)}`,
    );
    setItems(data.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/fusions", {
        method: "POST",
        body: JSON.stringify({
          label,
          fusionSummary,
          successCondition,
          fusionChannel,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Fusion configs"
      subtitle="Configure deformable fusion channels and pack-lock success conditions."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search fusions"
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
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="channel">Fusion channel</Label>
          <Input
            id="channel"
            value={fusionChannel}
            onChange={(e) => setFusionChannel(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="summary">Fusion summary</Label>
          <Input
            id="summary"
            value={fusionSummary}
            onChange={(e) => setFusionSummary(e.target.value)}
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
          <Button onClick={create}>Create fusion config</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((f) => (
          <li
            key={f.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{f.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {f.fusionChannel} · {f.successCondition} · {f.status}
            </div>
            <p className="mt-1 text-sm">{f.fusionSummary}</p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
