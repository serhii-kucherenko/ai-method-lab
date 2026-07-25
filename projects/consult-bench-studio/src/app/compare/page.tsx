"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { CompareResult, ConsultCase } from "@/store";

export default function ComparePage() {
  const [items, setItems] = useState<CompareResult[]>([]);
  const [cases, setCases] = useState<ConsultCase[]>([]);
  const [caseId, setCaseId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [compares, caseRes] = await Promise.all([
      api<{ items: CompareResult[] }>("/api/compare"),
      api<{ items: ConsultCase[] }>("/api/cases"),
    ]);
    setItems(compares.items);
    setCases(caseRes.items);
    if (!caseId && caseRes.items[0]) setCaseId(caseRes.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name, caseId }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Multimodal vs text-only"
      subtitle="Falsify the claim: does image-aware scoring beat a text-only baseline on this case?"
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
      >
        <Input
          placeholder="Compare run name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
        >
          {cases.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <div className="md:col-span-2">
          <Button type="submit">Run compare</Button>
        </div>
        {error ? <p className="md:col-span-2 text-sm text-red-700">{error}</p> : null}
      </form>

      <ul className="space-y-4">
        {items.map((c) => (
          <li
            key={c.id}
            className="score-rise rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-[family-name:var(--font-display)] text-lg">
                {c.name}
              </h2>
              <span className="text-xs uppercase tracking-wide text-slate-500">
                winner: {c.winner}
              </span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs text-slate-500">A multimodal</p>
                <p className="text-2xl text-[var(--studio-mint-deep)]">
                  {c.multimodal.overall}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">B text-only</p>
                <p className="text-2xl text-slate-700">{c.textOnly.overall}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
