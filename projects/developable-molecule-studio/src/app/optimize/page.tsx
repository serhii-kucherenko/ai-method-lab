"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { MoleculeCandidate, OptimizePass } from "@/store";

export default function OptimizePage() {
  const [candidates, setCandidates] = useState<MoleculeCandidate[]>([]);
  const [items, setItems] = useState<OptimizePass[]>([]);
  const [candidateId, setCandidateId] = useState("");
  const [name, setName] = useState("");
  const [propertyWeight, setPropertyWeight] = useState("0.7");
  const [error, setError] = useState("");

  async function load() {
    const [c, o] = await Promise.all([
      api<MoleculeCandidate[]>("/api/candidates"),
      api<OptimizePass[]>("/api/optimize"),
    ]);
    setCandidates(c);
    if (!candidateId && c[0]) setCandidateId(c[0].id);
    setItems(o);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/optimize", {
        method: "POST",
        body: JSON.stringify({
          candidateId,
          name,
          propertyWeight: Number(propertyWeight),
          status: "planned",
          notes: "Property-aware developability optimize",
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
      title="Property-aware optimize"
      subtitle="Plan optimize passes that weight developability properties — not affinity alone."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-4"
      >
        <Input
          placeholder="Pass name"
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
          placeholder="Property weight"
          value={propertyWeight}
          onChange={(e) => setPropertyWeight(e.target.value)}
        />
        <Button type="submit">Plan pass</Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((o) => (
          <li
            key={o.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
                {o.name}
              </h3>
              <span className="text-sm text-[var(--studio-coral)]">{o.status}</span>
            </div>
            <p className="mt-1 text-sm text-stone-500">
              Property weight {o.propertyWeight.toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
