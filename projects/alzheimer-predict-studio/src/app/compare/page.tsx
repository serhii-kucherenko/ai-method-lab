"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { CompareResult, PatientCohort } from "@/store";

export default function ComparePage() {
  const [cohorts, setCohorts] = useState<PatientCohort[]>([]);
  const [items, setItems] = useState<CompareResult[]>([]);
  const [cohortId, setCohortId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [c, cmp] = await Promise.all([
      api<{ items: PatientCohort[] }>("/api/cohorts"),
      api<{ items: CompareResult[] }>("/api/compare"),
    ]);
    setCohorts(c.items);
    setItems(cmp.items);
    if (!cohortId && c.items[0]) setCohortId(c.items[0].id);
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
        body: JSON.stringify({ name, cohortId }),
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
      subtitle="Imputation-free + calibrated uncertainty versus impute-then-predict baselines that fill missingness first."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3"
      >
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={cohortId}
          onChange={(e) => setCohortId(e.target.value)}
          required
        >
          {cohorts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
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
              <span className="text-xs font-medium uppercase tracking-wide text-[var(--studio-blue)]">
                winner: {c.winner}
              </span>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase text-slate-500">
                  Imputation-free
                </p>
                <p className="text-2xl font-medium text-slate-900">
                  {c.imputationFree.overall.toFixed(1)}
                </p>
                <p className="text-xs text-slate-500">
                  honesty {c.imputationFree.missingnessHonesty.toFixed(1)} ·
                  uncertainty {c.imputationFree.uncertaintyQuality.toFixed(1)} ·
                  cal {c.imputationFree.calibration.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">
                  Impute-then-predict
                </p>
                <p className="text-2xl font-medium text-slate-900">
                  {c.imputeThenPredict.overall.toFixed(1)}
                </p>
                <p className="text-xs text-slate-500">
                  honesty {c.imputeThenPredict.missingnessHonesty.toFixed(1)} ·
                  uncertainty{" "}
                  {c.imputeThenPredict.uncertaintyQuality.toFixed(1)} · cal{" "}
                  {c.imputeThenPredict.calibration.toFixed(1)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
