"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  therapist: { overall: number };
  waitlist: { overall: number };
};

export function ScoreboardPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        setItems((await api<{ items: Row[] }>("/api/scoreboard")).items);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load");
      }
    })();
  }, []);

  return (
    <StudioShell
      title="Scoreboard"
      subtitle="Ranked soft-sim compares by therapist-supported iCBT overall score."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <table className="w-full overflow-hidden rounded-lg border bg-white text-left text-sm">
        <thead className="bg-[var(--studio-gauze-soft)]">
          <tr>
            <th className="px-4 py-3">Compare</th>
            <th className="px-4 py-3">Therapist</th>
            <th className="px-4 py-3">Waitlist</th>
            <th className="px-4 py-3">Winner</th>
            <th className="px-4 py-3">Gap</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr key={row.id} className="border-t">
              <td className="px-4 py-3">{row.name}</td>
              <td className="px-4 py-3">{row.therapist.overall}</td>
              <td className="px-4 py-3">{row.waitlist.overall}</td>
              <td className="px-4 py-3">{row.winner}</td>
              <td className="px-4 py-3">{row.gap}</td>
            </tr>
          ))}
          {items.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]" colSpan={5}>
                No compares yet — run one from Compare.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </StudioShell>
  );
}

export default ScoreboardPage;
