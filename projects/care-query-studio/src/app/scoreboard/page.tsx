"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  llm: { overall: number };
  clinician: { overall: number };
};

export function ScoreboardPage() {
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
      subtitle="Ranked soft-sim compares — multilingual POC LLM vs local clinician baseline."
    >
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
          No compares yet. Run an A/B compare first.
        </p>
      ) : (
        <ol className="space-y-2">
          {items.map((c, i) => (
            <li
              key={c.id}
              className="row-lift flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div>
                <p className="font-medium">
                  #{i + 1} {c.name}
                </p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                  {c.winner} · gap {c.gap}
                </p>
              </div>
              <div className="text-right text-sm">
                <p>LLM {c.llm.overall}</p>
                <p>Clinician {c.clinician.overall}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </StudioShell>
  );
}

export default ScoreboardPage;
