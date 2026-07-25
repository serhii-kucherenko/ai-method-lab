"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  productiveOpen: { overall: number };
  engagementMax: { overall: number };
};

export function ScoreboardPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        setItems((await api<{ items: Row[] }>("/api/scoreboard")).items);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load scoreboard");
      }
    })();
  }, []);

  return (
    <StudioShell title="Scoreboard" subtitle="Ranked dual compares by productive open-minded overall.">
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ol className="space-y-3">
        {items.map((c, i) => (
          <li key={c.id} className="row-lift rounded-lg border bg-white p-4">
            <p className="text-xs uppercase text-[var(--dd-teal)]">#{i + 1}</p>
            <h2 className="font-semibold">{c.name}</h2>
            <p className="text-sm">
              {c.winner} · gap {c.gap} · A {c.productiveOpen.overall} · B {c.engagementMax.overall}
            </p>
          </li>
        ))}
      </ol>
      {items.length === 0 ? (
        <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
          No compares yet — run one on /compare.
        </p>
      ) : null}
    </StudioShell>
  );
}

export default ScoreboardPage;
