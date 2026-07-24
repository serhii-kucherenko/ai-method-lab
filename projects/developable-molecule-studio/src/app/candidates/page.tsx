"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { BindingPocket, MoleculeCandidate } from "@/store";

export default function CandidatesPage() {
  const [pockets, setPockets] = useState<BindingPocket[]>([]);
  const [items, setItems] = useState<MoleculeCandidate[]>([]);
  const [pocketId, setPocketId] = useState("");
  const [name, setName] = useState("");
  const [qedScore, setQedScore] = useState("0.7");
  const [error, setError] = useState("");

  async function load() {
    const [p, c] = await Promise.all([
      api<{ items: BindingPocket[] }>("/api/pockets"),
      api<MoleculeCandidate[]>(
        `/api/candidates${pocketId ? `?pocketId=${encodeURIComponent(pocketId)}` : ""}`,
      ),
    ]);
    setPockets(p.items);
    if (!pocketId && p.items[0]) setPocketId(p.items[0].id);
    setItems(c);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/candidates", {
        method: "POST",
        body: JSON.stringify({
          pocketId,
          name,
          qedScore: Number(qedScore),
          status: "draft",
          notes: "Candidate from candidates page",
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
      title="Molecule candidates"
      subtitle="Generated candidates tied to a binding pocket — QED and status first."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-4"
      >
        <Input
          placeholder="Candidate name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={pocketId}
          onChange={(e) => setPocketId(e.target.value)}
          required
        >
          {pockets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <Input
          type="number"
          step="0.01"
          placeholder="QED"
          value={qedScore}
          onChange={(e) => setQedScore(e.target.value)}
        />
        <Button type="submit">Add candidate</Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
                {c.name}
              </h3>
              <span className="text-sm text-[var(--studio-coral)]">{c.status}</span>
            </div>
            <p className="mt-1 text-sm text-stone-500">
              QED {c.qedScore.toFixed(2)}
              {c.smilesHint ? ` · ${c.smilesHint}` : ""}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
