"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { CxrExam, DiseaseFinding, LesionRecord } from "@/store";

export default function LesionsPage() {
  const [exams, setExams] = useState<CxrExam[]>([]);
  const [findings, setFindings] = useState<DiseaseFinding[]>([]);
  const [items, setItems] = useState<LesionRecord[]>([]);
  const [examId, setExamId] = useState("");
  const [findingId, setFindingId] = useState("");
  const [name, setName] = useState("");
  const [boundaryClarity, setBoundaryClarity] = useState("0.75");
  const [laterality, setLaterality] =
    useState<LesionRecord["laterality"]>("right");
  const [error, setError] = useState("");

  async function load(nextExamId?: string) {
    const eid = nextExamId ?? examId;
    const [e, f, l] = await Promise.all([
      api<{ items: CxrExam[] }>("/api/exams"),
      api<{ items: DiseaseFinding[] }>(
        `/api/findings?examId=${encodeURIComponent(eid)}`,
      ),
      api<{ items: LesionRecord[] }>(
        `/api/lesions?examId=${encodeURIComponent(eid)}`,
      ),
    ]);
    setExams(e.items);
    setFindings(f.items);
    setItems(l.items);
    const chosen = eid || e.items[0]?.id || "";
    if (!examId && chosen) setExamId(chosen);
    if (!findingId && f.items[0]) setFindingId(f.items[0].id);
  }

  useEffect(() => {
    load().catch((err) => setError(String(err)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/lesions", {
        method: "POST",
        body: JSON.stringify({
          examId,
          findingId,
          name,
          boundaryClarity: Number(boundaryClarity),
          laterality,
          status: "mapped",
          notes: "Lesion localization record",
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
      title="Lesion records"
      subtitle="Localize findings with laterality and boundary clarity — where, not just what."
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
          value={findingId}
          onChange={(e) => setFindingId(e.target.value)}
          required
        >
          {findings.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        <Input
          placeholder="Lesion name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={laterality}
          onChange={(e) =>
            setLaterality(e.target.value as LesionRecord["laterality"])
          }
        >
          <option value="left">left</option>
          <option value="right">right</option>
          <option value="bilateral">bilateral</option>
          <option value="midline">midline</option>
        </select>
        <Input
          type="number"
          step="0.01"
          placeholder="Boundary clarity"
          value={boundaryClarity}
          onChange={(e) => setBoundaryClarity(e.target.value)}
        />
        <Button type="submit">Add lesion</Button>
      </form>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((l) => (
          <li
            key={l.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-medium text-slate-900">{l.name}</span>
              <span className="text-xs text-slate-500">
                {l.laterality} · {l.status} · boundary{" "}
                {Math.round(l.boundaryClarity * 100)}%
              </span>
            </div>
            {l.notes ? (
              <p className="mt-1 text-sm text-slate-500">{l.notes}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
