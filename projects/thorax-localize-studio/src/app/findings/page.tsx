"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { CxrExam, DiseaseFinding, DiseaseLabel } from "@/store";

const DISEASES: DiseaseLabel[] = [
  "pneumonia",
  "effusion",
  "consolidation",
  "pneumothorax",
  "cardiomegaly",
  "nodule",
  "atelectasis",
  "edema",
];

export default function FindingsPage() {
  const [exams, setExams] = useState<CxrExam[]>([]);
  const [items, setItems] = useState<DiseaseFinding[]>([]);
  const [examId, setExamId] = useState("");
  const [name, setName] = useState("");
  const [disease, setDisease] = useState<DiseaseLabel>("pneumonia");
  const [confidence, setConfidence] = useState("0.75");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [e, f] = await Promise.all([
      api<{ items: CxrExam[] }>("/api/exams"),
      api<{ items: DiseaseFinding[] }>(
        `/api/findings?examId=${encodeURIComponent(examId)}&q=${encodeURIComponent(q)}`,
      ),
    ]);
    setExams(e.items);
    setItems(f.items);
    if (!examId && e.items[0]) setExamId(e.items[0].id);
  }

  useEffect(() => {
    load().catch((err) => setError(String(err)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/findings", {
        method: "POST",
        body: JSON.stringify({
          examId,
          name,
          disease,
          confidence: Number(confidence),
          status: "detected",
          notes: "From findings console",
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
      title="Findings console"
      subtitle="Multi-disease CXR findings with confidence — labels still need lesion location."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-5"
      >
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={examId}
          onChange={(e) => setExamId(e.target.value)}
          required
        >
          {exams.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        <Input
          placeholder="Finding name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={disease}
          onChange={(e) => setDisease(e.target.value as DiseaseLabel)}
        >
          {DISEASES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <Input
          type="number"
          step="0.01"
          placeholder="Confidence"
          value={confidence}
          onChange={(e) => setConfidence(e.target.value)}
        />
        <Button type="submit">Add finding</Button>
      </form>

      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Search findings"
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
        {items.map((f, i) => (
          <li
            key={f.id}
            className="animate-finding-slide rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-medium text-slate-900">{f.name}</span>
              <span className="text-xs text-slate-500">
                {f.disease} · {f.status} · {Math.round(f.confidence * 100)}%
              </span>
            </div>
            {f.notes ? (
              <p className="mt-1 text-sm text-slate-500">{f.notes}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
