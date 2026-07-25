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
type Budget = {
  id: string;
  streamId: string;
  budgetMs: number;
  jitterMs: number;
  flushPolicy: string;
  status: string;
};

export default function LatencyPage() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [items, setItems] = useState<Budget[]>([]);
  const [streamId, setStreamId] = useState("");
  const [budgetMs, setBudgetMs] = useState("800");
  const [flushPolicy, setFlushPolicy] = useState("wait_boundary");
  const [error, setError] = useState("");

  async function load() {
    const [s, b] = await Promise.all([
      api<{ items: Stream[] }>("/api/streams"),
      api<{ items: Budget[] }>(
        `/api/latency${streamId ? `?streamId=${streamId}` : ""}`,
      ),
    ]);
    setStreams(s.items);
    setItems(b.items);
    if (!streamId && s.items[0]) setStreamId(s.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    if (!streamId) {
      setError("Pick a stream first");
      return;
    }
    try {
      await api("/api/latency", {
        method: "POST",
        body: JSON.stringify({
          streamId,
          budgetMs: Number(budgetMs) || 800,
          jitterMs: 50,
          flushPolicy,
          status: "active",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Latency"
      subtitle="Latency budget board — flush policy and jitter honesty."
    >
      <div className="mb-6 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-4">
        <div>
          <Label>Stream</Label>
          <Select value={streamId} onValueChange={setStreamId}>
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
          <Label htmlFor="budget">Budget (ms)</Label>
          <Input
            id="budget"
            value={budgetMs}
            onChange={(e) => setBudgetMs(e.target.value)}
          />
        </div>
        <div>
          <Label>Flush policy</Label>
          <Select value={flushPolicy} onValueChange={setFlushPolicy}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="early_flush">early_flush</SelectItem>
              <SelectItem value="wait_boundary">wait_boundary</SelectItem>
              <SelectItem value="batch_only">batch_only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button onClick={create}>Add budget</Button>
        </div>
      </div>
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          No budgets yet — create a stream first, then set a latency budget.
        </p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--studio-line)] text-slate-500">
              <th className="py-2">Budget</th>
              <th>Jitter</th>
              <th>Policy</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((b) => (
              <tr key={b.id} className="border-b border-[var(--studio-line)]">
                <td className="py-2 font-medium">{b.budgetMs} ms</td>
                <td>{b.jitterMs} ms</td>
                <td>{b.flushPolicy}</td>
                <td>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </StudioShell>
  );
}
