"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { CxrExam, ValidationCase, ValidationStatus } from "@/store";

const STATUSES: ValidationStatus[] = [
  "queued",
  "in_review",
  "accepted",
  "rejected",
  "needs_remap",
];

export default function ValidationPage() {
  const [exams, setExams] = useState<CxrExam[]>([]);
  const [items, setItems] = useState<ValidationCase[]>([]);
  const [examId, setExamId] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<ValidationStatus>("queued");
  const [confidence, setConfidence] = useState("0.7");
  const [priority, setPriority] = useState("2");
  const [error, setError] = useState("");

  async function load() {
    const [e, v] = await Promise.all([
      api<{ items: CxrExam[] }>("/api/exams"),
      api<{ items: ValidationCase[] }>("/api/validation"),
    ]);
    setExams(e.items);
    setItems(v.items);
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
      await api("/api/validation", {
        method: "POST",
        body: JSON.stringify({
          examId,
          name,
          status,
          confidence: Number(confidence),
          priority: Number(priority),
          notes: "Clinical validation queue entry",
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
      title="Validation queue"
      subtitle="Clinical reader review before trusting classify+localize plans."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3"
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
          placeholder="Case name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value as ValidationStatus)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
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
        <Input
          type="number"
          placeholder="Priority 1–5"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        />
        <Button type="submit">Queue case</Button>
      </form>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((v) => (
          <li
            key={v.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-medium text-slate-900">{v.name}</span>
              <span className="text-xs text-slate-500">
                {v.status} · P{v.priority} ·{" "}
                {Math.round(v.confidence * 100)}%
              </span>
            </div>
            {v.notes ? (
              <p className="mt-1 text-sm text-slate-500">{v.notes}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
