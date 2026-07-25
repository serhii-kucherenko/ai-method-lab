"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Cohort = {
  id: string;
  label: string;
  caseSummary: string;
  goldOutcome: string;
  cohortSegment: string;
  status: string;
};

export default function CohortsPage() {
  const [items, setItems] = useState<Cohort[]>([]);
  const [label, setLabel] = useState("");
  const [caseSummary, setCaseSummary] = useState("");
  const [goldOutcome, setGoldOutcome] = useState("positive");
  const [cohortSegment, setCohortSegment] = useState(
    "outpatient_cardiometabolic",
  );
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load(query = q) {
    const data = await api<{ items: Cohort[] }>(
      `/api/cohorts?q=${encodeURIComponent(query)}`,
    );
    setItems(data.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/cohorts", {
        method: "POST",
        body: JSON.stringify({
          label: label || "Untitled cohort case",
          caseSummary: caseSummary || "Case summary pending",
          goldOutcome,
          cohortSegment,
        }),
      });
      setLabel("");
      setCaseSummary("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Cohort cases"
      subtitle="Patient/case workspace with gold outcomes for sufficiency soft-sim."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search cases or segments"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          onClick={() => load(q).catch((e) => setError(String(e)))}
        >
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="segment">Cohort segment</Label>
          <Input
            id="segment"
            value={cohortSegment}
            onChange={(e) => setCohortSegment(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="summary">Case summary</Label>
          <Input
            id="summary"
            value={caseSummary}
            onChange={(e) => setCaseSummary(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="outcome">Gold outcome</Label>
          <select
            id="outcome"
            className="mt-1 flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 text-sm"
            value={goldOutcome}
            onChange={(e) => setGoldOutcome(e.target.value)}
          >
            <option value="negative">negative</option>
            <option value="indeterminate">indeterminate</option>
            <option value="positive">positive</option>
            <option value="critical">critical</option>
          </select>
        </div>
        <div className="flex items-end">
          <Button onClick={() => create()}>Add cohort case</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-slate-500">No cohort cases yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((c) => (
            <li
              key={c.id}
              tabIndex={0}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium text-slate-900">{c.label}</div>
              <div className="mt-1 text-sm text-slate-500">
                {c.goldOutcome} · {c.cohortSegment} · {c.status}
              </div>
              <p className="mt-1 text-sm text-slate-600">{c.caseSummary}</p>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
