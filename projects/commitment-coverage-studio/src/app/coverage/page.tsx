"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CoverageBar } from "@/components/coverage-bar";
import { StudioShell } from "@/components/studio-shell";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/studio-states";
import { Button } from "@/components/ui/button";
import { apiJson } from "@/lib/api";

type Snapshot = {
  id: string;
  cloud_account_id: string;
  window_start: string;
  window_end: string;
  coverage_pct: number;
  covered_usd: number;
  unused_commit_usd: number;
  ondemand_spill_usd: number;
  gap_usd: number;
  computed_at: string;
};

type CoverageListResponse = { softSim: boolean; snapshots: Snapshot[] };

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CoveragePage() {
  const [accountFilter, setAccountFilter] = useState("");
  const [windowFilter, setWindowFilter] = useState("");
  const [snapshots, setSnapshots] = useState<Snapshot[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [computeAccount, setComputeAccount] = useState("");
  const [windowStart, setWindowStart] = useState("");
  const [windowEnd, setWindowEnd] = useState("");
  const [computeMsg, setComputeMsg] = useState<string | null>(null);
  const [computing, setComputing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await apiJson<CoverageListResponse>("/api/coverage");
    if (!result.ok) {
      setSnapshots(null);
      setError(result.message);
      setLoading(false);
      return;
    }
    setSnapshots(result.data.snapshots);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!snapshots) return [];
    return snapshots.filter((s) => {
      if (
        accountFilter &&
        !s.cloud_account_id.toLowerCase().includes(accountFilter.toLowerCase())
      ) {
        return false;
      }
      if (windowFilter) {
        const win = `${s.window_start} ${s.window_end}`.toLowerCase();
        if (!win.includes(windowFilter.toLowerCase())) return false;
      }
      return true;
    });
  }, [snapshots, accountFilter, windowFilter]);

  async function runCompute() {
    setComputing(true);
    setComputeMsg(null);
    const result = await apiJson<{ softSim: boolean; snapshot: Snapshot }>(
      "/api/coverage",
      {
        method: "POST",
        body: JSON.stringify({
          cloudAccountId: computeAccount,
          windowStart,
          windowEnd,
        }),
      },
    );
    setComputing(false);
    if (!result.ok) {
      setComputeMsg(result.message);
      return;
    }
    setComputeMsg("Coverage snapshot computed (soft-sim).");
    await load();
  }

  return (
    <StudioShell
      title="Coverage"
      description="Commit-matched coverage % and dollars for the soft-sim window."
    >
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <label className="flex min-w-[10rem] flex-1 flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Account</span>
          <input
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
            placeholder="Account id…"
            className="h-8 rounded-md border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>
        <label className="flex min-w-[10rem] flex-1 flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Window</span>
          <input
            value={windowFilter}
            onChange={(e) => setWindowFilter(e.target.value)}
            placeholder="2026-01…"
            className="h-8 rounded-md border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>
        <Button asChild variant="outline">
          <Link href="/gaps">Open gaps</Link>
        </Button>
      </div>

      <div className="mb-8 border border-border px-4 py-4">
        <p className="text-sm font-medium text-foreground">Compute coverage</p>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="flex min-w-[10rem] flex-1 flex-col gap-1 text-sm">
            <span className="text-muted-foreground">Account id</span>
            <input
              value={computeAccount}
              onChange={(e) => setComputeAccount(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2.5 text-sm"
            />
          </label>
          <label className="flex w-40 flex-col gap-1 text-sm">
            <span className="text-muted-foreground">Start</span>
            <input
              type="date"
              value={windowStart}
              onChange={(e) => setWindowStart(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2 text-sm"
            />
          </label>
          <label className="flex w-40 flex-col gap-1 text-sm">
            <span className="text-muted-foreground">End</span>
            <input
              type="date"
              value={windowEnd}
              onChange={(e) => setWindowEnd(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2 text-sm"
            />
          </label>
          <Button
            type="button"
            disabled={
              computing || !computeAccount || !windowStart || !windowEnd
            }
            onClick={() => void runCompute()}
          >
            {computing ? "Computing…" : "Run"}
          </Button>
        </div>
        {computeMsg ? (
          <p className="mt-3 text-sm text-muted-foreground">{computeMsg}</p>
        ) : null}
      </div>

      {loading ? <LoadingState label="Loading coverage…" /> : null}
      {!loading && error ? (
        <ErrorState message={error} onRetry={() => void load()} />
      ) : null}
      {!loading && !error && filtered.length === 0 ? (
        <EmptyState
          action={
            <Button asChild>
              <Link href="/imports">Import usage</Link>
            </Button>
          }
        >
          Need usage import
        </EmptyState>
      ) : null}
      {!loading && !error && filtered.length > 0 ? (
        <ul className="space-y-6 border-t border-border pt-6">
          {filtered.map((s) => (
            <li key={s.id} className="space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-[family-name:var(--font-mono)] text-xs text-muted-foreground">
                  {s.cloud_account_id.slice(0, 8)}… · {s.window_start} →{" "}
                  {s.window_end}
                </p>
                <p className="font-[family-name:var(--font-mono)] text-lg font-medium text-foreground">
                  {s.coverage_pct.toFixed(1)}% · {formatUsd(s.covered_usd)} covered
                </p>
              </div>
              <CoverageBar coveragePct={s.coverage_pct} />
              <p className="font-[family-name:var(--font-mono)] text-xs text-muted-foreground">
                Gap {formatUsd(s.gap_usd)} · unused {formatUsd(s.unused_commit_usd)} ·
                spill {formatUsd(s.ondemand_spill_usd)}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </StudioShell>
  );
}
