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
type Lane = {
  id: string;
  matchId: string;
  side: string;
  waitScore: number;
  cancelScore: number;
  completionScore: number;
  incomeOrFareScore: number;
};

export default function LanesPage() {
  const [lanes, setLanes] = useState<Lane[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchId, setMatchId] = useState("");
  const [side, setSide] = useState("passenger");
  const [error, setError] = useState("");

  async function load() {
    const [l, m] = await Promise.all([
      api<{ items: Lane[] }>("/api/lanes"),
      api<{ items: Match[] }>("/api/matches"),
    ]);
    setLanes(l.items);
    setMatches(m.items);
    if (!matchId && m.items[0]) setMatchId(m.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    if (!matchId) {
      setError("Link a match first");
      return;
    }
    try {
      await api("/api/lanes", {
        method: "POST",
        body: JSON.stringify({
          matchId,
          side,
          waitScore: side === "passenger" ? 62 : 55,
          cancelScore: 58,
          completionScore: 70,
          incomeOrFareScore: 66,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Experience lanes"
      subtitle="Passenger and driver experience scores for each match."
    >
      <div className="mb-6 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3">
        <div>
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
        <div>
          <Label>Side</Label>
          <Select value={side} onValueChange={setSide}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="passenger">passenger</SelectItem>
              <SelectItem value="driver">driver</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button onClick={create}>Add lane</Button>
        </div>
      </div>
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
      {lanes.length === 0 ? (
        <p className="text-sm text-slate-500">
          No lanes yet — create a match, then score passenger/driver lanes.
        </p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--studio-line)] text-slate-500">
              <th className="py-2">Side</th>
              <th>Wait</th>
              <th>Cancel</th>
              <th>Completion</th>
              <th>Income/fare</th>
            </tr>
          </thead>
          <tbody>
            {lanes.map((l) => (
              <tr key={l.id} className="border-b border-[var(--studio-line)]">
                <td className="py-2 font-medium">{l.side}</td>
                <td>{l.waitScore}</td>
                <td>{l.cancelScore}</td>
                <td>{l.completionScore}</td>
                <td>{l.incomeOrFareScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </StudioShell>
  );
}
