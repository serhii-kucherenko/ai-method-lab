"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Route = {
  id: string;
  packId: string;
  label: string;
  steps: number;
  branchingFactor: number;
  memoryCoverage: number;
  status: string;
};

export default function RoutesPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Route[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [steps, setSteps] = useState("4");
  const [branchingFactor, setBranchingFactor] = useState("2.2");
  const [memoryCoverage, setMemoryCoverage] = useState("0.7");
  const [error, setError] = useState("");

  async function load() {
    const [p, r] = await Promise.all([
      api<{ items: Pack[] }>("/api/packs"),
      api<{ items: Route[] }>("/api/routes"),
    ]);
    setPacks(p.items);
    setItems(r.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/routes", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label: label || "Candidate route",
          steps: Number(steps),
          branchingFactor: Number(branchingFactor),
          memoryCoverage: Number(memoryCoverage),
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
      title="Candidate routes"
      subtitle="Multi-step retrosynthesis candidates with branching and memory coverage."
    >
      {packs.length === 0 ? (
        <p className="mb-4 text-sm text-slate-500">
          Need a pack first — create one on Packs.
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
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="steps">Steps</Label>
          <Input
            id="steps"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="bf">Branching</Label>
          <Input
            id="bf"
            value={branchingFactor}
            onChange={(e) => setBranchingFactor(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button className="bg-[var(--studio-teal)]" onClick={create}>
            Add route
          </Button>
        </div>
      </div>
      <div className="mb-4 max-w-xs">
        <Label htmlFor="mem">Memory coverage</Label>
        <Input
          id="mem"
          value={memoryCoverage}
          onChange={(e) => setMemoryCoverage(e.target.value)}
        />
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">No routes yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((r) => (
            <li
              key={r.id}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3 text-sm"
            >
              <strong>{r.label}</strong> · {r.steps} steps · bf{" "}
              {r.branchingFactor} · mem {r.memoryCoverage} · {r.status}
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
