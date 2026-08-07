"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/studio-states";
import { Button } from "@/components/ui/button";
import { apiJson } from "@/lib/api";

type RecommendedAction = "buy" | "reduce" | "hold";

type RenewalCase = {
  id: string;
  commitmentId: string;
  commitmentName: string;
  cloudAccountId: string;
  provider: string;
  renewBy: string;
  gapUsd: number;
  recommendedAction: RecommendedAction;
  status: "open" | "acted" | "dismissed";
};

type RenewalsResponse = { softSim: boolean; cases: RenewalCase[] };

const ACTION_LABEL: Record<RecommendedAction, string> = {
  buy: "Buy",
  reduce: "Reduce",
  hold: "Hold",
};

function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function RenewalsPage() {
  const [account, setAccount] = useState("");
  const [cases, setCases] = useState<RenewalCase[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [packing, setPacking] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await apiJson<RenewalsResponse>("/api/renewals", {
      searchParams: {
        cloudAccountId: account || undefined,
      },
    });
    if (!result.ok) {
      setCases(null);
      setError(result.message);
      setLoading(false);
      return;
    }
    setCases(result.data.cases);
    setLoading(false);
  }, [account]);

  useEffect(() => {
    void load();
  }, [load]);

  const ordered = useMemo(() => {
    if (!cases) return [];
    return [...cases].sort((a, b) => a.renewBy.localeCompare(b.renewBy));
  }, [cases]);

  const buildPack = async () => {
    setPacking(true);
    setError(null);
    const result = await apiJson<RenewalsResponse>("/api/renewals", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        cloudAccountId: account || undefined,
      }),
    });
    setPacking(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setCases(result.data.cases);
  };

  const exportPack = () => {
    const payload = {
      softSim: true,
      exportedAt: new Date().toISOString(),
      cases: ordered,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "renewal-pack.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <StudioShell title="Renewals">
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <label className="flex min-w-[12rem] flex-1 flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Account id</span>
          <input
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="Filter account"
            className="h-8 rounded-md border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>
        <Button type="button" onClick={() => void buildPack()} disabled={packing}>
          {packing ? "Building…" : "Build pack"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={exportPack}
          disabled={!ordered.length}
        >
          Export
        </Button>
        <Button asChild variant="outline">
          <Link href="/gaps">Open gaps</Link>
        </Button>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        RenewalCase packs tie renew-by (lock_end) to linked gap $ with buy /
        reduce / hold recommendations.
      </p>

      {loading ? <LoadingState label="Loading renew-by dates…" /> : null}
      {!loading && error ? (
        <ErrorState message={error} onRetry={() => void load()} />
      ) : null}
      {!loading && !error && ordered.length === 0 ? (
        <EmptyState>No renew-by dates</EmptyState>
      ) : null}
      {!loading && !error && ordered.length > 0 ? (
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Renew-by (lock_end)</th>
                <th className="px-3 py-2 font-medium">Commitment</th>
                <th className="px-3 py-2 font-medium">Recommendation</th>
                <th className="px-3 py-2 font-medium">Gap $</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Provider</th>
              </tr>
            </thead>
            <tbody>
              {ordered.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border/70 last:border-0"
                >
                  <td className="px-3 py-2 font-[family-name:var(--font-mono)] text-xs">
                    {row.renewBy.slice(0, 10)}
                  </td>
                  <td className="px-3 py-2">{row.commitmentName}</td>
                  <td className="px-3 py-2">
                    <span data-recommended-action={row.recommendedAction}>
                      {ACTION_LABEL[row.recommendedAction]}
                    </span>
                    <span className="sr-only">{row.recommendedAction}</span>
                  </td>
                  <td className="px-3 py-2 font-[family-name:var(--font-mono)] text-xs">
                    {formatUsd(row.gapUsd)}
                  </td>
                  <td className="px-3 py-2 capitalize">{row.status}</td>
                  <td className="px-3 py-2 font-[family-name:var(--font-mono)] text-xs uppercase">
                    {row.provider}
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
