"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  humanAi: { overall: number };
  aiOnly: { overall: number };
};

export function ScoreboardPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ items: Row[] }>("/api/scoreboard")
      .then((d) => setItems(d.items))
      .catch((e) => setError(String(e)));
  }, []);

  return (
    <StudioShell
      title="Scoreboard"
      subtitle="Ranked dual compares — human–AI co-learning overall descending."
    >
      {error ? (
        <p className="text-sm text-[var(--sc-amber)]">{error}</p>
      ) : null}
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--studio-line)]">
            <th className="py-2">Name</th>
            <th>Winner</th>
            <th>Gap</th>
            <th>Human–AI</th>
            <th>AI-only</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.id} className="border-b border-[var(--studio-line)]/60">
              <td className="py-2">{r.name}</td>
              <td>{r.winner}</td>
              <td>{r.gap}</td>
              <td>{r.humanAi.overall}</td>
              <td>{r.aiOnly.overall}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
          No compares yet — run one on /compare.
        </p>
      ) : null}
    </StudioShell>
  );
}

export default ScoreboardPage;
