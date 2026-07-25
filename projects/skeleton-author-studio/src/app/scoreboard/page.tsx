"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  scaffoldedAuthoring: { overall: number };
  naiveLinear: { overall: number };
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
      subtitle="Ranked soft-sim deltas for scaffolded authoring versus naive linear."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
          No compares yet — run one from Compare.
        </p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--studio-line)]">
              <th className="py-2 pr-3">Name</th>
              <th className="py-2 pr-3">Scaffolded</th>
              <th className="py-2 pr-3">Naive</th>
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
                <td className="py-2 pr-3">{r.name}</td>
                <td className="py-2 pr-3">{r.scaffoldedAuthoring.overall}</td>
                <td className="py-2 pr-3">{r.naiveLinear.overall}</td>
                <td className="py-2 pr-3">{r.winner}</td>
                <td className="py-2">{r.gap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </StudioShell>
  );
}
