"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { CompareResult, CtStudy } from "@/store";

export default function ComparePage() {
  const [studies, setStudies] = useState<CtStudy[]>([]);
  const [items, setItems] = useState<CompareResult[]>([]);
  const [studyId, setStudyId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [s, cmp] = await Promise.all([
      api<{ items: CtStudy[] }>("/api/studies"),
      api<{ items: CompareResult[] }>("/api/compare"),
    ]);
    setStudies(s.items);
    setItems(cmp.items);
    if (!studyId && s.items[0]) setStudyId(s.items[0].id);
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
        body: JSON.stringify({ name, studyId }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Compare plans"
      subtitle="HITL + foundation phenotyping versus auto-only baselines that skip expert correction."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3"
      >
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={studyId}
          onChange={(e) => setStudyId(e.target.value)}
          required
        >
          {studies.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <Input
          placeholder="Compare name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
              <span className="text-xs font-medium uppercase tracking-wide text-[var(--studio-crimson)]">
                winner: {c.winner}
              </span>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase text-slate-500">
                  HITL + foundation
                </p>
                <p className="text-2xl font-medium text-slate-900">
                  {c.hitlFoundation.overall.toFixed(1)}
                </p>
                <p className="text-xs text-slate-500">
                  HITL {c.hitlFoundation.hitlIntegrity.toFixed(1)} · phenotype{" "}
                  {c.hitlFoundation.phenotypeConfidence.toFixed(1)} · segments{" "}
                  {c.hitlFoundation.structureCompleteness.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">Auto-only</p>
                <p className="text-2xl font-medium text-slate-900">
                  {c.autoOnly.overall.toFixed(1)}
                </p>
                <p className="text-xs text-slate-500">
                  HITL {c.autoOnly.hitlIntegrity.toFixed(1)} · phenotype{" "}
                  {c.autoOnly.phenotypeConfidence.toFixed(1)} · segments{" "}
                  {c.autoOnly.structureCompleteness.toFixed(1)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
