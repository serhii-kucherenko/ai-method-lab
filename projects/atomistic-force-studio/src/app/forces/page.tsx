"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Force = {
  id: string;
  packId: string;
  label: string;
  kind: string;
  terms: string;
  termCount: number;
  status: string;
};

type Pack = { id: string; label: string };

export default function ForcesPage() {
  const [items, setItems] = useState<Force[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("FeNNix-style FM reactive force");
  const [kind, setKind] = useState("reactive_fm");
  const [terms, setTerms] = useState("bond,angle,dihedral,reactive_pair");
  const [termCount, setTermCount] = useState("4");
  const [error, setError] = useState("");

  async function load() {
    const [forces, ps] = await Promise.all([
      api<{ items: Force[] }>("/api/forces"),
      api<{ items: Pack[] }>("/api/sims"),
    ]);
    setItems(forces.items);
    setPacks(ps.items);
    if (!packId && ps.items[0]) setPackId(ps.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/forces", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          terms,
          termCount: Number(termCount),
          coverageMin: 0.4,
          coverageMax: 0.9,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Force configs"
      subtitle="Configure foundation-model forces with terms and coverage spans."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Sim pack</Label>
          <select
            id="pack"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
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
          <Label htmlFor="kind">Kind</Label>
          <select
            id="kind"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            {[
              "reactive_fm",
              "classical_ff",
              "hybrid",
              "restraint",
              "mixed",
            ].map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="count">Term count</Label>
          <Input
            id="count"
            value={termCount}
            onChange={(e) => setTermCount(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="terms">Terms</Label>
          <Input
            id="terms"
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={create}>Create force</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((c) => (
          <li
            key={c.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{c.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {c.kind} · {c.termCount} terms · {c.terms} · {c.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
