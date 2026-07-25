"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { CrystalPack, StructureLane } from "@/store";

export default function StructurePage() {
  const [items, setItems] = useState<StructureLane[]>([]);
  const [packs, setPacks] = useState<CrystalPack[]>([]);
  const [packId, setPackId] = useState("");
  const [name, setName] = useState("");
  const [fidelity, setFidelity] = useState("0.75");
  const [atoms, setAtoms] = useState("10");
  const [error, setError] = useState("");

  async function load() {
    const [lane, packRes] = await Promise.all([
      api<{ items: StructureLane[] }>("/api/structure"),
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
      await api("/api/structure", {
        method: "POST",
        body: JSON.stringify({
          packId,
          name,
          fidelity: Number(fidelity),
          atomCountProxy: Number(atoms),
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
      title="Structure lane"
      subtitle="Atomic / lattice fidelity descriptors for each crystal pack."
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
        <Input
          placeholder="Lane name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          placeholder="Fidelity 0-1"
          value={fidelity}
          onChange={(e) => setFidelity(e.target.value)}
        />
        <Input
          placeholder="Atom count proxy"
          value={atoms}
          onChange={(e) => setAtoms(e.target.value)}
        />
        <Button type="submit">Add structure</Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((row) => (
          <li
            key={row.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">
                {row.name}
              </span>
              <span className="text-xs text-slate-500">
                pack {row.packId.slice(0, 8)}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Fidelity {row.fidelity} · atoms {row.atomCountProxy}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
