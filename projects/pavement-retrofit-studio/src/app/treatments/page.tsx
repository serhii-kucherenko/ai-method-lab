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
  materialHint: string;
  status: string;
  tio2Floor: number;
  durabilityFloor: number;
};

export function TreatmentsPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("pack-demo");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("tio2_overlay");
  const [materialHint, setMaterialHint] = useState("");
  const [tio2Floor, setTio2Floor] = useState("0.4");
  const [durabilityFloor, setDurabilityFloor] = useState("0.35");

  const load = async () => {
    try {
      setItems((await api<{ items: Row[] }>("/api/treatments")).items);
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
      await api("/api/treatments", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          materialHint,
          tio2Floor: Number(tio2Floor),
          durabilityFloor: Number(durabilityFloor),
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  const archive = async (id: string) => {
    await api("/api/treatments", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  };

  return (
    <StudioShell
      title="Treatments"
      subtitle="Configure photocatalytic overlays and sealcoats — soft-sim specs, not construction orders."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="packId">Pack id</Label>
          <Input id="packId" value={packId} onChange={(e) => setPackId(e.target.value)} required />
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Kind</Label>
          <Input id="kind" value={kind} onChange={(e) => setKind(e.target.value)} required />
          <Label htmlFor="material">Material hint</Label>
          <Input id="material" value={materialHint} onChange={(e) => setMaterialHint(e.target.value)} required />
          <Label htmlFor="tio2">TiO2 floor</Label>
          <Input id="tio2" value={tio2Floor} onChange={(e) => setTio2Floor(e.target.value)} required />
          <Label htmlFor="durability">Durability floor</Label>
          <Input id="durability" value={durabilityFloor} onChange={(e) => setDurabilityFloor(e.target.value)} required />
          <Button type="submit">Create treatment</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift flex items-center justify-between rounded-lg border bg-white px-4 py-3">
              <div>
                <p className="font-medium">{row.label}</p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                  {row.kind} · {row.materialHint} · TiO2 {row.tio2Floor} · durability {row.durabilityFloor} · {row.status}
                </p>
              </div>
              <Button type="button" variant="outline" onClick={() => void archive(row.id)}>
                Archive
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default TreatmentsPage;
