"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { EffectRecord, ReviewQuestion } from "@/store";

export default function EffectsPage() {
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [items, setItems] = useState<EffectRecord[]>([]);
  const [questionId, setQuestionId] = useState("");
  const [studyLabel, setStudyLabel] = useState("");
  const [effectSize, setEffectSize] = useState("-20");
  const [se, setSe] = useState("3");
  const [n, setN] = useState("200");
  const [outcome, setOutcome] = useState("");
  const [exportText, setExportText] = useState("");
  const [pending, start] = useTransition();

  function refresh(qid?: string) {
    start(async () => {
      const qs = await api<{ items: ReviewQuestion[] }>("/api/questions?page=1&pageSize=50");
      setQuestions(qs.items);
      const id = qid || questionId || qs.items[0]?.id || "";
      if (!questionId && id) setQuestionId(id);
      const res = await api<{ items: EffectRecord[] }>(
        `/api/effects?questionId=${encodeURIComponent(id)}`,
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
      await api("/api/effects", {
        method: "POST",
        body: JSON.stringify({
          questionId,
          studyLabel,
          effectSize: Number(effectSize),
          se: Number(se),
          n: Number(n),
          outcome,
        }),
      });
      setStudyLabel("");
      refresh(questionId);
    });
  }

  function doExport() {
    start(async () => {
      const text = await api<string>(
        `/api/effects?questionId=${encodeURIComponent(questionId)}&export=json`,
      );
      setExportText(text);
    });
  }

  return (
    <StudioShell
      title="Effect ledger"
      subtitle="Extract study-level effects before pooling."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-stone-900">Add effect</p>
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
            <Label>Study</Label>
            <Input value={studyLabel} onChange={(e) => setStudyLabel(e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label>Effect</Label>
              <Input value={effectSize} onChange={(e) => setEffectSize(e.target.value)} />
            </div>
            <div>
              <Label>SE</Label>
              <Input value={se} onChange={(e) => setSe(e.target.value)} />
            </div>
            <div>
              <Label>N</Label>
              <Input value={n} onChange={(e) => setN(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Outcome</Label>
            <Input value={outcome} onChange={(e) => setOutcome(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button disabled={pending || !studyLabel.trim() || !questionId} onClick={create}>
              Add effect
            </Button>
            <Button variant="outline" disabled={pending} onClick={doExport}>
              Export JSON
            </Button>
          </div>
          {exportText ? (
            <pre className="max-h-40 overflow-auto rounded bg-stone-50 p-2 text-xs">{exportText}</pre>
          ) : null}
        </div>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
              <p className="font-medium text-stone-900">{item.studyLabel}</p>
              <p className="mt-1 text-sm text-stone-500">
                effect {item.effectSize} · SE {item.se} · n={item.n} · {item.outcome}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
