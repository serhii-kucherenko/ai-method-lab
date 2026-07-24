"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { CompareResult, Course } from "@/store";
import type { TutorInput } from "@/domain/types";

function defaultInput(): TutorInput {
  return {
    vulnComplexity: 0.7,
    rubricItemCount: 12,
    tutorCoverage: 0.85,
    orchestrationRounds: 5,
    pedagogyDepth: 0.75,
    threatCoverage: 0.72,
    safetyGateStrength: 0.8,
    studentRiskLevel: 0.45,
    exploitHintRisk: 0.38,
    explainerSpecialization: 0.78,
    safetySpecialization: 0.82,
    rubricSpecialization: 0.74,
    profile: "guided",
  };
}

export default function ComparePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [rows, setRows] = useState<CompareResult[]>([]);
  const [courseId, setCourseId] = useState("");
  const [name, setName] = useState("Orchestrated vs single");
  const [input, setInput] = useState<TutorInput>(defaultInput());
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const c = await api<{ items: Course[] }>(
        "/api/courses?page=1&pageSize=50",
      );
      setCourses(c.items);
      if (!courseId && c.items[0]) setCourseId(c.items[0].id);
      const cmp = await api<{ items: CompareResult[] }>("/api/compare");
      setRows(cmp.items);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function run() {
    start(async () => {
      try {
        await api<CompareResult>("/api/compare", {
          method: "POST",
          body: JSON.stringify({ name, courseId, tutorInput: input }),
        });
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Orchestrated vs single-LLM"
      subtitle="Compare multi-LLM secure tutor plans against an unchecked single-LLM baseline."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-stone-900">Run compare</p>
          <div>
            <Label htmlFor="cmp-name">Name</Label>
            <Input
              id="cmp-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cmp-course">Course</Label>
            <select
              id="cmp-course"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Vuln complexity</Label>
              <Input
                value={String(input.vulnComplexity)}
                onChange={(e) =>
                  setInput({
                    ...input,
                    vulnComplexity: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label>Safety gate</Label>
              <Input
                value={String(input.safetyGateStrength)}
                onChange={(e) =>
                  setInput({
                    ...input,
                    safetyGateStrength: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button onClick={run} disabled={pending || !courseId}>
            Compare
          </Button>
        </div>

        <ul className="space-y-4">
          {rows.map((r) => (
            <li
              key={r.id}
              className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-stone-900">{r.name}</p>
                <Badge>
                  winner:{" "}
                  {r.winner === "orchestrated"
                    ? "orchestrated"
                    : r.winner === "single"
                      ? "single"
                      : "tie"}
                </Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Orchestrated",
                    score: r.orchestrated.overall,
                    color: "bg-[var(--studio-forest)]",
                  },
                  {
                    label: "Single-LLM",
                    score: r.single.overall,
                    color: "bg-stone-400",
                  },
                ].map((bar) => (
                  <div key={bar.label}>
                    <p className="mb-1 text-xs text-stone-500">
                      {bar.label} {bar.score.toFixed(1)}
                    </p>
                    <div className="flex h-24 items-end rounded bg-stone-100 p-2">
                      <div
                        className={`animate-bar-rise w-full rounded-sm ${bar.color}`}
                        style={{ height: `${Math.max(8, bar.score)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-stone-500">
                Pedagogy {r.orchestrated.pedagogyFit.toFixed(1)} vs{" "}
                {r.single.pedagogyFit.toFixed(1)} · Safety{" "}
                {r.orchestrated.safetyGateScore.toFixed(1)} vs{" "}
                {r.single.safetyGateScore.toFixed(1)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
