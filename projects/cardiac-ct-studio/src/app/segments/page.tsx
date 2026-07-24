"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type {
  CtStudy,
  SegmentStatus,
  StructureName,
  StructureSegment,
} from "@/store";

const STRUCTURES: StructureName[] = [
  "lv",
  "rv",
  "la",
  "ra",
  "aorta",
  "coronaries",
  "myocardium",
  "pulmonary_veins",
];

const STATUSES: SegmentStatus[] = [
  "draft",
  "reviewed",
  "locked",
  "archived",
];

export default function SegmentsPage() {
  const [studies, setStudies] = useState<CtStudy[]>([]);
  const [items, setItems] = useState<StructureSegment[]>([]);
  const [studyId, setStudyId] = useState("");
  const [name, setName] = useState("");
  const [structure, setStructure] = useState<StructureName>("myocardium");
  const [status, setStatus] = useState<SegmentStatus>("draft");
  const [diceEstimate, setDiceEstimate] = useState("0.88");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [s, seg] = await Promise.all([
      api<{ items: CtStudy[] }>("/api/studies"),
      api<{ items: StructureSegment[] }>(
        `/api/segments?studyId=${encodeURIComponent(studyId)}&q=${encodeURIComponent(q)}`,
      ),
    ]);
    setStudies(s.items);
    setItems(seg.items);
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
      await api("/api/segments", {
        method: "POST",
        body: JSON.stringify({
          studyId,
          name,
          structure,
          status,
          diceEstimate: Number(diceEstimate),
          notes: "Segment from segments page",
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
      title="Multi-structure segments"
      subtitle="Track chambers, myocardium, aorta, and coronaries with Dice estimates after HITL."
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
          placeholder="Segment name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={structure}
          onChange={(e) => setStructure(e.target.value as StructureName)}
        >
          {STRUCTURES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value as SegmentStatus)}
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
          placeholder="Dice"
          value={diceEstimate}
          onChange={(e) => setDiceEstimate(e.target.value)}
        />
        <Button type="submit">Add segment</Button>
      </form>

      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Filter segments"
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
        {items.map((s) => (
          <li
            key={s.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-medium text-slate-900">{s.name}</span>
              <span className="text-xs text-slate-500">
                {s.structure} · {s.status} · Dice{" "}
                {Math.round(s.diceEstimate * 100)}%
              </span>
            </div>
            {s.notes ? (
              <p className="mt-1 text-sm text-slate-500">{s.notes}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
