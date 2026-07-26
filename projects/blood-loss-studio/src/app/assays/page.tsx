"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Opt = { id: string; label: string };
type Row = {
  id: string;
  label: string;
  kind: string;
  swabMassFidelity: number;
  hbDeltaCoverage: number;
  status: string;
};

export function AssaysPage() {
  const [packs, setPacks] = useState<Opt[]>([]);
  const [births, setBirths] = useState<Opt[]>([]);
  const [methods, setMethods] = useState<Opt[]>([]);
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("");
  const [birthId, setBirthId] = useState("");
  const [methodId, setMethodId] = useState("");
  const [label, setLabel] = useState("");
  const [swab, setSwab] = useState("0.55");
  const [hb, setHb] = useState("0.35");

  const load = async () => {
    try {
      const [p, b, m, a] = await Promise.all([
        api<{ items: Opt[] }>("/api/packs"),
        api<{ items: Opt[] }>("/api/births"),
        api<{ items: Opt[] }>("/api/methods"),
        api<{ items: Row[] }>("/api/assays"),
      ]);
      setPacks(p.items);
      setBirths(b.items);
      setMethods(m.items);
      setItems(a.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
      if (!birthId && b.items[0]) setBirthId(b.items[0].id);
      if (!methodId && m.items[0]) setMethodId(m.items[0].id);
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
          birthId,
          methodId,
          label,
          kind: "haemoglobin_delta",
          swabMassFidelity: Number(swab),
          hbDeltaCoverage: Number(hb),
          assayFidelity: 0.7,
          assayReadout: 0.65,
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
      subtitle="Record haemoglobin-delta and related assay runs tied to births and methods."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="pack">Pack</Label>
          <select id="pack" className="w-full rounded-md border px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)} required>
            {packs.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <Label htmlFor="birth">Birth</Label>
          <select id="birth" className="w-full rounded-md border px-3 py-2 text-sm" value={birthId} onChange={(e) => setBirthId(e.target.value)} required>
            {births.map((b) => (
              <option key={b.id} value={b.id}>{b.label}</option>
            ))}
          </select>
          <Label htmlFor="method">Method</Label>
          <select id="method" className="w-full rounded-md border px-3 py-2 text-sm" value={methodId} onChange={(e) => setMethodId(e.target.value)} required>
            {methods.map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="swab">Swab mass fidelity</Label>
          <Input id="swab" value={swab} onChange={(e) => setSwab(e.target.value)} />
          <Label htmlFor="hb">HB delta coverage</Label>
          <Input id="hb" value={hb} onChange={(e) => setHb(e.target.value)} />
          <Button type="submit">Create assay</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {row.kind} · swab {row.swabMassFidelity} · hb {row.hbDeltaCoverage} · {row.status}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default AssaysPage;
