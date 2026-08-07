"use client";

import { useCallback, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/studio-states";
import { Button } from "@/components/ui/button";
import { apiJson } from "@/lib/api";

type PathScore = {
  coveragePct?: number;
  coveredUsd?: number;
  gapUsd?: number;
  unusedCommitUsd?: number;
  onDemandSpillUsd?: number;
};

type ComparePayload = {
  softSim: boolean;
  compare: {
    id: string;
    mode: string;
    winner: string;
    delta_usd: number;
    window_start: string;
    window_end: string;
    cloud_account_id: string | null;
  };
  pathA: PathScore;
  pathB: PathScore;
  deltaUsd: number;
  winner: string;
};

function formatUsd(value: number | undefined): string {
  const n = value ?? 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function ComparePage() {
  const [cloudAccountId, setCloudAccountId] = useState("");
  const [windowStart, setWindowStart] = useState("");
  const [windowEnd, setWindowEnd] = useState("");
  const [resultId, setResultId] = useState("");
  const [result, setResult] = useState<ComparePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(false);

  const applyResult = useCallback((payload: ComparePayload) => {
    setResult(payload);
    setHighlight(false);
    requestAnimationFrame(() => setHighlight(true));
  }, []);

  async function runCompare() {
    setLoading(true);
    setError(null);
    setResult(null);
    const response = await apiJson<ComparePayload>("/api/compares", {
      method: "POST",
      body: JSON.stringify({
        mode: "commit_vs_ondemand",
        cloudAccountId,
        windowStart,
        windowEnd,
      }),
    });
    setLoading(false);
    if (!response.ok) {
      setError(response.message);
      return;
    }
    applyResult(response.data);
    setResultId(response.data.compare.id);
  }

  async function loadById() {
    if (!resultId.trim()) return;
    setLoading(true);
    setError(null);
    const response = await apiJson<ComparePayload>(
      `/api/compares/${resultId.trim()}`,
    );
    setLoading(false);
    if (!response.ok) {
      setError(response.message);
      setResult(null);
      return;
    }
    applyResult(response.data);
  }

  useEffect(() => {
    if (!highlight) return;
    const t = setTimeout(() => setHighlight(false), 1200);
    return () => clearTimeout(t);
  }, [highlight]);

  return (
    <StudioShell
      title="Compare"
      description="A (commit-matched) vs B (on-demand-blind) soft-sim dollars."
    >
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <label className="flex min-w-[12rem] flex-1 flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Account id</span>
          <input
            value={cloudAccountId}
            onChange={(e) => setCloudAccountId(e.target.value)}
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
          disabled={loading || !cloudAccountId || !windowStart || !windowEnd}
          onClick={() => void runCompare()}
        >
          Run commit_vs_ondemand
        </Button>
      </div>

      <div className="mb-8 flex flex-wrap items-end gap-3">
        <label className="flex min-w-[14rem] flex-1 flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Prior compare id</span>
          <input
            value={resultId}
            onChange={(e) => setResultId(e.target.value)}
            className="h-8 rounded-md border border-input bg-background px-2.5 text-sm font-[family-name:var(--font-mono)]"
          />
        </label>
        <Button
          type="button"
          variant="outline"
          disabled={loading || !resultId.trim()}
          onClick={() => void loadById()}
        >
          Load
        </Button>
      </div>

      {loading ? <LoadingState label="Running compare…" /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}
      {!loading && !error && !result ? (
        <EmptyState>
          Need inventory + usage
        </EmptyState>
      ) : null}
      {!loading && result ? (
        <div
          className={
            highlight
              ? "compare-result-highlight grid gap-4 border border-border p-4 sm:grid-cols-3"
              : "grid gap-4 border border-border p-4 sm:grid-cols-3"
          }
        >
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Path A · commit-matched
            </p>
            <p className="mt-2 font-[family-name:var(--font-mono)] text-xl text-foreground">
              {formatUsd(result.pathA.gapUsd)}
            </p>
            <p className="mt-1 font-[family-name:var(--font-mono)] text-xs text-muted-foreground">
              {(result.pathA.coveragePct ?? 0).toFixed(1)}% covered
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Path B · on-demand-blind
            </p>
            <p className="mt-2 font-[family-name:var(--font-mono)] text-xl text-foreground">
              {formatUsd(result.pathB.gapUsd)}
            </p>
            <p className="mt-1 font-[family-name:var(--font-mono)] text-xs text-muted-foreground">
              {(result.pathB.coveragePct ?? 0).toFixed(1)}% covered
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Delta · soft-sim
            </p>
            <p className="mt-2 font-[family-name:var(--font-mono)] text-xl text-[var(--color-accent)]">
              {formatUsd(result.deltaUsd)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Winner: {result.winner} · mode commit_vs_ondemand
            </p>
          </div>
        </div>
      ) : null}
    </StudioShell>
  );
}
