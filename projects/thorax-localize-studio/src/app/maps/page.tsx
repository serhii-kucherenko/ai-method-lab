"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { ActivationMap, CxrExam, LesionRecord } from "@/store";

export default function MapsPage() {
  const [exams, setExams] = useState<CxrExam[]>([]);
  const [lesions, setLesions] = useState<LesionRecord[]>([]);
  const [items, setItems] = useState<ActivationMap[]>([]);
  const [examId, setExamId] = useState("");
  const [lesionId, setLesionId] = useState("");
  const [name, setName] = useState("");
  const [peakStrength, setPeakStrength] = useState("0.8");
  const [coherence, setCoherence] = useState("0.75");
  const [error, setError] = useState("");

  async function load(nextExamId?: string) {
    const eid = nextExamId ?? examId;
    const [e, l, m] = await Promise.all([
      api<{ items: CxrExam[] }>("/api/exams"),
      api<{ items: LesionRecord[] }>(
        `/api/lesions?examId=${encodeURIComponent(eid)}`,
      ),
      api<{ items: ActivationMap[] }>(
        `/api/maps?examId=${encodeURIComponent(eid)}`,
      ),
    ]);
    setExams(e.items);
    setLesions(l.items);
    setItems(m.items);
    const chosen = eid || e.items[0]?.id || "";
    if (!examId && chosen) setExamId(chosen);
    if (!lesionId && l.items[0]) setLesionId(l.items[0].id);
  }

  useEffect(() => {
    load().catch((err) => setError(String(err)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/maps", {
        method: "POST",
        body: JSON.stringify({
          examId,
          lesionId,
          name,
          peakStrength: Number(peakStrength),
          coherence: Number(coherence),
          status: "bloomed",
          notes: "PCAM-style activation map",
        }),
      });
      setName("");
      await load(examId);
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Activation maps"
      subtitle="Probabilistic lesion maps — peak strength and spatial coherence for localize plans."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3"
      >
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={examId}
          onChange={(e) => {
            setExamId(e.target.value);
            load(e.target.value).catch((err) => setError(String(err)));
          }}
          required
        >
          {exams.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={lesionId}
          onChange={(e) => setLesionId(e.target.value)}
          required
        >
          {lesions.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
        <Input
          placeholder="Map name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Peak strength"
          value={peakStrength}
          onChange={(e) => setPeakStrength(e.target.value)}
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Coherence"
          value={coherence}
          onChange={(e) => setCoherence(e.target.value)}
        />
        <Button type="submit">Bloom map</Button>
      </form>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((m) => (
          <li
            key={m.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-medium text-slate-900">{m.name}</span>
              <span className="text-xs text-slate-500">
                {m.status} · peak {Math.round(m.peakStrength * 100)}% ·
                coherence {Math.round(m.coherence * 100)}%
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded bg-slate-200">
              <div
                className="animate-heatmap-bloom h-full rounded bg-[var(--studio-cyan)]"
                style={{ width: `${Math.round(m.peakStrength * 100)}%` }}
              />
            </div>
            {m.notes ? (
              <p className="mt-2 text-sm text-slate-500">{m.notes}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
