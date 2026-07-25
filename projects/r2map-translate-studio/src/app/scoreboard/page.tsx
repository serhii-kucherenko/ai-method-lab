"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  ganTranslation: { overall: number };
  conventionalBaseline: { overall: number };
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
      subtitle="Ranked GAN R2map translation deltas vs conventional R2 baselines."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
          No compares yet — run one on /compare.
        </p>
      ) : (
        <ol className="space-y-3">
          {items.map((r, i) => (
            <li
              key={r.id}
              className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium">
                #{i + 1} {r.name}
              </div>
              <p className="mt-1 text-sm">
                A {r.ganTranslation.overall} · B {r.conventionalBaseline.overall}{" "}
                · winner {r.winner} · gap {r.gap}
              </p>
            </li>
          ))}
        </ol>
      )}
    </StudioShell>
  );
}
