"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/studio-states";
import { Button } from "@/components/ui/button";
import { apiJson } from "@/lib/api";

type GapRow = {
  id: string;
  cloud_account_id: string;
  kind: "unused_commit" | "ondemand_spill" | string;
  gap_usd: number;
  window_start: string;
  window_end: string;
  created_at: string;
};

type GapsResponse = { softSim: boolean; gaps: GapRow[] };

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function GapsPage() {
  const [kind, setKind] = useState("");
  const [account, setAccount] = useState("");
  const [gaps, setGaps] = useState<GapRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await apiJson<GapsResponse>("/api/gaps", {
      searchParams: {
        cloudAccountId: account.trim() || undefined,
      },
    });
    if (!result.ok) {
      setGaps(null);
      setError(result.message);
      setLoading(false);
      return;
    }
    setGaps(result.data.gaps);
    setLoading(false);
  }, [account]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!gaps) return [];
    if (!kind) return gaps;
    return gaps.filter((g) => g.kind === kind);
  }, [gaps, kind]);

  return (
    <StudioShell
      title="Gaps"
      description="Unused commit and on-demand spill findings in dollars."
    >
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <label className="flex w-48 flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Kind</span>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className="h-8 rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">All</option>
            <option value="unused_commit">unused_commit</option>
            <option value="ondemand_spill">ondemand_spill</option>
          </select>
        </label>
        <label className="flex min-w-[12rem] flex-1 flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Account</span>
          <input
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="cloudAccountId…"
            className="h-8 rounded-md border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>
        <Button asChild variant="outline">
          <Link href="/renewals">Open renewals</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/compare">Compare A/B</Link>
        </Button>
      </div>

      {loading ? <LoadingState label="Loading gaps…" /> : null}
      {!loading && error ? (
        <ErrorState message={error} onRetry={() => void load()} />
      ) : null}
      {!loading && !error && filtered.length === 0 ? (
        <EmptyState>No gaps in window</EmptyState>
      ) : null}
      {!loading && !error && filtered.length > 0 ? (
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Kind</th>
                <th className="px-3 py-2 font-medium">Gap $</th>
                <th className="px-3 py-2 font-medium">Account</th>
                <th className="px-3 py-2 font-medium">Window</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr
                  key={g.id}
                  className="border-b border-border/70 last:border-0"
                >
                  <td className="px-3 py-2 font-[family-name:var(--font-mono)] text-xs">
                    {g.kind}
                  </td>
                  <td
                    className={
                      g.kind === "ondemand_spill"
                        ? "px-3 py-2 font-[family-name:var(--font-mono)] text-[var(--color-gap)]"
                        : "px-3 py-2 font-[family-name:var(--font-mono)] text-foreground"
                    }
                  >
                    {formatUsd(g.gap_usd)}
                  </td>
                  <td className="px-3 py-2 font-[family-name:var(--font-mono)] text-xs text-muted-foreground">
                    {g.cloud_account_id.slice(0, 12)}…
                  </td>
                  <td className="px-3 py-2 font-[family-name:var(--font-mono)] text-xs text-muted-foreground">
                    {g.window_start} → {g.window_end}
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
