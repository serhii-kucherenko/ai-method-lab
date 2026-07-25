"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  styleAware: { overall: number };
  idealizedPatient: { overall: number };
  createdAt: string;
};

export default function ScoreboardPage() {
  const [items, setItems] = useState<Compare[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ items: Compare[] }>("/api/scoreboard")
      .then((d) => setItems(d.items))
      .catch((e) => setError(String(e)));
  }, []);

  return (
    <StudioShell
      title="Disparity scoreboard"
      subtitle="Outcome-shift winners sorted by style-aware overall."
    >
      {error ? <p className="mb-4 text-sm text-[var(--studio-coral)]">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-slate-500">No compares yet — run A/B on /compare.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--studio-line)] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Winner</th>
                <th className="px-4 py-3 font-medium">Gap</th>
                <th className="px-4 py-3 font-medium">Style-aware</th>
                <th className="px-4 py-3 font-medium">Idealized</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr
                  key={c.id}
                  className="row-lift border-b border-[var(--studio-line)] last:border-0"
                >
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.winner}</td>
                  <td className="px-4 py-3">{c.gap}</td>
                  <td className="px-4 py-3 text-[var(--studio-mint)]">
                    {c.styleAware.overall.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-[var(--studio-coral)]">
                    {c.idealizedPatient.overall.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </StudioShell>
  );
}
