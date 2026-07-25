"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  clinicalReasoning: { overall: number };
  nonReasoningBaseline: { overall: number };
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
      subtitle="Compares ranked by clinical-reasoning overall."
    >
      {error ? <p className="mb-4 text-sm text-[var(--hr-wine)]">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
          No compares yet — run one from Compare.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--studio-line)] bg-[var(--studio-mist)]">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">A</th>
                <th className="px-4 py-3">B</th>
                <th className="px-4 py-3">Winner</th>
                <th className="px-4 py-3">Gap</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-[var(--studio-line)] last:border-0"
                >
                  <td className="px-4 py-3">{r.name}</td>
                  <td className="px-4 py-3">{r.clinicalReasoning.overall}</td>
                  <td className="px-4 py-3">{r.nonReasoningBaseline.overall}</td>
                  <td className="px-4 py-3">{r.winner}</td>
                  <td className="px-4 py-3">{r.gap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </StudioShell>
  );
}
