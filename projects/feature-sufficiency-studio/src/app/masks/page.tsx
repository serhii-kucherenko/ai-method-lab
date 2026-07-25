"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Mask = {
  id: string;
  packId: string;
  label: string;
  presentFeatures: string[];
  coverageRatio: number;
  salienceHint: number;
  status: string;
};

export default function MasksPage() {
  const [items, setItems] = useState<Mask[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [features, setFeatures] = useState("ldl,hba1c,creatinine");
  const [coverageRatio, setCoverageRatio] = useState(0.4);
  const [salienceHint, setSalienceHint] = useState(0.65);
  const [error, setError] = useState("");

  async function load() {
    const data = await api<{ items: Mask[] }>("/api/masks");
    setItems(data.items);
  }

  useEffect(() => {
    api<{ items: Pack[] }>("/api/packs")
      .then((d) => {
        setPacks(d.items);
        if (d.items[0]) setPackId(d.items[0].id);
      })
      .catch(() => undefined);
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    if (!packId) {
      setError("Select a feature pack first");
      return;
    }
    try {
      await api("/api/masks", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label: label || "Untitled mask",
          presentFeatures: features
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          coverageRatio,
          salienceHint,
        }),
      });
      setLabel("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Observation masks"
      subtitle="Declare which features are present under partial observation."
    >
      {packs.length === 0 ? (
        <p className="mb-4 text-slate-500">
          Need a feature pack selected — create one on Features first.
        </p>
      ) : null}
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3">
        <div>
          <Label htmlFor="pack">Feature pack</Label>
          <select
            id="pack"
            className="mt-1 flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 text-sm"
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
          <Label htmlFor="label">Mask label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="features">Present features (comma-separated)</Label>
          <Input
            id="features"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="coverage">Coverage ratio</Label>
          <Input
            id="coverage"
            type="number"
            step="0.05"
            min={0}
            max={1}
            value={coverageRatio}
            onChange={(e) => setCoverageRatio(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="salience">Salience hint</Label>
          <Input
            id="salience"
            type="number"
            step="0.05"
            min={0}
            max={1}
            value={salienceHint}
            onChange={(e) => setSalienceHint(Number(e.target.value))}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={() => create()}>Create mask</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-slate-500">No observation masks yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((m) => (
            <li
              key={m.id}
              tabIndex={0}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium text-slate-900">{m.label}</div>
              <div className="mt-1 text-sm text-slate-500">
                {m.presentFeatures.join(", ")} · coverage {m.coverageRatio} ·
                salience {m.salienceHint} · {m.status}
              </div>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
