"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { CohortModality, PatientCohort } from "@/store";

const MODALITIES: CohortModality[] = [
  "tabular",
  "imaging",
  "mixed",
  "biomarker",
  "cognitive",
];

export default function CohortsPage() {
  const [items, setItems] = useState<PatientCohort[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [modality, setModality] = useState<CohortModality>("mixed");
  const [size, setSize] = useState("400");
  const [missingnessRate, setMissingnessRate] = useState("0.28");
  const [error, setError] = useState("");
  const [checklist, setChecklist] = useState(false);

  async function load(search = q) {
    const res = await api<{ items: PatientCohort[] }>(
      `/api/cohorts?q=${encodeURIComponent(search)}`,
    );
    setItems(res.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/cohorts", {
        method: "POST",
        body: JSON.stringify({
          name,
          modality,
          size: Number(size),
          missingnessRate: Number(missingnessRate),
          notes: "Registered from cohorts page",
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
      title="Patient cohorts"
      subtitle="Register the cohorts you score for Alzheimer’s risk — modality, size, and missingness first."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <label className="flex items-start gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={checklist}
            onChange={(e) => setChecklist(e.target.checked)}
            className="mt-1"
          />
          <span>
            Onboarding: confirm cohort modality and missingness rate, and that
            this studio is a method-lab planner — not clinical certification or
            live EHR diagnosis.
          </span>
        </label>
      </div>

      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-5"
      >
        <Input
          placeholder="Cohort name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={modality}
          onChange={(e) => setModality(e.target.value as CohortModality)}
        >
          {MODALITIES.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <Input
          type="number"
          placeholder="Size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          required
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Missingness"
          value={missingnessRate}
          onChange={(e) => setMissingnessRate(e.target.value)}
          required
        />
        <Button type="submit">Add cohort</Button>
      </form>

      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Search cohorts"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button type="button" variant="outline" onClick={() => load()}>
          Search
        </Button>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-medium text-slate-900">{c.name}</span>
              <span className="text-xs text-slate-500">
                {c.modality} · n={c.size} · miss {Math.round(c.missingnessRate * 100)}%
              </span>
            </div>
            {c.notes ? (
              <p className="mt-1 text-sm text-slate-500">{c.notes}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
