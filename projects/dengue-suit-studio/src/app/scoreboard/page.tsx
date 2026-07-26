"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  cmip6: { overall: number };
  historical: { overall: number };
};

export function ScoreboardPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [exportMsg, setExportMsg] = useState("");

  const load = async () => {
    try {
      setItems((await api<{ items: Row[] }>("/api/scoreboard")).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const exportCsv = async () => {
    try {
      const csv = await api<string>("/api/export?format=csv");
      setExportMsg(`Exported ${csv.split("\n").length - 1} compare rows`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed");
    }
  };

  return (
    <StudioShell
      title="Scoreboard"
      subtitle="Rank soft-sim compares by CMIP6 thermal-suitability overall — method-lab only."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="mb-4 flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => void load()}>
          Refresh
        </Button>
        <Button type="button" variant="outline" onClick={() => void exportCsv()}>
          Export CSV
        </Button>
        {exportMsg ? <p className="text-sm text-[var(--ds-teal)]">{exportMsg}</p> : null}
      </div>
      <ol className="space-y-2">
        {items.map((row, i) => (
          <li key={row.id} className="row-lift flex items-center justify-between rounded-lg border bg-white px-4 py-3">
            <div>
              <p className="font-medium">
                #{i + 1} {row.name}
              </p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                winner {row.winner} · gap {row.gap}
              </p>
            </div>
            <p className="text-sm">
              CMIP6 {row.cmip6.overall} · hist {row.historical.overall}
            </p>
          </li>
        ))}
        {items.length === 0 ? (
          <li className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
            No compares yet — run one from Compare.
          </li>
        ) : null}
      </ol>
    </StudioShell>
  );
}

export default ScoreboardPage;
