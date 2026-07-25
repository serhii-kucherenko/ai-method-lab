"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Cohort = { id: string; label: string };
type Mask = { id: string; label: string; coverageRatio: number };
type Run = {
  id: string;
  caseId: string;
  maskId: string;
  maskCoverage: number;
  featureSalience: number;
  cohortFit: number;
  labelAgreement: number;
  status: string;
};

export default function SufficiencyPage() {
  const [items, setItems] = useState<Run[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [masks, setMasks] = useState<Mask[]>([]);
  const [caseId, setCaseId] = useState("");
  const [maskId, setMaskId] = useState("");
  const [maskCoverage, setMaskCoverage] = useState(0.42);
  const [featureSalience, setFeatureSalience] = useState(0.7);
  const [cohortFit, setCohortFit] = useState(0.74);
  const [labelAgreement, setLabelAgreement] = useState(0.68);
  const [error, setError] = useState("");

  async function load() {
    const [runs, c, m] = await Promise.all([
      api<{ items: Run[] }>("/api/sufficiency"),
      api<{ items: Cohort[] }>("/api/cohorts"),
      api<{ items: Mask[] }>("/api/masks"),
    ]);
    setItems(runs.items);
    setCohorts(c.items);
    setMasks(m.items);
    if (!caseId && c.items[0]) setCaseId(c.items[0].id);
    if (!maskId && m.items[0]) {
      setMaskId(m.items[0].id);
      setMaskCoverage(m.items[0].coverageRatio);
    }
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    if (!caseId || !maskId) {
      setError("Need mask + cohort");
      return;
    }
    try {
      await api("/api/sufficiency", {
        method: "POST",
        body: JSON.stringify({
          caseId,
          maskId,
          maskCoverage,
          featureSalience,
          cohortFit,
          labelAgreement,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Sufficiency runs"
      subtitle="Bind a mask to a cohort case and record partial-observation metrics."
    >
      {!cohorts.length || !masks.length ? (
        <p className="mb-6 text-slate-500">
          Need mask + cohort — create them on /masks and /cohorts first.
        </p>
      ) : null}
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="case">Cohort case</Label>
          <select
            id="case"
            className="mt-1 flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 text-sm"
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
          >
            {cohorts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="mask">Observation mask</Label>
          <select
            id="mask"
            className="mt-1 flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 text-sm"
            value={maskId}
            onChange={(e) => setMaskId(e.target.value)}
          >
            {masks.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        {(
          [
            ["maskCoverage", maskCoverage, setMaskCoverage],
            ["featureSalience", featureSalience, setFeatureSalience],
            ["cohortFit", cohortFit, setCohortFit],
            ["labelAgreement", labelAgreement, setLabelAgreement],
          ] as const
        ).map(([id, val, setter]) => (
          <div key={id}>
            <Label htmlFor={id}>{id}</Label>
            <Input
              id={id}
              type="number"
              step="0.05"
              min={0}
              max={1}
              value={val}
              onChange={(e) => setter(Number(e.target.value))}
            />
          </div>
        ))}
        <div className="flex items-end">
          <Button onClick={() => create()}>Create sufficiency run</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-slate-500">No sufficiency runs yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((r) => (
            <li
              key={r.id}
              tabIndex={0}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium text-slate-900">{r.id}</div>
              <div className="mt-1 text-sm text-slate-500">
                coverage {r.maskCoverage} · salience {r.featureSalience} · fit{" "}
                {r.cohortFit} · agreement {r.labelAgreement} · {r.status}
              </div>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
