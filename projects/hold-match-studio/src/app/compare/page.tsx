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

type Match = { id: string; orderLabel: string };
type Hold = { id: string; matchId: string; tier: string };
type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  experienceAware: { overall: number };
  firstFeasible: { overall: number };
};

export default function ComparePage() {
  const [compares, setCompares] = useState<Compare[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [holds, setHolds] = useState<Hold[]>([]);
  const [matchId, setMatchId] = useState("");
  const [holdId, setHoldId] = useState("");
  const [name, setName] = useState("Experience vs first-feasible");
  const [error, setError] = useState("");

  async function load() {
    const [c, m, h] = await Promise.all([
      api<{ items: Compare[] }>("/api/compare"),
      api<{ items: Match[] }>("/api/matches"),
      api<{ items: Hold[] }>("/api/holds"),
    ]);
    setCompares(c.items);
    setMatches(m.items);
    setHolds(h.items);
    if (!matchId && m.items[0]) setMatchId(m.items[0].id);
    if (!holdId && h.items[0]) setHoldId(h.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  const filteredHolds = holds.filter((h) => !matchId || h.matchId === matchId);

  async function create() {
    setError("");
    if (!matchId || !holdId) {
      setError("Need match + hold");
      return;
    }
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name, matchId, holdId }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Compare"
      subtitle="Experience-aware hold (A) vs first-feasible baseline (B)."
    >
      <div className="mb-6 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Match</Label>
          <Select
            value={matchId}
            onValueChange={(v) => {
              setMatchId(v);
              const next = holds.find((h) => h.matchId === v);
              if (next) setHoldId(next.id);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Match" />
            </SelectTrigger>
            <SelectContent>
              {matches.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.orderLabel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Hold</Label>
          <Select value={holdId} onValueChange={setHoldId}>
            <SelectTrigger>
              <SelectValue placeholder="Hold" />
            </SelectTrigger>
            <SelectContent>
              {filteredHolds.map((h) => (
                <SelectItem key={h.id} value={h.id}>
                  {h.tier}
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
          No compares yet — need a hold and scores.
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
                <span className="text-sm text-[var(--studio-amber-deep)]">
                  Winner: {c.winner} (gap {c.gap})
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <p className="mb-1 text-xs text-slate-500">
                    A experience-aware {c.experienceAware.overall}
                  </p>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div
                      className="score-bar h-full rounded-full bg-[var(--studio-amber)]"
                      style={{
                        width: `${Math.min(100, c.experienceAware.overall)}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-xs text-slate-500">
                    B first-feasible {c.firstFeasible.overall}
                  </p>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div
                      className="score-bar h-full rounded-full bg-[var(--studio-teal)]"
                      style={{
                        width: `${Math.min(100, c.firstFeasible.overall)}%`,
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
