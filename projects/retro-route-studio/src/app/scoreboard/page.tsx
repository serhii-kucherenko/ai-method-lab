"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  structured: { overall: number };
  naive: { overall: number };
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
      title="Scoreboard"
      subtitle="Ranked structured-memory compares — soft-sim planning only."
    >
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          No compares yet — run one on Compare.
        </p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--studio-line)] text-slate-500">
              <th className="py-2">Name</th>
              <th>A structured</th>
              <th>B naive</th>
              <th>Winner</th>
              <th>Gap</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr
                key={c.id}
                className="row-lift border-b border-[var(--studio-line)]"
              >
                <td className="py-2 font-medium">{c.name}</td>
                <td>{c.structured.overall}</td>
                <td>{c.naive.overall}</td>
                <td>{c.winner}</td>
                <td>{c.gap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {error ? (
        <p className="mt-4 text-sm text-[var(--studio-amber)]">{error}</p>
      ) : null}
    </StudioShell>
  );
}
