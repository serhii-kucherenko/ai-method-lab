"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { MoleculeCandidate, PropertyLedgerEntry } from "@/store";

export default function PropertiesPage() {
  const [candidates, setCandidates] = useState<MoleculeCandidate[]>([]);
  const [items, setItems] = useState<PropertyLedgerEntry[]>([]);
  const [candidateId, setCandidateId] = useState("");
  const [name, setName] = useState("");
  const [solubility, setSolubility] = useState("0.7");
  const [clearanceRisk, setClearanceRisk] = useState("0.25");
  const [error, setError] = useState("");

  async function load() {
    const [c, p] = await Promise.all([
      api<MoleculeCandidate[]>("/api/candidates"),
      api<PropertyLedgerEntry[]>("/api/properties"),
    ]);
    setCandidates(c);
    if (!candidateId && c[0]) setCandidateId(c[0].id);
    setItems(p);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/properties", {
        method: "POST",
        body: JSON.stringify({
          candidateId,
          name,
          solubility: Number(solubility),
          clearanceRisk: Number(clearanceRisk),
          toxicityRisk: 0.2,
          synthesizability: 0.7,
          lipophilicity: 0.55,
          notes: "Developability property ledger entry",
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
      title="Developability properties"
      subtitle="Ledger solubility, clearance, toxicity, and synthesizability per candidate."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-4"
      >
        <Input
          placeholder="Ledger name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={candidateId}
          onChange={(e) => setCandidateId(e.target.value)}
          required
        >
          {candidates.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <Input
          type="number"
          step="0.01"
          placeholder="Solubility"
          value={solubility}
          onChange={(e) => setSolubility(e.target.value)}
        />
        <div className="flex gap-2">
          <Input
            type="number"
            step="0.01"
            placeholder="Clearance risk"
            value={clearanceRisk}
            onChange={(e) => setClearanceRisk(e.target.value)}
          />
          <Button type="submit">Add</Button>
        </div>
      </form>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((p) => (
          <li
            key={p.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <h3 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
              {p.name}
            </h3>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {[
                ["Solubility", p.solubility],
                ["Clearance risk", p.clearanceRisk],
                ["Toxicity risk", p.toxicityRisk],
                ["Synthesizability", p.synthesizability],
              ].map(([label, val]) => (
                <div key={String(label)} className="space-y-1">
                  <div className="flex justify-between text-xs text-stone-500">
                    <span>{label}</span>
                    <span>{(val as number).toFixed(2)}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded bg-stone-200">
                    <div
                      className="h-full rounded bg-[var(--studio-coral)]"
                      style={{ width: `${(val as number) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
