"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = Record<string, string | number | undefined> & { id: string; label: string; status: string };
type Ref = { id: string; label: string };

export function ScenariosPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [packs, setPacks] = useState<Ref[]>([]);
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("ssp585");
  const [horizonHint, setHorizonHint] = useState("2040-2060");
  const [thermalFloor, setThermalFloor] = useState("0.45");
  const [shiftFloor, setShiftFloor] = useState("0.4");

  const load = async () => {
    try {
      const [scenarioList, packList] = await Promise.all([
        api<{ items: Row[] }>("/api/scenarios"),
        api<{ items: Ref[] }>("/api/packs"),
      ]);
      setItems(scenarioList.items);
      setPacks(packList.items);
      if (!packId && packList.items[0]) setPackId(packList.items[0].id);
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
      await api("/api/scenarios", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          horizonHint,
          thermalFloor: Number(thermalFloor),
          shiftFloor: Number(shiftFloor),
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  const archive = async (id: string) => {
    await api("/api/scenarios", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  };

  return (
    <StudioShell
      title="Climate scenarios"
      subtitle="Configure CMIP6 SSP horizons for thermal-suitability soft-sim — not live outbreak forecast layers."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="pack">Pack</Label>
          <select id="pack" className="w-full rounded-md border px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)}>
            {packs.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Scenario kind</Label>
          <select id="kind" className="w-full rounded-md border px-3 py-2 text-sm" value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="ssp126">ssp126</option>
            <option value="ssp245">ssp245</option>
            <option value="ssp370">ssp370</option>
            <option value="ssp585">ssp585</option>
            <option value="historical">historical</option>
            <option value="custom">custom</option>
          </select>
          <Label htmlFor="horizon">Horizon hint</Label>
          <Input id="horizon" value={horizonHint} onChange={(e) => setHorizonHint(e.target.value)} />
          <Label htmlFor="thermal">Thermal floor</Label>
          <Input id="thermal" value={thermalFloor} onChange={(e) => setThermalFloor(e.target.value)} />
          <Label htmlFor="shift">Shift floor</Label>
          <Input id="shift" value={shiftFloor} onChange={(e) => setShiftFloor(e.target.value)} />
          <Button type="submit">Create scenario</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift flex items-center justify-between rounded-lg border bg-white px-4 py-3">
              <div>
                <p className="font-medium">{row.label}</p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                  {String(row.kind)} · {String(row.horizonHint)} · {row.status}
                </p>
              </div>
              <Button type="button" variant="outline" onClick={() => void archive(row.id)}>Archive</Button>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default ScenariosPage;
