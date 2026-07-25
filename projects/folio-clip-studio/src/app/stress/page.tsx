"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Stress = {
  id: string;
  label: string;
  stressText: string;
  successCondition: string;
  stressChannel: string;
  status: string;
};

type Pack = { id: string; label: string };

export default function StressPage() {
  const [items, setItems] = useState<Stress[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Early drought stress gate");
  const [stressText, setStressText] = useState(
    "Catch early drought with multimodal wearables before a single channel misses it.",
  );
  const [successCondition, setSuccessCondition] = useState("lock_soft_sim");
  const [stressChannel, setStressChannel] = useState("soft_sim_drought");
  const [error, setError] = useState("");

  async function load() {
    const [stresses, ps] = await Promise.all([
      api<{ items: Stress[] }>("/api/stress"),
      api<{ items: Pack[] }>("/api/clips"),
    ]);
    setItems(stresses.items);
    setPacks(ps.items);
    if (!packId && ps.items[0]) setPackId(ps.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/stress", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          stressText,
          successCondition,
          stressChannel,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Stress signals"
      subtitle="Plant-stress detection gates for soft-sim clip locking."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Clip pack</Label>
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
          <Label htmlFor="text">Stress text</Label>
          <Input
            id="text"
            value={stressText}
            onChange={(e) => setStressText(e.target.value)}
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
        <div>
          <Label htmlFor="channel">Stress channel</Label>
          <Input
            id="channel"
            value={stressChannel}
            onChange={(e) => setStressChannel(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={create}>Create stress signal</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((s) => (
          <li
            key={s.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{s.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {s.stressChannel} · {s.successCondition} · {s.status}
            </div>
            <p className="mt-1 text-sm">{s.stressText}</p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
