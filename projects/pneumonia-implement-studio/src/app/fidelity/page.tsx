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
  fidelitySignal: number;
  status: string;
};

type Ref = { id: string; label: string };

export function FidelityPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [packs, setPacks] = useState<Ref[]>([]);
  const [districts, setDistricts] = useState<Ref[]>([]);
  const [pathways, setPathways] = useState<Ref[]>([]);
  const [packId, setPackId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [pathwayId, setPathwayId] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("caregiver_delay");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [f, p, d, pw] = await Promise.all([
        api<{ items: Row[] }>("/api/fidelity"),
        api<{ items: Ref[] }>("/api/packs"),
        api<{ items: Ref[] }>("/api/districts"),
        api<{ items: Ref[] }>("/api/pathways"),
      ]);
      setItems(f.items);
      setPacks(p.items);
      setDistricts(d.items);
      setPathways(pw.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
      if (!districtId && d.items[0]) setDistrictId(d.items[0].id);
      if (!pathwayId && pw.items[0]) setPathwayId(pw.items[0].id);
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
      await api("/api/fidelity", {
        method: "POST",
        body: JSON.stringify({
          packId,
          districtId,
          pathwayId,
          label,
          kind,
          caretakerDelay: 0.3,
          referralFriction: 0.28,
          codesignIntensity: 0.5,
          fidelitySignal: 0.7,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Fidelity"
      subtitle="Record caregiver delay, referral completion, and CHW adherence signals for soft-sim compares."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="pack">Pack</Label>
          <select id="pack" className="w-full rounded-md border px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)}>
            {packs.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <Label htmlFor="district">District</Label>
          <select id="district" className="w-full rounded-md border px-3 py-2 text-sm" value={districtId} onChange={(e) => setDistrictId(e.target.value)}>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>{d.label}</option>
            ))}
          </select>
          <Label htmlFor="pathway">Pathway</Label>
          <select id="pathway" className="w-full rounded-md border px-3 py-2 text-sm" value={pathwayId} onChange={(e) => setPathwayId(e.target.value)}>
            {pathways.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Kind</Label>
          <select id="kind" className="w-full rounded-md border px-3 py-2 text-sm" value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="caregiver_delay">caregiver_delay</option>
            <option value="antibiotic_timing">antibiotic_timing</option>
            <option value="referral_completion">referral_completion</option>
            <option value="chw_adherence">chw_adherence</option>
            <option value="custom">custom</option>
          </select>
          <Button type="submit">Add fidelity run</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {row.kind} · fidelity {row.fidelitySignal} · {row.status}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default FidelityPage;
