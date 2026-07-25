"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/client-api";

type Stream = { id: string; label: string };
type Segment = { id: string; streamId: string; glossText: string };
type Budget = { id: string; streamId: string; budgetMs: number };
type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  realtime: { overall: number };
  offlineBatch: { overall: number };
};

export default function ComparePage() {
  const [compares, setCompares] = useState<Compare[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [streamId, setStreamId] = useState("");
  const [segmentId, setSegmentId] = useState("");
  const [budgetId, setBudgetId] = useState("");
  const [name, setName] = useState("Real-time vs offline-batch");
  const [error, setError] = useState("");

  async function load() {
    const [c, s, seg, b] = await Promise.all([
      api<{ items: Compare[] }>("/api/compare"),
      api<{ items: Stream[] }>("/api/streams"),
      api<{ items: Segment[] }>("/api/sentences"),
      api<{ items: Budget[] }>("/api/latency"),
    ]);
    setCompares(c.items);
    setStreams(s.items);
    setSegments(seg.items);
    setBudgets(b.items);
    if (!streamId && s.items[0]) setStreamId(s.items[0].id);
    if (!segmentId && seg.items[0]) setSegmentId(seg.items[0].id);
    if (!budgetId && b.items[0]) setBudgetId(b.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  const filteredSegments = segments.filter(
    (s) => !streamId || s.streamId === streamId,
  );
  const filteredBudgets = budgets.filter(
    (b) => !streamId || b.streamId === streamId,
  );

  async function create() {
    setError("");
    if (!streamId || !segmentId || !budgetId) {
      setError("Need stream + segment + budget");
      return;
    }
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name, streamId, segmentId, budgetId }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Compare"
      subtitle="Real-time sentence stream (A) vs offline-batch baseline (B)."
    >
      <div className="mb-6 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Stream</Label>
          <Select
            value={streamId}
            onValueChange={(v) => {
              setStreamId(v);
              const nextSeg = segments.find((s) => s.streamId === v);
              const nextBud = budgets.find((b) => b.streamId === v);
              if (nextSeg) setSegmentId(nextSeg.id);
              if (nextBud) setBudgetId(nextBud.id);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Stream" />
            </SelectTrigger>
            <SelectContent>
              {streams.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Segment</Label>
          <Select value={segmentId} onValueChange={setSegmentId}>
            <SelectTrigger>
              <SelectValue placeholder="Segment" />
            </SelectTrigger>
            <SelectContent>
              {filteredSegments.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.glossText}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Budget</Label>
          <Select value={budgetId} onValueChange={setBudgetId}>
            <SelectTrigger>
              <SelectValue placeholder="Budget" />
            </SelectTrigger>
            <SelectContent>
              {filteredBudgets.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.budgetMs} ms
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button onClick={create}>Run compare</Button>
        </div>
      </div>
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
      {compares.length === 0 ? (
        <p className="text-sm text-slate-500">
          No compares yet — need stream, segment, and latency budget.
        </p>
      ) : (
        <div className="space-y-4">
          {compares.map((c) => (
            <div
              key={c.id}
              className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-[family-name:var(--font-display)] text-xl">
                  {c.name}
                </h2>
                <span className="text-sm text-[var(--studio-aqua-deep)]">
                  Winner: {c.winner} (gap {c.gap})
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <p className="mb-1 text-xs text-slate-500">
                    A real-time stream {c.realtime.overall}
                  </p>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div
                      className="score-bar h-full rounded-full bg-[var(--studio-aqua)]"
                      style={{
                        width: `${Math.min(100, c.realtime.overall)}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-xs text-slate-500">
                    B offline-batch {c.offlineBatch.overall}
                  </p>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div
                      className="score-bar h-full rounded-full bg-[var(--studio-lime)]"
                      style={{
                        width: `${Math.min(100, c.offlineBatch.overall)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </StudioShell>
  );
}
