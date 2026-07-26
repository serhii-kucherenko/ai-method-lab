"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  antibiotic: { overall: number };
  untreated: { overall: number };
};

export function ScoreboardPage() {
  const [items, setItems] = useState<Compare[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        setItems((await api<{ items: Compare[] }>("/api/scoreboard")).items);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load");
      }
    })();
  }, []);

  return (
    <StudioShell
      title="Scoreboard"
      subtitle="Rank soft-sim compares by antibiotic-treated Shigella overall — lock only when it beats untreated diarrhea growth."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.length === 0 ? (
          <li className="rounded-lg border bg-white px-4 py-3 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
            No compares yet — run an A/B compare first.
          </li>
        ) : null}
        {items.map((c, i) => (
          <li key={c.id} className="row-lift rounded-lg border bg-white px-4 py-3">
            <p className="font-medium">
              #{i + 1} {c.name}
            </p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              Winner {c.winner} · gap {c.gap} · antibiotic {c.antibiotic.overall} vs untreated {c.untreated.overall}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default ScoreboardPage;
