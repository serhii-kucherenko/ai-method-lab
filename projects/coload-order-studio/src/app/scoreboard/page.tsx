"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  ordered: { overall: number };
  simultaneous: { overall: number };
};

export function ScoreboardPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        setItems((await api<{ items: Row[] }>("/api/scoreboard")).items);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load");
      }
    })();
  }, []);

  return (
    <StudioShell
      title="Scoreboard"
      subtitle="Ordered co-load soft-sim leaderboard — method-lab only."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--co-line)]">
            <th className="py-2 pr-3">Compare</th>
            <th className="py-2 pr-3">Ordered</th>
            <th className="py-2 pr-3">Simultaneous</th>
            <th className="py-2 pr-3">Winner</th>
            <th className="py-2">Gap</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.id} className="border-b border-[var(--co-line)]/60">
              <td className="py-2 pr-3">{r.name}</td>
              <td className="py-2 pr-3">{r.ordered.overall}</td>
              <td className="py-2 pr-3">{r.simultaneous.overall}</td>
              <td className="py-2 pr-3">{r.winner}</td>
              <td className="py-2">{r.gap}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
          No compares yet — run one from /compare.
        </p>
      ) : null}
    </StudioShell>
  );
}

export default ScoreboardPage;
