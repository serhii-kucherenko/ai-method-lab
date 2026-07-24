"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { CompareResult, ReviewQuestion } from "@/store";

export default function ComparePage() {
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [items, setItems] = useState<CompareResult[]>([]);
  const [questionId, setQuestionId] = useState("");
  const [name, setName] = useState("");
  const [pending, start] = useTransition();

  function refresh() {
    start(async () => {
      const qs = await api<{ items: ReviewQuestion[] }>("/api/questions?page=1&pageSize=50");
      setQuestions(qs.items);
      if (!questionId && qs.items[0]) setQuestionId(qs.items[0].id);
      const res = await api<{ items: CompareResult[] }>("/api/compare");
      setItems(res.items);
    });
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name: name || "Agentic vs ad-hoc", questionId }),
      });
      setName("");
      refresh();
    });
  }

  return (
    <StudioShell
      title="Compare"
      subtitle="Agentic pipeline plan quality versus an ad-hoc baseline that skips screen discipline and heterogeneity."
    >
      <div className="mb-6 space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <div>
          <Label>Question</Label>
          <select
            className="flex h-8 w-full max-w-xl rounded-lg border border-input bg-transparent px-2.5 text-sm"
            value={questionId}
            onChange={(e) => setQuestionId(e.target.value)}
          >
            {questions.map((q) => (
              <option key={q.id} value={q.id}>{q.title}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Label</Label>
          <Input className="max-w-xl" value={name} onChange={(e) => setName(e.target.value)} placeholder="Agentic vs ad-hoc" />
        </div>
        <Button disabled={pending || !questionId} onClick={create}>
          Run compare
        </Button>
      </div>

      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-stone-900">{item.name}</p>
              <Badge>winner: {item.winner}</Badge>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--studio-forest)]">Agentic</p>
                <p className="mt-1 text-2xl font-[family-name:var(--font-display)] text-stone-900">
                  {item.agentic.overall}
                </p>
                <p className="text-xs text-stone-500">
                  screen {item.agentic.screenCoverage} · hetero {item.agentic.heterogeneityScore}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-stone-400">Ad-hoc</p>
                <p className="mt-1 text-2xl font-[family-name:var(--font-display)] text-stone-900">
                  {item.adhoc.overall}
                </p>
                <p className="text-xs text-stone-500">
                  screen {item.adhoc.screenCoverage} · hetero {item.adhoc.heterogeneityScore}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
