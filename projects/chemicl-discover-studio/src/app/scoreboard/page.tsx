"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  multimodalChemicl: { overall: number };
  textOnlyBaseline: { overall: number };
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
      subtitle="Multimodal ChemICL overall ranked against text-only ICL baselines."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
          No compares yet — run an A/B compare to populate the board.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((c, i) => (
            <li
              key={c.id}
              className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">
                  #{i + 1} {c.name}
                </span>
                <span className="text-sm text-[var(--cd-teal)]">
                  A {c.multimodalChemicl.overall}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
                <div
                  className="score-bar h-full bg-[var(--cd-teal)]"
                  style={{
                    width: `${Math.min(100, c.multimodalChemicl.overall)}%`,
                  }}
                />
              </div>
              <p className="mt-1 text-sm">
                B {c.textOnlyBaseline.overall} · winner {c.winner} · gap{" "}
                {c.gap}
              </p>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
