"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Opt = { id: string; label: string };
type Row = Opt & { kind: string; scaffoldHint: string; status: string };

export function RoutesPage() {
  const [packs, setPacks] = useState<Opt[]>([]);
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [scaffoldHint, setScaffoldHint] = useState("aryl-cyclopropane");
  const [kind, setKind] = useState("aryl_cyclopropane");

  const load = async () => {
    try {
      const [p, t] = await Promise.all([
        api<{ items: Opt[] }>("/api/packs"),
        api<{ items: Row[] }>("/api/routes"),
      ]);
      setPacks(p.items);
      setItems(t.items);
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
      await api("/api/routes", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          scaffoldHint,
          coverageFloor: 0.45,
          fidelityFloor: 0.4,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Routes"
      subtitle="Configure aryl cyclopropane and diarylpropylamine route panels for soft-sim packs."
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
            required
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
            <option value="aryl_cyclopropane">aryl_cyclopropane</option>
            <option value="diarylpropylamine">diarylpropylamine</option>
            <option value="aminoaryl_panel">aminoaryl_panel</option>
            <option value="route_cohort">route_cohort</option>
            <option value="composite_pack">composite_pack</option>
            <option value="custom">custom</option>
          </select>
          <Label htmlFor="scaffold">Scaffold hint</Label>
          <Input
            id="scaffold"
            value={scaffoldHint}
            onChange={(e) => setScaffoldHint(e.target.value)}
            required
          />
          <Button type="submit">Create route</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {row.kind} · {row.scaffoldHint} · {row.status}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default RoutesPage;
