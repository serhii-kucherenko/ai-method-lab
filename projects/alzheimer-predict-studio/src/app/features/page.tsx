"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { FeatureSnapshot, PatientCohort } from "@/store";

export default function FeaturesPage() {
  const [cohorts, setCohorts] = useState<PatientCohort[]>([]);
  const [items, setItems] = useState<FeatureSnapshot[]>([]);
  const [cohortId, setCohortId] = useState("");
  const [name, setName] = useState("");
  const [missingnessRate, setMissingnessRate] = useState("0.3");
  const [maskQuality, setMaskQuality] = useState("0.8");
  const [featureCount, setFeatureCount] = useState("48");
  const [error, setError] = useState("");

  async function load() {
    const [c, s] = await Promise.all([
      api<{ items: PatientCohort[] }>("/api/cohorts"),
      api<{ items: FeatureSnapshot[] }>(
        `/api/features/snapshots${cohortId ? `?cohortId=${cohortId}` : ""}`,
      ),
    ]);
    setCohorts(c.items);
    setItems(s.items);
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
      await api("/api/features/snapshots", {
        method: "POST",
        body: JSON.stringify({
          cohortId,
          name,
          missingnessRate: Number(missingnessRate),
          maskQuality: Number(maskQuality),
          featureCount: Number(featureCount),
          status: "reviewed",
          notes: "Feature snapshot from features page",
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
      title="Feature snapshots"
      subtitle="Capture missingness rates and mask quality — the honesty signal imputation-free models keep visible."
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
          placeholder="Snapshot name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Missingness"
          value={missingnessRate}
          onChange={(e) => setMissingnessRate(e.target.value)}
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Mask quality"
          value={maskQuality}
          onChange={(e) => setMaskQuality(e.target.value)}
        />
        <Button type="submit">Add snapshot</Button>
      </form>

      <div className="mb-4">
        <Input
          type="number"
          placeholder="Feature count"
          value={featureCount}
          onChange={(e) => setFeatureCount(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((s) => (
          <li
            key={s.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-medium text-slate-900">{s.name}</span>
              <span className="text-xs text-slate-500">
                {s.status} · miss {Math.round(s.missingnessRate * 100)}% · mask{" "}
                {Math.round(s.maskQuality * 100)}% · {s.featureCount} feats
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded bg-slate-200/80">
              <div
                className="animate-missingness-mask h-full rounded bg-[var(--studio-lilac)]"
                style={{ width: `${Math.round(s.missingnessRate * 100)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
