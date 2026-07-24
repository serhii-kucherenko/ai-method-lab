"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { CtStudy, PhenotypeReport, PhenotypeStatus } from "@/store";

const STATUSES: PhenotypeStatus[] = [
  "draft",
  "reviewed",
  "published",
  "retracted",
];

export default function PhenotypesPage() {
  const [studies, setStudies] = useState<CtStudy[]>([]);
  const [items, setItems] = useState<PhenotypeReport[]>([]);
  const [studyId, setStudyId] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<PhenotypeStatus>("draft");
  const [richness, setRichness] = useState("0.7");
  const [calciumBurden, setCalciumBurden] = useState("0.4");
  const [chamberIndex, setChamberIndex] = useState("0.55");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [s, p] = await Promise.all([
      api<{ items: CtStudy[] }>("/api/studies"),
      api<{ items: PhenotypeReport[] }>(
        `/api/phenotypes?studyId=${encodeURIComponent(studyId)}&q=${encodeURIComponent(q)}`,
      ),
    ]);
    setStudies(s.items);
    setItems(p.items);
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
      await api("/api/phenotypes", {
        method: "POST",
        body: JSON.stringify({
          studyId,
          name,
          status,
          richness: Number(richness),
          calciumBurden: Number(calciumBurden),
          chamberIndex: Number(chamberIndex),
          notes: "Phenotype from phenotypes page",
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
      title="Phenotype reports"
      subtitle="Review foundation phenotypes after HITL segments — calcium burden and chamber indices."
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
          placeholder="Report name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value as PhenotypeStatus)}
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
          placeholder="Richness"
          value={richness}
          onChange={(e) => setRichness(e.target.value)}
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Calcium"
          value={calciumBurden}
          onChange={(e) => setCalciumBurden(e.target.value)}
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Chamber index"
          value={chamberIndex}
          onChange={(e) => setChamberIndex(e.target.value)}
        />
        <Button type="submit">Add phenotype</Button>
      </form>

      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Filter phenotypes"
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
        {items.map((p) => (
          <li
            key={p.id}
            className="animate-phenotype-chip rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-medium text-slate-900">{p.name}</span>
              <span className="text-xs text-slate-500">
                {p.status} · richness {Math.round(p.richness * 100)}% · Ca{" "}
                {Math.round(p.calciumBurden * 100)}% · chamber{" "}
                {Math.round(p.chamberIndex * 100)}%
              </span>
            </div>
            {p.notes ? (
              <p className="mt-1 text-sm text-slate-500">{p.notes}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
