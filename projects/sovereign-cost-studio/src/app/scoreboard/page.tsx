"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  sovereignWee: { overall: number };
  naiveCloud: { overall: number };
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
      subtitle="Compares ranked by sovereign-infra W/E/E overall score."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
          No compares yet — run one on /compare.
        </p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--studio-line)]">
              <th className="py-2">Name</th>
              <th>Sovereign A</th>
              <th>Naive B</th>
              <th>Winner</th>
              <th>Gap</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.id} className="border-b border-[var(--studio-line)]/60">
                <td className="py-2 font-medium">{r.name}</td>
                <td>{r.sovereignWee.overall}</td>
                <td>{r.naiveCloud.overall}</td>
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
