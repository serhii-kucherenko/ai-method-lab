"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
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
type Timeline = {
  id: string;
  matchId: string;
  horizonSec: number;
  notes: string;
  events: { atSec: number; kind: string; detail: string }[];
};

export default function TimelinesPage() {
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchId, setMatchId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [t, m] = await Promise.all([
      api<{ items: Timeline[] }>("/api/timelines"),
      api<{ items: Match[] }>("/api/matches"),
    ]);
    setTimelines(t.items);
    setMatches(m.items);
    if (!matchId && m.items[0]) setMatchId(m.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    if (!matchId) {
      setError("Select a match");
      return;
    }
    try {
      await api("/api/timelines", {
        method: "POST",
        body: JSON.stringify({
          matchId,
          horizonSec: 90,
          notes: "Hold/release workspace",
          events: [
            { atSec: 0, kind: "candidate", detail: "Observed" },
            { atSec: 4, kind: "hold_start", detail: "Hold started" },
            { atSec: 20, kind: "hold_release", detail: "Released" },
            { atSec: 28, kind: "accept", detail: "Accepted" },
          ],
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Timelines"
      subtitle="Match hold/release event workspace."
    >
      <div className="mb-6 flex flex-wrap items-end gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <div className="min-w-[200px]">
          <Label>Match</Label>
          <Select value={matchId} onValueChange={setMatchId}>
            <SelectTrigger>
              <SelectValue placeholder="Select match" />
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
        <Button onClick={create}>Add timeline</Button>
      </div>
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
      {timelines.length === 0 ? (
        <p className="text-sm text-slate-500">
          No timelines — select a match to record hold/release events.
        </p>
      ) : (
        <div className="space-y-4">
          {timelines.map((t) => (
            <div
              key={t.id}
              className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
            >
              <p className="text-sm text-slate-500">
                Horizon {t.horizonSec}s · {t.notes || "Untitled"}
              </p>
              <ol className="mt-3 space-y-1 text-sm">
                {t.events.map((e, i) => (
                  <li key={`${t.id}-${i}`}>
                    <span className="font-medium text-[var(--studio-teal)]">
                      t+{e.atSec}s
                    </span>{" "}
                    {e.kind}: {e.detail}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </StudioShell>
  );
}
