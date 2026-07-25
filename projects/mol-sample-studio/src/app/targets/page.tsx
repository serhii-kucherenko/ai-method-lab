"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Target = {
  id: string;
  packId: string;
  label: string;
  propertyCount: number;
  properties: string[];
  efficiencyWeight: number;
  status: string;
};

type Pack = { id: string; label: string };

export default function TargetsPage() {
  const [items, setItems] = useState<Target[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [label, setLabel] = useState("Lead-like property target");
  const [props, setProps] = useState("MW window, cLogP band, QED floor");
  const [weight, setWeight] = useState("0.65");
  const [error, setError] = useState("");

  async function load() {
    const [t, p] = await Promise.all([
      api<{ items: Target[] }>(`/api/targets?q=${encodeURIComponent(q)}`),
      api<{ items: Pack[] }>("/api/campaigns"),
    ]);
    setItems(t.items);
    setPacks(p.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    const packId = packs[0]?.id;
    if (!packId) {
      setError("Need a campaign pack first");
      return;
    }
    try {
      const properties = props.split(",").map((s) => s.trim()).filter(Boolean);
      await api("/api/targets", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          properties,
          propertyCount: properties.length,
          efficiencyWeight: Number(weight),
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Property targets"
      subtitle="Property windows with efficiency vs naive baseline weights."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search targets"
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
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3">
        <div>
          <Label>Label</Label>
          <Input value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>
        <div>
          <Label>Properties (comma-separated)</Label>
          <Input value={props} onChange={(e) => setProps(e.target.value)} />
        </div>
        <div>
          <Label>Efficiency weight</Label>
          <Input value={weight} onChange={(e) => setWeight(e.target.value)} />
        </div>
        <div className="md:col-span-3">
          <Button onClick={create}>Create property target</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--ms-teal)]">{error}</p>
      ) : null}
      <ul className="space-y-2">
        {items.map((t) => (
          <li
            key={t.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{t.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {t.propertyCount} properties · efficiency {t.efficiencyWeight} ·{" "}
              {t.status}
            </div>
            <div className="mt-1 text-xs text-[color-mix(in_srgb,var(--studio-ink)_45%,transparent)]">
              {t.properties.join(" · ")}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
