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
type RenewalStatus = "open" | "acted" | "dismissed";

type RenewalCase = {
  id: string;
  commitmentId: string;
  commitmentName: string;
  cloudAccountId: string;
  provider: string;
  renewBy: string;
  gapUsd: number;
  recommendedAction: RecommendedAction;
  status: RenewalStatus;
};

type RenewalsResponse = { softSim: boolean; cases: RenewalCase[] };

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function actionLabel(action: RecommendedAction): string {
  switch (action) {
    case "buy":
      return "buy";
    case "reduce":
      return "reduce";
    case "hold":
      return "hold";
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}

export default function RenewalsPage() {
  const [account, setAccount] = useState("");
  const [cases, setCases] = useState<RenewalCase[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

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

  async function buildPack() {
    setBusy(true);
    setError(null);
    const result = await apiJson<RenewalsResponse>("/api/renewals", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        cloudAccountId: account.trim() || undefined,
      }),
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setCases(result.data.cases);
  }

  function exportPack() {
    if (!cases || cases.length === 0) return;
    void (async () => {
      setError(null);
      const res = await apiJson<{ softSim: boolean; kind: string; rows: unknown[] }>(
        "/api/export",
        {
          searchParams: { kind: "renewals", format: "json" },
        },
      );
      if (!res.ok) {
        setError(res.message);
        return;
      }
      const blob = new Blob([JSON.stringify(res.data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "renewal-pack.json";
      a.click();
      URL.revokeObjectURL(url);
    })();
  }

  async function setCaseStatus(id: string, status: "acted" | "dismissed") {
    setError(null);
    const result = await apiJson<{ softSim: boolean; case: RenewalCase }>(
      `/api/renewals/${id}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
      },
    );
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setCases((prev) =>
      prev
        ? prev.map((c) => (c.id === id ? { ...c, ...result.data.case } : c))
        : prev,
    );
  }

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
        <Button type="button" onClick={() => void buildPack()} disabled={busy}>
          {busy ? "Building…" : "Build pack"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={exportPack}
          disabled={!cases || cases.length === 0}
        >
          Export
        </Button>
        <Button asChild variant="outline">
          <Link href="/gaps">Open gaps</Link>
        </Button>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        RenewalCase packs tie renew-by dates to gap $ with recommendedAction
        buy, reduce, or hold.
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
          <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Renew-by</th>
                <th className="px-3 py-2 font-medium">Commitment</th>
                <th className="px-3 py-2 font-medium">recommendedAction</th>
                <th className="px-3 py-2 font-medium">gapUsd</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Provider</th>
                <th className="px-3 py-2 font-medium">Actions</th>
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
                  <td className="px-3 py-2 font-[family-name:var(--font-mono)] text-xs uppercase">
                    {actionLabel(row.recommendedAction)}
                  </td>
                  <td className="px-3 py-2 font-[family-name:var(--font-mono)] text-xs">
                    {formatUsd(row.gapUsd)}
                  </td>
                  <td className="px-3 py-2 text-xs">{row.status}</td>
                  <td className="px-3 py-2 font-[family-name:var(--font-mono)] text-xs uppercase">
                    {row.provider}
                  </td>
                  <td className="px-3 py-2">
                    {row.status === "open" ? (
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => void setCaseStatus(row.id, "acted")}
                        >
                          Act
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            void setCaseStatus(row.id, "dismissed")
                          }
                        >
                          Dismiss
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
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
