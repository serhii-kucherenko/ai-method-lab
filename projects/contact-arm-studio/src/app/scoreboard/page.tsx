"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  contactCentric: { overall: number };
  visionOnly: { overall: number };
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
      title="Contact A/B scoreboard"
      subtitle="Ranked contact-centric tactile+vision vs vision-only gaps."
    >
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-slate-500">
          No compares yet — run a contact A/B compare first.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--studio-line)] text-slate-500">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Compare</th>
                <th className="px-4 py-3">Contact-centric</th>
                <th className="px-4 py-3">Vision-only</th>
                <th className="px-4 py-3">Gap</th>
                <th className="px-4 py-3">Winner</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c, i) => (
                <tr
                  key={c.id}
                  className="row-lift border-b border-[var(--studio-line)] last:border-0"
                >
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3">{c.contactCentric.overall}</td>
                  <td className="px-4 py-3">{c.visionOnly.overall}</td>
                  <td className="px-4 py-3">{c.gap}</td>
                  <td className="px-4 py-3">{c.winner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </StudioShell>
  );
}
