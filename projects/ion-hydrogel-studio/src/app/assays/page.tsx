"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  chargeRegulation: number;
  ionMobility: number;
  gelPermeability: number;
  swellingRatio: number;
  runNotes: string;
};

export function AssaysPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [chargeRegulation, setChargeRegulation] = useState("0.62");
  const [ionMobility, setIonMobility] = useState("0.7");
  const [gelPermeability, setGelPermeability] = useState("0.74");
  const [swellingRatio, setSwellingRatio] = useState("0.68");
  const [runNotes, setRunNotes] = useState("");

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
          chargeRegulation: Number(chargeRegulation),
          ionMobility: Number(ionMobility),
          gelPermeability: Number(gelPermeability),
          swellingRatio: Number(swellingRatio),
          runNotes,
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
      subtitle="Soft-sim ion-transport assays linking gel, charge, and salt refs."
    >
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="chargeRegulation">Charge regulation</Label>
          <Input
            id="chargeRegulation"
            value={chargeRegulation}
            onChange={(e) => setChargeRegulation(e.target.value)}
          />
          <Label htmlFor="ionMobility">Ion mobility</Label>
          <Input
            id="ionMobility"
            value={ionMobility}
            onChange={(e) => setIonMobility(e.target.value)}
          />
          <Label htmlFor="gelPermeability">Gel permeability</Label>
          <Input
            id="gelPermeability"
            value={gelPermeability}
            onChange={(e) => setGelPermeability(e.target.value)}
          />
          <Label htmlFor="swellingRatio">Swelling ratio</Label>
          <Input
            id="swellingRatio"
            value={swellingRatio}
            onChange={(e) => setSwellingRatio(e.target.value)}
          />
          <Label htmlFor="runNotes">Notes</Label>
          <Input
            id="runNotes"
            value={runNotes}
            onChange={(e) => setRunNotes(e.target.value)}
          />
          <Button>Create assay</Button>
        </form>
        <section>
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          <ul className="space-y-3">
            {items.map((row) => (
              <li key={row.id} className="row-lift rounded-lg border bg-white p-4">
                <p className="font-semibold">{row.id}</p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                  regulation {row.chargeRegulation} · mobility {row.ionMobility} ·
                  permeability {row.gelPermeability}
                </p>
                {row.runNotes ? (
                  <p className="mt-1 text-sm">{row.runNotes}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </StudioShell>
  );
}

export default AssaysPage;
