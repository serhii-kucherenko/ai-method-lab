"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Kernel = {
  id: string;
  packId: string;
  label: string;
  kernelFamilies: string[];
  quantumWeight: number;
  classicalWeight: number;
  status: string;
};

export default function KernelsPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Kernel[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [families, setFamilies] = useState(
    "tanimoto_rbf, quantum_fidelity, graph_walk",
  );
  const [quantumWeight, setQuantumWeight] = useState("0.62");
  const [error, setError] = useState("");

  async function load(query = q) {
    const [p, a] = await Promise.all([
      api<{ items: Pack[] }>("/api/packs"),
      api<{ items: Kernel[] }>(
        `/api/kernels?q=${encodeURIComponent(query)}`,
      ),
    ]);
    setPacks(p.items);
    setItems(a.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/kernels", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label: label || "Untitled kernel config",
          kernelFamilies: families
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          quantumWeight: Number(quantumWeight),
        }),
      });
      setLabel("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Kernel configs"
      subtitle="Configure quantum multiple-kernel families and classical weights."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search kernel or family"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          onClick={() => load(q).catch((e) => setError(String(e)))}
        >
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Molecule pack</Label>
          <select
            id="pack"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
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
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="families">Kernel families (comma-separated)</Label>
          <Input
            id="families"
            value={families}
            onChange={(e) => setFamilies(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="quantumWeight">Quantum weight (0–1)</Label>
          <Input
            id="quantumWeight"
            value={quantumWeight}
            onChange={(e) => setQuantumWeight(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={() => create()}>Create kernel config</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-slate-500">No kernel configs yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((a) => (
            <li
              key={a.id}
              tabIndex={0}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium text-slate-900">{a.label}</div>
              <div className="mt-1 text-sm text-slate-500">
                families: {a.kernelFamilies.join(", ")} · quantum{" "}
                {a.quantumWeight} · classical {a.classicalWeight} · {a.status}
              </div>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
