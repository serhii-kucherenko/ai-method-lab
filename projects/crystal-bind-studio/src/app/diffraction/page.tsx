"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { CrystalPack, DiffractionLane } from "@/store";

export default function DiffractionPage() {
  const [items, setItems] = useState<DiffractionLane[]>([]);
  const [packs, setPacks] = useState<CrystalPack[]>([]);
  const [packId, setPackId] = useState("");
  const [name, setName] = useState("");
  const [matchScore, setMatchScore] = useState("0.72");
  const [peakRichness, setPeakRichness] = useState("0.66");
  const [error, setError] = useState("");

  async function load() {
    const [lane, packRes] = await Promise.all([
      api<{ items: DiffractionLane[] }>("/api/diffraction"),
      api<{ items: CrystalPack[] }>("/api/packs"),
    ]);
    setItems(lane.items);
    setPacks(packRes.items);
    if (!packId && packRes.items[0]) setPackId(packRes.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/diffraction", {
        method: "POST",
        body: JSON.stringify({
          packId,
          name,
          matchScore: Number(matchScore),
          peakRichness: Number(peakRichness),
        }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Diffraction lane"
      subtitle="Powder-diffraction fingerprint soft-sim for each crystal pack."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3"
      >
        <select
          className="h-8 rounded-md border border-[var(--studio-line)] bg-white px-2 text-sm"
          value={packId}
          onChange={(e) => setPackId(e.target.value)}
          required
        >
          {packs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <Input placeholder="Lane name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input placeholder="Match 0-1" value={matchScore} onChange={(e) => setMatchScore(e.target.value)} />
        <Input placeholder="Peak richness" value={peakRichness} onChange={(e) => setPeakRichness(e.target.value)} />
        <Button type="submit">Add diffraction</Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((row) => (
          <li key={row.id} className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">{row.name}</span>
              <span className="text-xs text-slate-500">pack {row.packId.slice(0, 8)}</span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Match {row.matchScore} · peaks {row.peakRichness}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
