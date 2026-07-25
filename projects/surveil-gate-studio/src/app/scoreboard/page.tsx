"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  trust: { overall: number };
  explain: { overall: number };
};

export function ScoreboardPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        setItems((await api<{ items: Row[] }>("/api/scoreboard")).items);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load scoreboard");
      }
    })();
  }, []);

  return (
    <StudioShell
      title="Scoreboard"
      subtitle="Ranked soft-sim compares — six-pillar trust vs explainability-only."
    >
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-[var(--studio-gauze-soft)]">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Trust</th>
              <th className="p-3">Explain</th>
              <th className="p-3">Winner</th>
              <th className="p-3">Gap</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id} className="border-b row-lift">
                <td className="p-3">{row.name}</td>
                <td className="p-3">{row.trust.overall}</td>
                <td className="p-3">{row.explain.overall}</td>
                <td className="p-3">{row.winner}</td>
                <td className="p-3">{row.gap}</td>
              </tr>
            ))}
            {!items.length ? (
              <tr>
                <td className="p-3 text-slate-500" colSpan={5}>
                  No compares yet — run A/B from /compare.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </StudioShell>
  );
}

export default ScoreboardPage;
