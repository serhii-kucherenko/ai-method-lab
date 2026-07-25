"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Specimen = {
  id: string;
  packId: string;
  label: string;
  domain: string;
  sliceCount: number;
  surfaceWeight: number;
  deformableWeight: number;
  status: string;
};

type Pack = { id: string; label: string };

export default function SpecimensPage() {
  const [items, setItems] = useState<Specimen[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("New specimen scan");
  const [domain, setDomain] = useState("breast");
  const [sliceCount, setSliceCount] = useState("48");
  const [surfaceWeight, setSurfaceWeight] = useState("0.58");
  const [error, setError] = useState("");

  async function load() {
    const [specimens, cases] = await Promise.all([
      api<{ items: Specimen[] }>(
        `/api/specimens?q=${encodeURIComponent(q)}`,
      ),
      api<{ items: Pack[] }>("/api/cases"),
    ]);
    setItems(specimens.items);
    setPacks(cases.items);
    if (!packId && cases.items[0]) setPackId(cases.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/specimens", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          domain,
          sliceCount: Number(sliceCount),
          surfaceWeight: Number(surfaceWeight),
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Specimen scans"
      subtitle="Import soft-sim specimen scans and set surface vs deformable weights."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search specimens"
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
          <Label htmlFor="pack">Case pack</Label>
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
          <Input
            id="domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="slices">Slice count</Label>
          <Input
            id="slices"
            value={sliceCount}
            onChange={(e) => setSliceCount(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="surface">Surface weight</Label>
          <Input
            id="surface"
            value={surfaceWeight}
            onChange={(e) => setSurfaceWeight(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={create}>Import specimen</Button>
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
              {s.domain} · {s.sliceCount} slices · surface{" "}
              {s.surfaceWeight.toFixed(2)} · deformable{" "}
              {s.deformableWeight.toFixed(2)} · {s.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
