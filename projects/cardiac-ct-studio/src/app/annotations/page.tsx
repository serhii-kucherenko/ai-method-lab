"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type {
  AnnotationStatus,
  AnnotationTask,
  CtStudy,
} from "@/store";

const STATUSES: AnnotationStatus[] = [
  "queued",
  "in_review",
  "corrected",
  "accepted",
  "rejected",
];

export default function AnnotationsPage() {
  const [studies, setStudies] = useState<CtStudy[]>([]);
  const [items, setItems] = useState<AnnotationTask[]>([]);
  const [studyId, setStudyId] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<AnnotationStatus>("queued");
  const [expertCoverage, setExpertCoverage] = useState("0.7");
  const [priority, setPriority] = useState("2");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [s, a] = await Promise.all([
      api<{ items: CtStudy[] }>("/api/studies"),
      api<{ items: AnnotationTask[] }>(
        `/api/annotations?studyId=${encodeURIComponent(studyId)}&q=${encodeURIComponent(q)}`,
      ),
    ]);
    setStudies(s.items);
    setItems(a.items);
    if (!studyId && s.items[0]) setStudyId(s.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/annotations", {
        method: "POST",
        body: JSON.stringify({
          studyId,
          name,
          status,
          expertCoverage: Number(expertCoverage),
          priority: Number(priority),
          notes: "HITL task from annotations page",
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
      title="HITL annotations"
      subtitle="Queue expert review, track coverage, and accept corrected cardiac CT labels."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3"
      >
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={studyId}
          onChange={(e) => setStudyId(e.target.value)}
          required
        >
          {studies.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <Input
          placeholder="Task name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value as AnnotationStatus)}
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
          placeholder="Expert coverage"
          value={expertCoverage}
          onChange={(e) => setExpertCoverage(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Priority 1–5"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        />
        <Button type="submit">Enqueue HITL</Button>
      </form>

      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Filter tasks"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button type="button" variant="outline" onClick={() => load()}>
          Refresh
        </Button>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((a) => (
          <li
            key={a.id}
            className="animate-annotate-cursor rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-medium text-slate-900">{a.name}</span>
              <span className="text-xs text-slate-500">
                {a.status} · coverage {Math.round(a.expertCoverage * 100)}% ·
                P{a.priority}
              </span>
            </div>
            {a.notes ? (
              <p className="mt-1 text-sm text-slate-500">{a.notes}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
