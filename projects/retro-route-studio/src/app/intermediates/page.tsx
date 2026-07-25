"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Intermediate = {
  id: string;
  smilesLike: string;
  mw: number;
  logP: number;
  reactiveFlags: number;
  availability: number;
};

export default function IntermediatesPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Intermediate[]>([]);
  const [packId, setPackId] = useState("");
  const [smilesLike, setSmilesLike] = useState("Nc1ccccc1");
  const [mw, setMw] = useState("93.1");
  const [logP, setLogP] = useState("0.9");
  const [availability, setAvailability] = useState("0.8");
  const [error, setError] = useState("");

  async function load() {
    const [p, i] = await Promise.all([
      api<{ items: Pack[] }>("/api/packs"),
      api<{ items: Intermediate[] }>("/api/intermediates"),
    ]);
    setPacks(p.items);
    setItems(i.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/intermediates", {
        method: "POST",
        body: JSON.stringify({
          packId,
          smilesLike,
          mw: Number(mw),
          logP: Number(logP),
          reactiveFlags: 0.2,
          availability: Number(availability),
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Intermediates"
      subtitle="Intermediate property workspace — MW, logP, reactivity, availability."
    >
      {packs.length === 0 ? (
        <p className="mb-4 text-sm text-slate-500">
          No intermediates until a pack exists.
        </p>
      ) : null}
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-5">
        <div>
          <Label htmlFor="pack">Pack</Label>
          <select
            id="pack"
            className="flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-white px-2 text-sm"
            value={packId}
            onChange={(e) => setPackId(e.target.value)}
          >
            {packs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="smiles">SMILES-like</Label>
          <Input
            id="smiles"
            value={smilesLike}
            onChange={(e) => setSmilesLike(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="mw">MW</Label>
          <Input id="mw" value={mw} onChange={(e) => setMw(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="logp">logP</Label>
          <Input
            id="logp"
            value={logP}
            onChange={(e) => setLogP(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button className="bg-[var(--studio-teal)]" onClick={create}>
            Add intermediate
          </Button>
        </div>
      </div>
      <div className="mb-4 max-w-xs">
        <Label htmlFor="av">Availability</Label>
        <Input
          id="av"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        />
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">No intermediates yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((i) => (
            <li
              key={i.id}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3 text-sm"
            >
              <strong>{i.smilesLike}</strong> · MW {i.mw} · logP {i.logP} ·
              avail {i.availability}
            </li>
          ))}
        </ul>
      )}
      {error ? (
        <p className="mt-4 text-sm text-[var(--studio-amber)]">{error}</p>
      ) : null}
    </StudioShell>
  );
}
