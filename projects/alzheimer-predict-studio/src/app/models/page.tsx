"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { PatientCohort, PlanKind, PredictRun } from "@/store";

export default function ModelsPage() {
  const [cohorts, setCohorts] = useState<PatientCohort[]>([]);
  const [items, setItems] = useState<PredictRun[]>([]);
  const [cohortId, setCohortId] = useState("");
  const [name, setName] = useState("");
  const [plan, setPlan] = useState<PlanKind>("imputation_free");
  const [calibrationPrior, setCalibrationPrior] = useState("0.75");
  const [error, setError] = useState("");

  async function load() {
    const [c, r] = await Promise.all([
      api<{ items: PatientCohort[] }>("/api/cohorts"),
      api<{ items: PredictRun[] }>(
        `/api/models${cohortId ? `?cohortId=${cohortId}` : ""}`,
      ),
    ]);
    setCohorts(c.items);
    setItems(r.items);
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
      await api("/api/models", {
        method: "POST",
        body: JSON.stringify({
          cohortId,
          name,
          plan,
          calibrationPrior: Number(calibrationPrior),
          status: "complete",
          notes: "Prediction run from models page",
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
      title="Prediction models"
      subtitle="Queue imputation-free Alzheimer’s risk runs — or mark an impute-then-predict baseline for later compare."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-5"
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
          placeholder="Run name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={plan}
          onChange={(e) => setPlan(e.target.value as PlanKind)}
        >
          <option value="imputation_free">imputation_free</option>
          <option value="impute_then_predict">impute_then_predict</option>
        </select>
        <Input
          type="number"
          step="0.01"
          placeholder="Calibration prior"
          value={calibrationPrior}
          onChange={(e) => setCalibrationPrior(e.target.value)}
        />
        <Button type="submit">Start run</Button>
      </form>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((r) => (
          <li
            key={r.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-medium text-slate-900">{r.name}</span>
              <span className="text-xs text-slate-500">
                {r.status} · {r.plan} · cal {Math.round(r.calibrationPrior * 100)}%
              </span>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
