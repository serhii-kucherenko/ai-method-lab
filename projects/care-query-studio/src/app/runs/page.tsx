"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Run = {
  id: string;
  rubricId: string;
  localeId: string;
  languageCoverage: number;
  clinicalFidelity: number;
  localeGrounding: number;
  answerCompleteness: number;
  status: string;
};

type Rubric = { id: string; label: string };
type Locale = { id: string; label: string };

export function RunsPage() {
  const [items, setItems] = useState<Run[]>([]);
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [locales, setLocales] = useState<Locale[]>([]);
  const [rubricId, setRubricId] = useState("");
  const [localeId, setLocaleId] = useState("");
  const [languageCoverage, setLanguageCoverage] = useState("0.65");
  const [clinicalFidelity, setClinicalFidelity] = useState("0.7");
  const [localeGrounding, setLocaleGrounding] = useState("0.72");
  const [answerCompleteness, setAnswerCompleteness] = useState("0.68");
  const [error, setError] = useState("");

  async function load() {
    const [runs, rub, loc] = await Promise.all([
      api<{ items: Run[] }>("/api/runs"),
      api<{ items: Rubric[] }>("/api/answers"),
      api<{ items: Locale[] }>("/api/locales"),
    ]);
    setItems(runs.items);
    setRubrics(rub.items);
    setLocales(loc.items);
    if (!rubricId && rub.items[0]) setRubricId(rub.items[0].id);
    if (!localeId && loc.items[0]) setLocaleId(loc.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/runs", {
        method: "POST",
        body: JSON.stringify({
          rubricId,
          localeId,
          languageCoverage: Number(languageCoverage),
          clinicalFidelity: Number(clinicalFidelity),
          localeGrounding: Number(localeGrounding),
          answerCompleteness: Number(answerCompleteness),
          runNotes: "Soft-sim POC query run",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Runs"
      subtitle="Capture soft-sim proxies for multilingual POC medical query runs."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
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
          <Label htmlFor="locale">Locale suite</Label>
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
          <Label htmlFor="lang">Language coverage</Label>
          <Input
            id="lang"
            value={languageCoverage}
            onChange={(e) => setLanguageCoverage(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="fid">Clinical fidelity</Label>
          <Input
            id="fid"
            value={clinicalFidelity}
            onChange={(e) => setClinicalFidelity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="loc">Locale grounding</Label>
          <Input
            id="loc"
            value={localeGrounding}
            onChange={(e) => setLocaleGrounding(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="comp">Answer completeness</Label>
          <Input
            id="comp"
            value={answerCompleteness}
            onChange={(e) => setAnswerCompleteness(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={() => create()}>Create run</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      <ul className="space-y-2">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <p className="font-medium">{r.id}</p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              lang {r.languageCoverage} · fidelity {r.clinicalFidelity} ·
              locale {r.localeGrounding} · complete {r.answerCompleteness}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default RunsPage;
