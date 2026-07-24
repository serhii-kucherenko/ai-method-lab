"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { CompareResult, CxrExam } from "@/store";

export default function ComparePage() {
  const [exams, setExams] = useState<CxrExam[]>([]);
  const [items, setItems] = useState<CompareResult[]>([]);
  const [examId, setExamId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [e, cmp] = await Promise.all([
      api<{ items: CxrExam[] }>("/api/exams"),
      api<{ items: CompareResult[] }>("/api/compare"),
    ]);
    setExams(e.items);
    setItems(cmp.items);
    if (!examId && e.items[0]) setExamId(e.items[0].id);
  }

  useEffect(() => {
    load().catch((err) => setError(String(err)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name, examId }),
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
      subtitle="Classify + localize versus classify-only baselines that omit lesion location."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3"
      >
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={examId}
          onChange={(e) => setExamId(e.target.value)}
          required
        >
          {exams.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
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
              <span className="text-xs font-medium uppercase tracking-wide text-[var(--studio-cyan)]">
                winner: {c.winner}
              </span>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase text-slate-500">
                  Classify + localize
                </p>
                <p className="text-2xl font-medium text-slate-900">
                  {c.classifyLocalize.overall.toFixed(1)}
                </p>
                <p className="text-xs text-slate-500">
                  localize {c.classifyLocalize.localizationIntegrity.toFixed(1)}{" "}
                  · maps {c.classifyLocalize.mapConfidence.toFixed(1)} · find{" "}
                  {c.classifyLocalize.findingCompleteness.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">
                  Classify-only
                </p>
                <p className="text-2xl font-medium text-slate-900">
                  {c.classifyOnly.overall.toFixed(1)}
                </p>
                <p className="text-xs text-slate-500">
                  localize {c.classifyOnly.localizationIntegrity.toFixed(1)} ·
                  maps {c.classifyOnly.mapConfidence.toFixed(1)} · find{" "}
                  {c.classifyOnly.findingCompleteness.toFixed(1)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
