"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { CompareResult, DesignBrief } from "@/store";

export default function ComparePage() {
  const [items, setItems] = useState<CompareResult[]>([]);
  const [briefs, setBriefs] = useState<DesignBrief[]>([]);
  const [briefId, setBriefId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [cmp, br] = await Promise.all([
      api<{ items: CompareResult[] }>("/api/compare"),
      api<{ items: DesignBrief[] }>("/api/briefs"),
    ]);
    setItems(cmp.items);
    setBriefs(br.items);
    if (!briefId && br.items[0]) setBriefId(br.items[0].id);
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
        body: JSON.stringify({ name, briefId }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Open-vocab vs catalog-only"
      subtitle="Dual score: open-vocabulary discrete+continuous plan quality versus fixed-catalog baseline."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 flex flex-wrap gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
      >
        <Input
          placeholder="Compare name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="max-w-xs"
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={briefId}
          onChange={(e) => setBriefId(e.target.value)}
          required
        >
          {briefs.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <Button type="submit">Run compare</Button>
      </form>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-4">
        {items.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-medium text-slate-900">{c.name}</span>
              <span className="text-xs font-medium uppercase tracking-wide text-[var(--studio-cyan)]">
                winner: {c.winner.replace("_", " ")}
              </span>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase text-slate-500">
                  A · open-vocab
                </p>
                <p className="font-[family-name:var(--font-display)] text-2xl text-slate-900">
                  {c.openVocab.overall}
                </p>
                <p className="text-xs text-slate-500">
                  brief {c.openVocab.briefFidelity} · materials{" "}
                  {c.openVocab.materialSequenceQuality} · thickness{" "}
                  {c.openVocab.thicknessPlanQuality} · spectrum{" "}
                  {c.openVocab.spectrumMatch}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">
                  B · catalog-only
                </p>
                <p className="font-[family-name:var(--font-display)] text-2xl text-slate-900">
                  {c.catalogOnly.overall}
                </p>
                <p className="text-xs text-slate-500">
                  brief {c.catalogOnly.briefFidelity} · materials{" "}
                  {c.catalogOnly.materialSequenceQuality} · thickness{" "}
                  {c.catalogOnly.thicknessPlanQuality} · spectrum{" "}
                  {c.catalogOnly.spectrumMatch}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
