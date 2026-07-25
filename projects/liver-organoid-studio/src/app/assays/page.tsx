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
  status: string;
  multicellularComplexity?: number;
  hepatocyteLikeFidelity?: number;
};

export function AssaysPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [label, setLabel] = useState("Differentiation soft-sim");
  const [complexity, setComplexity] = useState("0.68");
  const [fidelity, setFidelity] = useState("0.72");
  const [day, setDay] = useState("0.74");

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
          kind: "differentiation_day",
          multicellularComplexity: Number(complexity),
          hepatocyteLikeFidelity: Number(fidelity),
          differentiationDay: Number(day),
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Assays"
      subtitle="Run soft-sim differentiation and multicellular integrity assays tied to a model pack."
    >
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
          />
          <Label htmlFor="complexity">Multicellular complexity</Label>
          <Input
            id="complexity"
            value={complexity}
            onChange={(e) => setComplexity(e.target.value)}
          />
          <Label htmlFor="fidelity">Hepatocyte-like fidelity</Label>
          <Input
            id="fidelity"
            value={fidelity}
            onChange={(e) => setFidelity(e.target.value)}
          />
          <Label htmlFor="day">Differentiation day</Label>
          <Input
            id="day"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          />
          <Button>Create assay</Button>
        </form>
        <section>
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          <ul className="space-y-3">
            {items.map((row) => (
              <li key={row.id} className="row-lift rounded-lg border bg-white p-4">
                <p className="font-semibold">{row.label}</p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                  complexity {row.multicellularComplexity} · fidelity{" "}
                  {row.hepatocyteLikeFidelity}
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
