"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  onlineSlam: { overall: number };
  offlineKinematics: { overall: number };
};

export function ScoreboardPage() {
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
      subtitle="Ranked compares by online deformable SLAM overall — soft-sim deltas only."
    >
      {error ? <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
          No compares yet — run one from /compare.
        </p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--studio-line)]">
              <th className="py-2 pr-2">Name</th>
              <th className="py-2 pr-2">Winner</th>
              <th className="py-2 pr-2">Gap</th>
              <th className="py-2 pr-2">Online SLAM</th>
              <th className="py-2">Offline kinematics</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="row-lift border-b border-[var(--studio-line)]/60">
                <td className="py-2 pr-2 font-medium">{c.name}</td>
                <td className="py-2 pr-2">{c.winner}</td>
                <td className="py-2 pr-2">{c.gap}</td>
                <td className="py-2 pr-2">{c.onlineSlam.overall}</td>
                <td className="py-2">{c.offlineKinematics.overall}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </StudioShell>
  );
}

export default ScoreboardPage;
