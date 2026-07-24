"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { ReviewQuestion, ScreenDecision, ScreenVerdict, SearchStrategy } from "@/store";

export default function ScreensPage() {
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [searches, setSearches] = useState<SearchStrategy[]>([]);
  const [items, setItems] = useState<ScreenDecision[]>([]);
  const [questionId, setQuestionId] = useState("");
  const [searchId, setSearchId] = useState("");
  const [citation, setCitation] = useState("");
  const [verdict, setVerdict] = useState<ScreenVerdict>("include");
  const [reason, setReason] = useState("");
  const [pending, start] = useTransition();

  function refresh(qid?: string) {
    start(async () => {
      const qs = await api<{ items: ReviewQuestion[] }>("/api/questions?page=1&pageSize=50");
      setQuestions(qs.items);
      const id = qid || questionId || qs.items[0]?.id || "";
      if (!questionId && id) setQuestionId(id);
      const ss = await api<{ items: SearchStrategy[] }>(
        `/api/searches?questionId=${encodeURIComponent(id)}`,
      );
      setSearches(ss.items);
      if (!searchId && ss.items[0]) setSearchId(ss.items[0].id);
      const sc = await api<{ items: ScreenDecision[] }>(
        `/api/screens?questionId=${encodeURIComponent(id)}`,
      );
      setItems(sc.items);
    });
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      await api("/api/screens", {
        method: "POST",
        body: JSON.stringify({ questionId, searchId, citation, verdict, reason }),
      });
      setCitation("");
      setReason("");
      refresh(questionId);
    });
  }

  return (
    <StudioShell
      title="Screen queue"
      subtitle="Decide include, exclude, or maybe — with a reason on the trail."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-stone-900">Screen decision</p>
          <div>
            <Label>Question</Label>
            <select
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={questionId}
              onChange={(e) => {
                setQuestionId(e.target.value);
                refresh(e.target.value);
              }}
            >
              {questions.map((q) => (
                <option key={q.id} value={q.id}>{q.title}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Search</Label>
            <select
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            >
              {searches.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Citation</Label>
            <Input value={citation} onChange={(e) => setCitation(e.target.value)} placeholder="Author Year · design · n" />
          </div>
          <div>
            <Label>Verdict</Label>
            <select
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={verdict}
              onChange={(e) => setVerdict(e.target.value as ScreenVerdict)}
            >
              <option value="include">include</option>
              <option value="exclude">exclude</option>
              <option value="maybe">maybe</option>
            </select>
          </div>
          <div>
            <Label>Reason</Label>
            <Input value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <Button disabled={pending || !citation.trim() || !searchId} onClick={create}>
            Record decision
          </Button>
        </div>
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li
              key={item.id}
              className="animate-queue-slide rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-stone-900">{item.citation}</p>
                <Badge variant="outline">{item.verdict}</Badge>
              </div>
              <p className="mt-1 text-sm text-stone-500">{item.reason || "—"}</p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
