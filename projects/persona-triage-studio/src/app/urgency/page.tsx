"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Conversation = { id: string; label: string };
type Persona = { id: string; label: string };
type UrgencyRun = {
  id: string;
  caseId: string;
  personaId: string;
  styleFit: number;
  personaCoherence: number;
  urgencyAlignment: number;
  diversityCoverage: number;
  status: string;
};

export default function UrgencyPage() {
  const [runs, setRuns] = useState<UrgencyRun[]>([]);
  const [cases, setCases] = useState<Conversation[]>([]);
  const [personae, setPersonae] = useState<Persona[]>([]);
  const [caseId, setCaseId] = useState("");
  const [personaId, setPersonaId] = useState("");
  const [styleFit, setStyleFit] = useState(0.7);
  const [personaCoherence, setPersonaCoherence] = useState(0.65);
  const [urgencyAlignment, setUrgencyAlignment] = useState(0.7);
  const [diversityCoverage, setDiversityCoverage] = useState(0.68);
  const [error, setError] = useState("");

  async function load() {
    const [r, c, p] = await Promise.all([
      api<{ items: UrgencyRun[] }>("/api/urgency"),
      api<{ items: Conversation[] }>("/api/conversations"),
      api<{ items: Persona[] }>("/api/personae"),
    ]);
    setRuns(r.items);
    setCases(c.items);
    setPersonae(p.items);
    if (!caseId && c.items[0]) setCaseId(c.items[0].id);
    if (!personaId && p.items[0]) setPersonaId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/urgency", {
        method: "POST",
        body: JSON.stringify({
          caseId,
          personaId,
          styleFit,
          personaCoherence,
          urgencyAlignment,
          diversityCoverage,
          reviewerNotes: "Soft-sim urgency assessment",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Urgency runs"
      subtitle="Assess urgency under a persona + conversation case before compare."
    >
      {!cases.length || !personae.length ? (
        <p className="mb-6 text-slate-500">
          Need a conversation case and a persona before creating an urgency run.
        </p>
      ) : null}
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3">
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
          <Label htmlFor="sf">Style fit</Label>
          <Input
            id="sf"
            type="number"
            step="0.05"
            min={0}
            max={1}
            value={styleFit}
            onChange={(e) => setStyleFit(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="pc">Persona coherence</Label>
          <Input
            id="pc"
            type="number"
            step="0.05"
            min={0}
            max={1}
            value={personaCoherence}
            onChange={(e) => setPersonaCoherence(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="ua">Urgency alignment</Label>
          <Input
            id="ua"
            type="number"
            step="0.05"
            min={0}
            max={1}
            value={urgencyAlignment}
            onChange={(e) => setUrgencyAlignment(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="dc">Diversity coverage</Label>
          <Input
            id="dc"
            type="number"
            step="0.05"
            min={0}
            max={1}
            value={diversityCoverage}
            onChange={(e) => setDiversityCoverage(Number(e.target.value))}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={() => create()}>Create urgency run</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-[var(--studio-coral)]">{error}</p> : null}
      <ul className="space-y-2">
        {runs.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium text-slate-900">{r.id}</div>
            <div className="mt-1 text-sm text-slate-500">
              style {r.styleFit} · coherence {r.personaCoherence} · urgency{" "}
              {r.urgencyAlignment} · diversity {r.diversityCoverage}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
