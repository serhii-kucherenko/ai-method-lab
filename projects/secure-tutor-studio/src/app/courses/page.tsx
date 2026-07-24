"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { Course, CourseKind } from "@/store";

const KINDS: CourseKind[] = ["web", "api", "mobile", "cloud", "secure-sdlc"];

export default function CoursesPage() {
  const [items, setItems] = useState<Course[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [kind, setKind] = useState<CourseKind>("web");
  const [vulnComplexity, setVulnComplexity] = useState("0.65");
  const [threatCoverage, setThreatCoverage] = useState("0.7");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(search = q) {
    start(async () => {
      const res = await api<{ items: Course[] }>(
        `/api/courses?q=${encodeURIComponent(search)}&page=1&pageSize=20`,
      );
      setItems(res.items);
    });
  }

  useEffect(() => {
    load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api<Course>("/api/courses", {
          method: "POST",
          body: JSON.stringify({
            name,
            kind,
            vulnComplexity: Number(vulnComplexity),
            threatCoverage: Number(threatCoverage),
            notes,
          }),
        });
        setName("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Course workspaces"
      subtitle="Secure software education courses with vulnerability complexity and threat coverage."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <p className="font-medium text-stone-900">Onboarding</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-stone-500">
          <li>Create a course with vulnerability complexity.</li>
          <li>Attach tutor roles on Tutors, then run a lesson on Lessons.</li>
          <li>Compare orchestrated vs single-LLM, then export from Runs.</li>
        </ol>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-stone-900">Create course</p>
          <div>
            <Label htmlFor="c-name">Name</Label>
            <Input
              id="c-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Injection defenses lab"
            />
          </div>
          <div>
            <Label htmlFor="c-kind">Kind</Label>
            <select
              id="c-kind"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={kind}
              onChange={(e) => setKind(e.target.value as CourseKind)}
            >
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="c-vuln">Vuln complexity</Label>
              <Input
                id="c-vuln"
                value={vulnComplexity}
                onChange={(e) => setVulnComplexity(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="c-threat">Threat coverage</Label>
              <Input
                id="c-threat"
                value={threatCoverage}
                onChange={(e) => setThreatCoverage(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="c-notes">Notes</Label>
            <Input
              id="c-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button onClick={create} disabled={pending || !name.trim()}>
            Create course
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search courses"
            />
            <Button variant="outline" onClick={() => load()} disabled={pending}>
              Search
            </Button>
          </div>
          <ul className="space-y-3">
            {items.map((c) => (
              <li
                key={c.id}
                className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-stone-900">{c.name}</p>
                  <Badge variant="secondary">{c.kind}</Badge>
                </div>
                <p className="mt-1 text-sm text-stone-500">
                  Vuln {c.vulnComplexity.toFixed(2)} · Threat{" "}
                  {c.threatCoverage.toFixed(2)}
                </p>
                {c.notes ? (
                  <p className="mt-2 text-sm text-stone-500">{c.notes}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
