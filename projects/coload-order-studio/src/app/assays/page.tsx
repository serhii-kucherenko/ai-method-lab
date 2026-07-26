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
  orderFidelity: number;
  chemoEncapsulation: number;
  photoEncapsulation: number;
  status: string;
};

export function AssaysPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [label, setLabel] = useState("");
  const [packId, setPackId] = useState("pack-demo");
  const [carrierId, setCarrierId] = useState("carrier-demo");
  const [loadId, setLoadId] = useState("load-demo");
  const [kind, setKind] = useState("encapsulation_efficiency");
  const [orderFidelity, setOrderFidelity] = useState("0.7");
  const [chemoEncapsulation, setChemo] = useState("0.65");
  const [photoEncapsulation, setPhoto] = useState("0.7");
  const [assaySignal, setSignal] = useState("0.7");

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
          packId,
          carrierId,
          loadId,
          label,
          kind,
          orderFidelity: Number(orderFidelity),
          chemoEncapsulation: Number(chemoEncapsulation),
          photoEncapsulation: Number(photoEncapsulation),
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
      subtitle="Soft-sim encapsulation and photothermal assays for ordered co-load sequences — not wet-lab GMP manufacture."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="packId">Pack</Label>
          <Input id="packId" value={packId} onChange={(e) => setPackId(e.target.value)} />
          <Label htmlFor="carrierId">Carrier</Label>
          <Input id="carrierId" value={carrierId} onChange={(e) => setCarrierId(e.target.value)} />
          <Label htmlFor="loadId">Load</Label>
          <Input id="loadId" value={loadId} onChange={(e) => setLoadId(e.target.value)} />
          <Label htmlFor="kind">Kind</Label>
          <Input id="kind" value={kind} onChange={(e) => setKind(e.target.value)} />
          <Label htmlFor="order">Order fidelity</Label>
          <Input id="order" value={orderFidelity} onChange={(e) => setOrderFidelity(e.target.value)} />
          <Label htmlFor="chemo">Chemo encapsulation</Label>
          <Input id="chemo" value={chemoEncapsulation} onChange={(e) => setChemo(e.target.value)} />
          <Label htmlFor="photo">Photo encapsulation</Label>
          <Input id="photo" value={photoEncapsulation} onChange={(e) => setPhoto(e.target.value)} />
          <Label htmlFor="signal">Assay signal</Label>
          <Input id="signal" value={assaySignal} onChange={(e) => setSignal(e.target.value)} />
          <Button type="submit">Create assay</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-xs text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {row.kind} · order {row.orderFidelity} · chemo {row.chemoEncapsulation} · photo{" "}
                {row.photoEncapsulation}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default AssaysPage;
