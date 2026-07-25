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
  featureCount: number;
  federationWeight: number;
  status: string;
};

export default function FeaturesPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Schema[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [features, setFeatures] = useState("Age, Systolic BP, LDL, HDL");
  const [federationWeight, setFederationWeight] = useState("0.6");
  const [error, setError] = useState("");

  async function load() {
    const [p, s] = await Promise.all([
      api<{ items: Pack[] }>("/api/cohorts"),
      api<{ items: Schema[] }>("/api/features?kind=schemas"),
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
      const list = features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);
      await api("/api/features", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label: label || "Untitled feature schema",
          features: list,
          featureCount: list.length,
          federationWeight: Number(federationWeight),
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
      title="Feature schemas"
      subtitle="Lock CVD feature lists and federation vs central weights."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Cohort pack</Label>
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
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="features">Features (comma-separated)</Label>
          <Input
            id="features"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="fw">Federation weight</Label>
          <Input
            id="fw"
            value={federationWeight}
            onChange={(e) => setFederationWeight(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={() => create()}>Create feature schema</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      <ul className="space-y-3">
        {items.map((s) => (
          <li
            key={s.id}
            className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <div className="font-medium">{s.label}</div>
            <div className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {s.featureCount} features · federation weight{" "}
              {s.federationWeight} · {s.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
