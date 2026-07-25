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
type Hold = {
  id: string;
  matchId: string;
  tier: string;
  holdBudgetSec: number;
  passengerWaitRisk: number;
  status: string;
};

export default function HoldsPage() {
  const [holds, setHolds] = useState<Hold[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchId, setMatchId] = useState("");
  const [tier, setTier] = useState("hold_short");
  const [budget, setBudget] = useState("15");
  const [error, setError] = useState("");

  async function load() {
    const [h, m] = await Promise.all([
      api<{ items: Hold[] }>("/api/holds"),
      api<{ items: Match[] }>("/api/matches"),
    ]);
    setHolds(h.items);
    setMatches(m.items);
    if (!matchId && m.items[0]) setMatchId(m.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    if (!matchId) {
      setError("Pick a match first");
      return;
    }
    try {
      await api("/api/holds", {
        method: "POST",
        body: JSON.stringify({
          matchId,
          tier,
          holdBudgetSec: Number(budget) || 15,
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
      title="Holds"
      subtitle="Experience-aware hold decision board — tiers and budgets."
    >
      <div className="mb-6 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-4">
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
          <Label>Tier</Label>
          <Select value={tier} onValueChange={setTier}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="release_now">release_now</SelectItem>
              <SelectItem value="hold_short">hold_short</SelectItem>
              <SelectItem value="hold_long">hold_long</SelectItem>
              <SelectItem value="guardrail_block">guardrail_block</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="budget">Hold budget (sec)</Label>
          <Input
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={create}>Create hold</Button>
        </div>
      </div>
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
      {holds.length === 0 ? (
        <p className="text-sm text-slate-500">
          No holds yet — pick a match and assign a tier.
        </p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--studio-line)] text-slate-500">
              <th className="py-2">Tier</th>
              <th>Budget</th>
              <th>Passenger risk</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {holds.map((h) => (
              <tr key={h.id} className="border-b border-[var(--studio-line)]">
                <td className="py-2 font-medium">{h.tier}</td>
                <td>{h.holdBudgetSec}s</td>
                <td>{h.passengerWaitRisk}</td>
                <td>{h.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </StudioShell>
  );
}
