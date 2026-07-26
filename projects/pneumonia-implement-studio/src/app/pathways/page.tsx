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
  modelHint: string;
  status: string;
};

type Pack = { id: string; label: string };

export function PathwaysPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("cfir_codesign");
  const [modelHint, setModelHint] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [d, p] = await Promise.all([
        api<{ items: Row[] }>("/api/pathways"),
        api<{ items: Pack[] }>("/api/packs"),
      ]);
      setItems(d.items);
      setPacks(p.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
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
      await api("/api/pathways", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          modelHint,
          codesignFloor: 0.45,
          clarityFloor: 0.4,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Pathways"
      subtitle="Configure CFIR co-design and status-quo childhood pneumonia care pathways for soft-sim scoring."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="pack">Pack</Label>
          <select
            id="pack"
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={packId}
            onChange={(e) => setPackId(e.target.value)}
          >
            {packs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Kind</Label>
          <select
            id="kind"
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            <option value="cfir_codesign">cfir_codesign</option>
            <option value="imci_status_quo">imci_status_quo</option>
            <option value="hybrid_codesign">hybrid_codesign</option>
            <option value="referral_only">referral_only</option>
            <option value="custom">custom</option>
          </select>
          <Label htmlFor="model">Model hint</Label>
          <Input id="model" value={modelHint} onChange={(e) => setModelHint(e.target.value)} required />
          <Button type="submit">Add pathway</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {row.kind} · {row.modelHint} · {row.status}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default PathwaysPage;
