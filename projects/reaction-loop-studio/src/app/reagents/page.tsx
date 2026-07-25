"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Reagent = {
  id: string;
  packId: string;
  label: string;
  family: string;
  solventSet: string;
  catalystSet: string;
  tempMinC: number;
  tempMaxC: number;
  metricHint: string;
  status: string;
};

type Pack = { id: string; label: string };

export default function ReagentsPage() {
  const [items, setItems] = useState<Reagent[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Pd / aryl halide solvent space");
  const [family, setFamily] = useState("suzuki");
  const [solventSet, setSolventSet] = useState("toluene,dioxane,DMF");
  const [catalystSet, setCatalystSet] = useState("Pd(PPh3)4,Pd(dppf)Cl2");
  const [tempMinC, setTempMinC] = useState("60");
  const [tempMaxC, setTempMaxC] = useState("110");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [reagents, packsRes] = await Promise.all([
      api<{ items: Reagent[] }>(`/api/reagents?q=${encodeURIComponent(q)}`),
      api<{ items: Pack[] }>("/api/campaigns"),
    ]);
    setItems(reagents.items);
    setPacks(packsRes.items);
    if (!packId && packsRes.items[0]) setPackId(packsRes.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/reagents", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          family,
          solventSet,
          catalystSet,
          tempMinC: Number(tempMinC),
          tempMaxC: Number(tempMaxC),
          metricHint: "Yield + chemoselectivity under chemist gate",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Reagent spaces"
      subtitle="Define solvent/catalyst sets, temperature bands, and soft-sim metrics."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search reagents"
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
          <Label htmlFor="pack">Campaign pack</Label>
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
          <Label htmlFor="family">Family</Label>
          <select
            id="family"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={family}
            onChange={(e) => setFamily(e.target.value)}
          >
            <option value="suzuki">Suzuki</option>
            <option value="amide">Amide</option>
            <option value="snar">SNAr</option>
            <option value="hydrogenation">Hydrogenation</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
        <div>
          <Label htmlFor="solvents">Solvent set</Label>
          <Input
            id="solvents"
            value={solventSet}
            onChange={(e) => setSolventSet(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="catalysts">Catalyst set</Label>
          <Input
            id="catalysts"
            value={catalystSet}
            onChange={(e) => setCatalystSet(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="tmin">Temp min °C</Label>
          <Input
            id="tmin"
            value={tempMinC}
            onChange={(e) => setTempMinC(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="tmax">Temp max °C</Label>
          <Input
            id="tmax"
            value={tempMaxC}
            onChange={(e) => setTempMaxC(e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <Button onClick={create}>Create reagent space</Button>
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
              {t.family} · {t.solventSet} · {t.catalystSet} · {t.tempMinC}–
              {t.tempMaxC}°C · {t.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
