"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { PooledAnalysis, ReviewQuestion, ScoreMode, SynthesisProfile } from "@/store";

export default function AnalysesPage() {
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [items, setItems] = useState<PooledAnalysis[]>([]);
  const [questionId, setQuestionId] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<ScoreMode>("agentic");
  const [profile, setProfile] = useState<SynthesisProfile>("balanced");
  const [pending, start] = useTransition();

  function refresh(qid?: string) {
    start(async () => {
      const qs = await api<{ items: ReviewQuestion[] }>("/api/questions?page=1&pageSize=50");
      setQuestions(qs.items);
      const id = qid || questionId || qs.items[0]?.id || "";
      if (!questionId && id) setQuestionId(id);
      const res = await api<{ items: PooledAnalysis[] }>(
        `/api/analyses?questionId=${encodeURIComponent(id)}`,
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
      await api("/api/analyses", {
        method: "POST",
        body: JSON.stringify({ questionId, name, mode, profile }),
      });
      setName("");
      refresh(questionId);
    });
  }

  return (
    <StudioShell
      title="Pooled analyses"
      subtitle="Pool effects with soft heterogeneity (I² / τ²) under an agentic or ad-hoc plan."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-stone-900">Run analysis</p>
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
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Random-effects pool" />
          </div>
          <div>
            <Label>Mode</Label>
            <select
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={mode}
              onChange={(e) => setMode(e.target.value as ScoreMode)}
            >
              <option value="agentic">agentic</option>
              <option value="adhoc">adhoc</option>
            </select>
          </div>
          <div>
            <Label>Profile</Label>
            <select
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={profile}
              onChange={(e) => setProfile(e.target.value as SynthesisProfile)}
            >
              <option value="balanced">balanced</option>
              <option value="rigorous">rigorous</option>
            </select>
          </div>
          <Button disabled={pending || !name.trim() || !questionId} onClick={create}>
            Run pool
          </Button>
        </div>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-stone-900">{item.name}</p>
                <Badge variant="outline">{item.mode}</Badge>
              </div>
              <p className="mt-2 text-sm text-stone-600">
                pooled {item.pooledEffect} · I² {item.iSquared}% · τ² {item.tauSquared}
              </p>
              {item.quality ? (
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs text-stone-500">
                    <span>Overall plan quality</span>
                    <span>{item.quality.overall}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded bg-stone-100">
                    <div
                      className="animate-forest-reveal h-full rounded bg-[var(--studio-forest)]"
                      style={{ width: `${Math.min(100, item.quality.overall)}%` }}
                    />
                  </div>
                  <p className="text-xs text-stone-400">
                    screen {item.quality.screenCoverage} · hetero {item.quality.heterogeneityScore} · trail {item.quality.auditTrail}
                  </p>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
