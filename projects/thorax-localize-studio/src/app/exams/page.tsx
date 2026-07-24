"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { CxrExam, ExamKind } from "@/store";

const KINDS: ExamKind[] = ["pa", "lateral", "ap", "portable", "mixed"];

export default function ExamsPage() {
  const [items, setItems] = useState<CxrExam[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [examKind, setExamKind] = useState<ExamKind>("pa");
  const [viewCount, setViewCount] = useState("2");
  const [imageQuality, setImageQuality] = useState("0.75");
  const [error, setError] = useState("");
  const [checklist, setChecklist] = useState(false);

  async function load(search = q) {
    const res = await api<{ items: CxrExam[] }>(
      `/api/exams?q=${encodeURIComponent(search)}`,
    );
    setItems(res.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/exams", {
        method: "POST",
        body: JSON.stringify({
          name,
          examKind,
          viewCount: Number(viewCount),
          imageQuality: Number(imageQuality),
          notes: "Registered from exams page",
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
      title="CXR exams"
      subtitle="Register chest radiographs — view kind, count, and image quality first."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <label className="flex items-start gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={checklist}
            onChange={(e) => setChecklist(e.target.checked)}
            className="mt-1"
          />
          <span>
            Onboarding: confirm exam kind and image quality, and that this
            studio is a method-lab planner — not clinical certification or live
            PACS.
          </span>
        </label>
      </div>

      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-5"
      >
        <Input
          placeholder="Exam name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={examKind}
          onChange={(e) => setExamKind(e.target.value as ExamKind)}
        >
          {KINDS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <Input
          type="number"
          placeholder="Views"
          value={viewCount}
          onChange={(e) => setViewCount(e.target.value)}
          required
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Image quality"
          value={imageQuality}
          onChange={(e) => setImageQuality(e.target.value)}
          required
        />
        <Button type="submit">Add exam</Button>
      </form>

      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Search exams"
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
        {items.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-medium text-slate-900">{c.name}</span>
              <span className="text-xs text-slate-500">
                {c.examKind} · {c.viewCount} views · quality{" "}
                {Math.round(c.imageQuality * 100)}%
              </span>
            </div>
            {c.notes ? (
              <p className="mt-1 text-sm text-slate-500">{c.notes}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
