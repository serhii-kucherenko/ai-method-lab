"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { ReviewQuestion } from "@/store";

export default function QuestionsPage() {
  const [items, setItems] = useState<ReviewQuestion[]>([]);
  const [q, setQ] = useState("");
  const [title, setTitle] = useState("");
  const [population, setPopulation] = useState("");
  const [intervention, setIntervention] = useState("");
  const [comparator, setComparator] = useState("");
  const [outcome, setOutcome] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(search = q) {
    start(async () => {
      const res = await api<{ items: ReviewQuestion[] }>(
        `/api/questions?q=${encodeURIComponent(search)}&page=1&pageSize=20`,
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
        await api("/api/questions", {
          method: "POST",
          body: JSON.stringify({
            title,
            population,
            intervention,
            comparator,
            outcome,
            notes,
          }),
        });
        setTitle("");
        setPopulation("");
        setIntervention("");
        setComparator("");
        setOutcome("");
        setNotes("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Review questions"
      subtitle="Open PICO questions that drive search, screen, extract, and pool."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <p className="font-medium text-stone-900">Onboarding</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-stone-500">
          <li>Create a review question with population, intervention, comparator, outcome.</li>
          <li>Attach search strategies, screen citations, and extract effects.</li>
          <li>Run agentic pooled analysis and compare against an ad-hoc baseline.</li>
        </ol>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-stone-900">New question</p>
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Statins vs placebo for LDL…" />
          </div>
          <div>
            <Label>Population</Label>
            <Input value={population} onChange={(e) => setPopulation(e.target.value)} />
          </div>
          <div>
            <Label>Intervention</Label>
            <Input value={intervention} onChange={(e) => setIntervention(e.target.value)} />
          </div>
          <div>
            <Label>Comparator</Label>
            <Input value={comparator} onChange={(e) => setComparator(e.target.value)} />
          </div>
          <div>
            <Label>Outcome</Label>
            <Input value={outcome} onChange={(e) => setOutcome(e.target.value)} />
          </div>
          <div>
            <Label>Notes</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button
            disabled={pending || !title.trim() || !population.trim() || !outcome.trim()}
            onClick={create}
          >
            Create question
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search questions…"
            />
            <Button variant="outline" disabled={pending} onClick={() => load()}>
              Search
            </Button>
          </div>
          <ul className="space-y-3">
            {items.map((item, i) => (
              <li
                key={item.id}
                className="animate-queue-slide rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-stone-900">{item.title}</p>
                  <Badge variant="outline">{item.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-stone-500">{item.pico}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
