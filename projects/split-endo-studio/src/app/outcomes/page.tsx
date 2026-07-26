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
  bloodLoss: number;
  hospitalStay: number;
  status: string;
};

export function OutcomesPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [label, setLabel] = useState("Stay soft-sim");
  const [packId, setPackId] = useState("pack-demo");
  const [caseId, setCaseId] = useState("case-demo");
  const [approachId, setApproachId] = useState("approach-demo");
  const [bloodLoss, setBloodLoss] = useState("0.28");
  const [hospitalStay, setHospitalStay] = useState("0.32");

  const load = async () => {
    try {
      setItems((await api<{ items: Row[] }>("/api/outcomes")).items);
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
      await api("/api/outcomes", {
        method: "POST",
        body: JSON.stringify({
          packId,
          caseId,
          approachId,
          label,
          kind: "length_of_stay",
          bloodLoss: Number(bloodLoss),
          hospitalStay: Number(hospitalStay),
          complicationRate: 0.22,
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
      title="Outcomes"
      subtitle="Soft-sim blood loss, stay, and complication measures for dual compares."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="packId">Pack id</Label>
          <Input id="packId" value={packId} onChange={(e) => setPackId(e.target.value)} required />
          <Label htmlFor="caseId">Case id</Label>
          <Input id="caseId" value={caseId} onChange={(e) => setCaseId(e.target.value)} required />
          <Label htmlFor="approachId">Approach id</Label>
          <Input id="approachId" value={approachId} onChange={(e) => setApproachId(e.target.value)} required />
          <Label htmlFor="bloodLoss">Blood loss (0–1)</Label>
          <Input id="bloodLoss" value={bloodLoss} onChange={(e) => setBloodLoss(e.target.value)} required />
          <Label htmlFor="hospitalStay">Hospital stay (0–1)</Label>
          <Input id="hospitalStay" value={hospitalStay} onChange={(e) => setHospitalStay(e.target.value)} required />
          <Button type="submit">Create outcome</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                blood {row.bloodLoss} · stay {row.hospitalStay} · {row.kind} · {row.id}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default OutcomesPage;
