"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { ReviewQuestion, SearchStrategy } from "@/store";

export default function SearchesPage() {
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [items, setItems] = useState<SearchStrategy[]>([]);
  const [questionId, setQuestionId] = useState("");
  const [name, setName] = useState("");
  const [databases, setDatabases] = useState("PubMed, Embase");
  const [queryString, setQueryString] = useState("");
  const [hitEstimate, setHitEstimate] = useState("100");
  const [pending, start] = useTransition();

  function refresh() {
    start(async () => {
      const qs = await api<{ items: ReviewQuestion[] }>("/api/questions?page=1&pageSize=50");
      setQuestions(qs.items);
      const qid = questionId || qs.items[0]?.id || "";
      if (!questionId && qid) setQuestionId(qid);
      const res = await api<{ items: SearchStrategy[] }>(
        `/api/searches?questionId=${encodeURIComponent(qid)}`,
      );
      setItems(res.items);
    });
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      await api("/api/searches", {
        method: "POST",
        body: JSON.stringify({
          questionId,
          name,
          databases,
          queryString,
          hitEstimate: Number(hitEstimate) || 0,
        }),
      });
      setName("");
      setQueryString("");
      refresh();
    });
  }

  return (
    <StudioShell
      title="Search strategies"
      subtitle="Craft database queries linked to a review question."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-stone-900">New strategy</p>
          <div>
            <Label>Question</Label>
            <select
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={questionId}
              onChange={(e) => setQuestionId(e.target.value)}
            >
              {questions.map((q) => (
                <option key={q.id} value={q.id}>{q.title}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Databases</Label>
            <Input value={databases} onChange={(e) => setDatabases(e.target.value)} />
          </div>
          <div>
            <Label>Query</Label>
            <Input value={queryString} onChange={(e) => setQueryString(e.target.value)} />
          </div>
          <div>
            <Label>Hit estimate</Label>
            <Input value={hitEstimate} onChange={(e) => setHitEstimate(e.target.value)} />
          </div>
          <Button disabled={pending || !name.trim() || !queryString.trim() || !questionId} onClick={create}>
            Save strategy
          </Button>
        </div>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
              <p className="font-medium text-stone-900">{item.name}</p>
              <p className="mt-1 text-sm text-stone-500">{item.databases}</p>
              <p className="mt-2 font-mono text-xs text-stone-600">{item.queryString}</p>
              <p className="mt-2 text-xs text-stone-400">~{item.hitEstimate} hits</p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
