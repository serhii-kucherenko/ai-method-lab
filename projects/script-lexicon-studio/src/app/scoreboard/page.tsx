"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  expandedGeezLexicon: { overall: number };
  baselineMultilingual: { overall: number };
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
      subtitle="Ranked expanded-lexicon scores with baseline multilingual gaps."
    >
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-stone-500">
          No scored compares yet — run one from Compare.
        </p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--studio-line)] text-stone-500">
              <th className="py-2 pr-3">Name</th>
              <th className="py-2 pr-3">Expanded</th>
              <th className="py-2 pr-3">Baseline</th>
              <th className="py-2 pr-3">Winner</th>
              <th className="py-2">Gap</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr
                key={r.id}
                className="row-lift border-b border-[var(--studio-line)]"
              >
                <td className="py-3 pr-3 font-medium">{r.name}</td>
                <td className="py-3 pr-3">{r.expandedGeezLexicon.overall}</td>
                <td className="py-3 pr-3">{r.baselineMultilingual.overall}</td>
                <td className="py-3 pr-3">{r.winner}</td>
                <td className="py-3">{r.gap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </StudioShell>
  );
}
