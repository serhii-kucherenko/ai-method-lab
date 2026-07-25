"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  unifiedInverse: { overall: number };
  naiveGenerative: { overall: number };
};

export default function ScoreboardPage() {
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
      subtitle="Ranked by unified inverse overall — soft-sim deltas only."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
          No compares yet — run an A/B compare first.
        </p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--studio-line)]">
              <th className="py-2">Name</th>
              <th>A inverse</th>
              <th>B generative</th>
              <th>Winner</th>
              <th>Gap</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr
                key={r.id}
                className="border-b border-[var(--studio-line)]/60"
              >
                <td className="py-2 font-medium">{r.name}</td>
                <td>{r.unifiedInverse.overall.toFixed(1)}</td>
                <td>{r.naiveGenerative.overall.toFixed(1)}</td>
                <td>{r.winner}</td>
                <td>{r.gap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </StudioShell>
  );
}
