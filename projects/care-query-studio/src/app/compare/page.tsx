"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  llm: { overall: number };
  clinician: { overall: number };
};

type Rubric = { id: string; label: string };
type Locale = { id: string; label: string };
type Run = { id: string };

export function ComparePage() {
  const [items, setItems] = useState<Compare[]>([]);
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [locales, setLocales] = useState<Locale[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [name, setName] = useState("LLM vs clinician baseline");
  const [rubricId, setRubricId] = useState("");
  const [localeId, setLocaleId] = useState("");
  const [runId, setRunId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [compares, rub, loc, runData] = await Promise.all([
      api<{ items: Compare[] }>("/api/compare"),
      api<{ items: Rubric[] }>("/api/answers"),
      api<{ items: Locale[] }>("/api/locales"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setItems(compares.items);
    setRubrics(rub.items);
    setLocales(loc.items);
    setRuns(runData.items);
    if (!rubricId && rub.items[0]) setRubricId(rub.items[0].id);
    if (!localeId && loc.items[0]) setLocaleId(loc.items[0].id);
    if (!runId && runData.items[0]) setRunId(runData.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function run() {
    setError("");
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name, rubricId, localeId, runId }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Compare"
      subtitle="Dual A/B: multilingual_poc_llm_answers vs local_clinician_baseline."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="name">Compare name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="rubric">Answer rubric</Label>
          <select
            id="rubric"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={rubricId}
            onChange={(e) => setRubricId(e.target.value)}
          >
            {rubrics.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="locale">Locale</Label>
          <select
            id="locale"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={localeId}
            onChange={(e) => setLocaleId(e.target.value)}
          >
            {locales.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="run">Run</Label>
          <select
            id="run"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={runId}
            onChange={(e) => setRunId(e.target.value)}
          >
            {runs.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <Button onClick={() => run()}>Run A/B compare</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      <ul className="space-y-2">
        {items.map((c) => (
          <li
            key={c.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <p className="font-medium">{c.name}</p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              Winner {c.winner} · gap {c.gap} · LLM {c.llm.overall} · clinician{" "}
              {c.clinician.overall}
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
              <div
                className="score-bar h-full bg-[var(--cq-teal)]"
                style={{ width: `${Math.min(100, c.llm.overall)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default ComparePage;
