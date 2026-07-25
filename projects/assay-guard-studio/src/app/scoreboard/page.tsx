"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  assayAware: { overall: number };
  naiveProtocolRunner: { overall: number };
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
      subtitle="Ranked assay-aware deltas from dual compares."
    >
      {error ? (
        <p className="mb-4 text-sm text-[var(--ag-amber)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
          No compares yet — run one from Compare.
        </p>
      ) : (
        <ol className="space-y-2">
          {items.map((c, i) => (
            <li
              key={c.id}
              className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium">
                #{i + 1} {c.name}
              </div>
              <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                A {c.assayAware.overall} vs B {c.naiveProtocolRunner.overall} ·{" "}
                {c.winner} · gap {c.gap}
              </div>
            </li>
          ))}
        </ol>
      )}
    </StudioShell>
  );
}
