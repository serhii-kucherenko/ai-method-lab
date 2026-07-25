"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  label: string;
  kind: string;
  nanodomainLocalization: number;
  pdePryStrength: number;
  assaySignal: number;
};

export function AssaysPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("diastolic_restore");
  const [nanodomainLocalization, setNanodomainLocalization] = useState("0.7");
  const [pdePryStrength, setPdePryStrength] = useState("0.65");
  const [assaySignal, setAssaySignal] = useState("0.7");

  const load = async () => {
    try {
      setItems((await api<{ items: Row[] }>("/api/assays")).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/assays", {
        method: "POST",
        body: JSON.stringify({
          label,
          kind,
          nanodomainLocalization: Number(nanodomainLocalization),
          pdePryStrength: Number(pdePryStrength),
          assaySignal: Number(assaySignal),
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Assay runs"
      subtitle="Soft-sim diastolic restore, systolic preserve, and phosphorylation map assays."
    >
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Kind</Label>
          <Input id="kind" value={kind} onChange={(e) => setKind(e.target.value)} required />
          <Label htmlFor="loc">Localization</Label>
          <Input id="loc" value={nanodomainLocalization} onChange={(e) => setNanodomainLocalization(e.target.value)} />
          <Label htmlFor="pry">PDE pry</Label>
          <Input id="pry" value={pdePryStrength} onChange={(e) => setPdePryStrength(e.target.value)} />
          <Label htmlFor="sig">Assay signal</Label>
          <Input id="sig" value={assaySignal} onChange={(e) => setAssaySignal(e.target.value)} />
          <Button>Create assay</Button>
        </form>
        <section>
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          <ul className="space-y-3">
            {items.map((row) => (
              <li key={row.id} className="row-lift rounded-lg border bg-white p-4">
                <p className="font-semibold">{row.label}</p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                  {row.kind} · loc {row.nanodomainLocalization} · pry {row.pdePryStrength} · signal {row.assaySignal}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </StudioShell>
  );
}

export default AssaysPage;
