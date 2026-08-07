"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/studio-states";
import { apiJson } from "@/lib/api";

type ScoreRow = {
  cloudAccountId: string;
  displayName: string;
  provider: string;
  accountKey: string;
  gapUsd: number;
  unusedCommitUsd: number;
  ondemandSpillUsd: number;
  coveragePct: number | null;
};

type ScoreboardResponse = { softSim: boolean; scoreboard: ScoreRow[] };

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ScoreboardPage() {
  const [provider, setProvider] = useState("");
  const [account, setAccount] = useState("");
  const [rows, setRows] = useState<ScoreRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await apiJson<ScoreboardResponse>("/api/scoreboard", {
      searchParams: {
        provider: provider || undefined,
        cloudAccountId: account || undefined,
      },
    });
    if (!result.ok) {
      setRows(null);
      setError(result.message);
      setLoading(false);
      return;
    }
    setRows(result.data.scoreboard);
    setLoading(false);
  }, [provider, account]);

  useEffect(() => {
    void load();
  }, [load]);

  const ranked = useMemo(() => {
    if (!rows) return [];
    return [...rows].sort((a, b) => b.gapUsd - a.gapUsd);
  }, [rows]);

  return (
    <StudioShell title="Scoreboard">
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <label className="flex w-40 flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Provider</span>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="h-8 rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">All</option>
            <option value="aws">aws</option>
            <option value="gcp">gcp</option>
            <option value="azure">azure</option>
          </select>
        </label>
        <label className="flex min-w-[12rem] flex-1 flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Account id</span>
          <input
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="Filter account"
            className="h-8 rounded-md border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>
      </div>

      {loading ? <LoadingState label="Loading scoreboard…" /> : null}
      {!loading && error ? (
        <ErrorState message={error} onRetry={() => void load()} />
      ) : null}
      {!loading && !error && ranked.length === 0 ? (
        <EmptyState>Empty org</EmptyState>
      ) : null}
      {!loading && !error && ranked.length > 0 ? (
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">#</th>
                <th className="px-3 py-2 font-medium">Account</th>
                <th className="px-3 py-2 font-medium">Provider</th>
                <th className="px-3 py-2 font-medium">Gap $</th>
                <th className="px-3 py-2 font-medium">Unused</th>
                <th className="px-3 py-2 font-medium">Spill</th>
                <th className="px-3 py-2 font-medium">Coverage %</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((row, idx) => (
                <tr
                  key={row.cloudAccountId}
                  className="border-b border-border/70 last:border-0"
                >
                  <td className="px-3 py-2 font-[family-name:var(--font-mono)] text-xs">
                    {idx + 1}
                  </td>
                  <td className="px-3 py-2">{row.displayName}</td>
                  <td className="px-3 py-2 font-[family-name:var(--font-mono)] text-xs uppercase">
                    {row.provider}
                  </td>
                  <td className="px-3 py-2 font-[family-name:var(--font-mono)]">
                    {formatUsd(row.gapUsd)}
                  </td>
                  <td className="px-3 py-2 font-[family-name:var(--font-mono)]">
                    {formatUsd(row.unusedCommitUsd)}
                  </td>
                  <td className="px-3 py-2 font-[family-name:var(--font-mono)]">
                    {formatUsd(row.ondemandSpillUsd)}
                  </td>
                  <td className="px-3 py-2 font-[family-name:var(--font-mono)]">
                    {row.coveragePct == null
                      ? "—"
                      : `${row.coveragePct.toFixed(1)}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </StudioShell>
  );
}
