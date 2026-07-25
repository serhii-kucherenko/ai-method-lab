"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  interpretableFmProbe: { overall: number };
  opaquePathogenicity: { overall: number };
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
      title="Delta scoreboard"
      subtitle="Ranked interpretable probe soft-sim compares versus opaque pathogenicity baselines."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
          No compares yet — run A/B from Compare.
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
                winner {c.winner} · gap {c.gap} · probe{" "}
                {c.interpretableFmProbe.overall} · opaque{" "}
                {c.opaquePathogenicity.overall}
              </div>
            </li>
          ))}
        </ol>
      )}
    </StudioShell>
  );
}
