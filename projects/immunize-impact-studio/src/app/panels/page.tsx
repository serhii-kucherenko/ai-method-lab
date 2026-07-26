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
  dtp3Coverage: number;
  measlesCoverage: number;
  underFiveMortality: number;
  status: string;
};

export function Page() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [label, setLabel] = useState("");
  const [dtp3, setDtp3] = useState("0.72");
  const [measles, setMeasles] = useState("0.68");
  const [mortality, setMortality] = useState("0.28");
  const [packId, setPackId] = useState("pack-demo");
  const [countryId, setCountryId] = useState("country-demo");
  const [antigenId, setAntigenId] = useState("antigen-demo");

  const load = async () => {
    try {
      setItems((await api<{ items: Row[] }>("/api/panels")).items);
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
      await api("/api/panels", {
        method: "POST",
        body: JSON.stringify({
          packId,
          countryId,
          antigenId,
          label,
          kind: "under_five_mortality",
          dtp3Coverage: Number(dtp3),
          measlesCoverage: Number(measles),
          underFiveMortality: Number(mortality),
          assaySignal: 0.7,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Mortality panels"
      subtitle="Capture under-five mortality panel runs that link coverage to survival soft-sims."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="packId">Pack id</Label>
          <Input id="packId" value={packId} onChange={(e) => setPackId(e.target.value)} required />
          <Label htmlFor="countryId">Country id</Label>
          <Input id="countryId" value={countryId} onChange={(e) => setCountryId(e.target.value)} required />
          <Label htmlFor="antigenId">Antigen id</Label>
          <Input id="antigenId" value={antigenId} onChange={(e) => setAntigenId(e.target.value)} required />
          <Label htmlFor="dtp3">DTP3 coverage</Label>
          <Input id="dtp3" value={dtp3} onChange={(e) => setDtp3(e.target.value)} required />
          <Label htmlFor="measles">Measles coverage</Label>
          <Input id="measles" value={measles} onChange={(e) => setMeasles(e.target.value)} required />
          <Label htmlFor="mortality">Under-five mortality index</Label>
          <Input id="mortality" value={mortality} onChange={(e) => setMortality(e.target.value)} required />
          <Button type="submit">Add panel</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                DTP3 {row.dtp3Coverage} · MCV {row.measlesCoverage} · U5M{" "}
                {row.underFiveMortality} · {row.id}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default Page;
