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
  domain: string;
  poreDiameterNm: number;
  surfaceAreaWeight: number;
  selectivityWeight: number;
  metricHint: string;
  status: string;
};

type Pack = { id: string; label: string };

export default function TargetsPage() {
  const [items, setItems] = useState<Target[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Selective micropore target");
  const [domain, setDomain] = useState("co2_capture");
  const [poreDiameterNm, setPoreDiameterNm] = useState("0.85");
  const [surfaceAreaWeight, setSurfaceAreaWeight] = useState("0.58");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [targets, packsRes] = await Promise.all([
      api<{ items: Target[] }>(`/api/targets?q=${encodeURIComponent(q)}`),
      api<{ items: Pack[] }>("/api/materials"),
    ]);
    setItems(targets.items);
    setPacks(packsRes.items);
    if (!packId && packsRes.items[0]) setPackId(packsRes.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/targets", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          domain,
          poreDiameterNm: Number(poreDiameterNm),
          surfaceAreaWeight: Number(surfaceAreaWeight),
          metricHint: "BET + selectivity",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Pore targets"
      subtitle="Define pore diameter, surface-area vs selectivity weights, and soft-sim metrics."
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
        <div>
          <Label htmlFor="domain">Domain</Label>
          <select
            id="domain"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          >
            <option value="mof">MOF</option>
            <option value="zeolite">Zeolite</option>
            <option value="co2_capture">CO₂ capture</option>
            <option value="energy_storage">Energy storage</option>
            <option value="catalysis">Catalysis</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
        <div>
          <Label htmlFor="diam">Pore diameter (nm)</Label>
          <Input
            id="diam"
            value={poreDiameterNm}
            onChange={(e) => setPoreDiameterNm(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="sa">Surface area weight</Label>
          <Input
            id="sa"
            value={surfaceAreaWeight}
            onChange={(e) => setSurfaceAreaWeight(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={create}>Create pore target</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((t) => (
          <li
            key={t.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{t.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {t.domain} · {t.poreDiameterNm} nm · SA {t.surfaceAreaWeight} ·
              sel {t.selectivityWeight} · {t.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
