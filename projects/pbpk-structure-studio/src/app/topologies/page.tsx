"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Topology = {
  id: string;
  packId: string;
  label: string;
  domain: string;
  organCount: number;
  structureWeight: number;
  topologyWeight: number;
  smilesHint: string;
  status: string;
};

type Pack = { id: string; label: string };

export default function TopologiesPage() {
  const [items, setItems] = useState<Topology[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Whole-body topology graph");
  const [domain, setDomain] = useState("cns");
  const [organCount, setOrganCount] = useState("14");
  const [structureWeight, setStructureWeight] = useState("0.58");
  const [smilesHint, setSmilesHint] = useState("CC(=O)Oc1ccccc1C(=O)O");
  const [error, setError] = useState("");

  async function load() {
    const [tops, pks] = await Promise.all([
      api<{ items: Topology[] }>(
        `/api/topologies?q=${encodeURIComponent(q)}`,
      ),
      api<{ items: Pack[] }>("/api/compounds"),
    ]);
    setItems(tops.items);
    setPacks(pks.items);
    if (!packId && pks.items[0]) setPackId(pks.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/topologies", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          domain,
          organCount: Number(organCount),
          structureWeight: Number(structureWeight),
          smilesHint,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Topology graphs"
      subtitle="Compile whole-body topology graphs from structure-only SMILES hints."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search topologies"
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
          <Label htmlFor="pack">Compound pack</Label>
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
            {[
              "small_molecule",
              "peptide",
              "adc",
              "prodrug",
              "cns",
              "mixed",
            ].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="organs">Organ count</Label>
          <Input
            id="organs"
            value={organCount}
            onChange={(e) => setOrganCount(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="sw">Structure weight</Label>
          <Input
            id="sw"
            value={structureWeight}
            onChange={(e) => setStructureWeight(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="smiles">SMILES hint</Label>
          <Input
            id="smiles"
            value={smilesHint}
            onChange={(e) => setSmilesHint(e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <Button onClick={create}>Compile topology</Button>
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
              {t.domain} · {t.organCount} organs · S{" "}
              {t.structureWeight.toFixed(2)} / T {t.topologyWeight.toFixed(2)} ·{" "}
              {t.smilesHint || "—"} · {t.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
