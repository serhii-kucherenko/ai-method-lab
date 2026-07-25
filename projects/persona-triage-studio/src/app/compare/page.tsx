"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Conversation = { id: string; label: string };
type Persona = { id: string; label: string };
type UrgencyRun = { id: string; caseId: string; personaId: string };
type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  styleAware: { overall: number };
  idealizedPatient: { overall: number };
};

export default function ComparePage() {
  const [cases, setCases] = useState<Conversation[]>([]);
  const [personae, setPersonae] = useState<Persona[]>([]);
  const [runs, setRuns] = useState<UrgencyRun[]>([]);
  const [compares, setCompares] = useState<Compare[]>([]);
  const [caseId, setCaseId] = useState("");
  const [personaId, setPersonaId] = useState("");
  const [urgencyRunId, setUrgencyRunId] = useState("");
  const [name, setName] = useState("Style-aware vs idealized");
  const [last, setLast] = useState<Compare | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const [c, p, r, cmp] = await Promise.all([
      api<{ items: Conversation[] }>("/api/conversations"),
      api<{ items: Persona[] }>("/api/personae"),
      api<{ items: UrgencyRun[] }>("/api/urgency"),
      api<{ items: Compare[] }>("/api/compare"),
    ]);
    setCases(c.items);
    setPersonae(p.items);
    setRuns(r.items);
    setCompares(cmp.items);
    if (!caseId && c.items[0]) setCaseId(c.items[0].id);
    if (!personaId && p.items[0]) setPersonaId(p.items[0].id);
    if (!urgencyRunId && r.items[0]) setUrgencyRunId(r.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function run() {
    setError("");
    try {
      const data = await api<{ compare: Compare }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name,
          caseId,
          personaId,
          urgencyRunId,
          styleBias: "balanced",
        }),
      });
      setLast(data.compare);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Compare"
      subtitle="Style-aware triage (A) vs idealized-patient baseline (B)."
    >
      {!runs.length ? (
        <p className="mb-6 text-slate-500">
          Need an urgency run + baseline inputs — create a run on /urgency first.
        </p>
      ) : null}
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Compare name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="case">Conversation</Label>
          <select
            id="case"
            className="mt-1 flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 text-sm"
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="persona">Persona</Label>
          <select
            id="persona"
            className="mt-1 flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 text-sm"
            value={personaId}
            onChange={(e) => setPersonaId(e.target.value)}
          >
            {personae.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="run">Urgency run</Label>
          <select
            id="run"
            className="mt-1 flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 text-sm"
            value={urgencyRunId}
            onChange={(e) => setUrgencyRunId(e.target.value)}
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
      {error ? <p className="mb-4 text-sm text-[var(--studio-coral)]">{error}</p> : null}
      {last ? (
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
            <div className="text-sm text-slate-500">Style-aware (A)</div>
            <div className="mt-1 font-[family-name:var(--font-display)] text-3xl text-[var(--studio-mint)]">
              {last.styleAware.overall.toFixed(2)}
            </div>
            <div className="mt-3 h-2 rounded bg-slate-100">
              <div
                className="score-bar h-2 rounded bg-[var(--studio-mint)]"
                style={{ width: `${last.styleAware.overall}%` }}
              />
            </div>
          </div>
          <div className="rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
            <div className="text-sm text-slate-500">Idealized patient (B)</div>
            <div className="mt-1 font-[family-name:var(--font-display)] text-3xl text-[var(--studio-coral)]">
              {last.idealizedPatient.overall.toFixed(2)}
            </div>
            <div className="mt-3 h-2 rounded bg-slate-100">
              <div
                className="score-bar h-2 rounded bg-[var(--studio-coral)]"
                style={{ width: `${last.idealizedPatient.overall}%` }}
              />
            </div>
          </div>
          <p className="md:col-span-2 text-slate-700">
            Winner: <strong>{last.winner}</strong> · disparity gap{" "}
            <strong>{last.gap}</strong>
          </p>
        </div>
      ) : null}
      <ul className="space-y-2">
        {compares.map((c) => (
          <li
            key={c.id}
            className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3 text-sm"
          >
            {c.name} · {c.winner} · gap {c.gap} · A{" "}
            {c.styleAware.overall.toFixed(1)} / B{" "}
            {c.idealizedPatient.overall.toFixed(1)}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
