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

type RenewRow = {
  commitmentId: string;
  name: string;
  cloudAccountId: string;
  lockEnd: string;
  provider: string;
};

type RenewalsResponse = { softSim: boolean; renewals: RenewRow[] };

export default function RenewalsPage() {
  const [account, setAccount] = useState("");
  const [rows, setRows] = useState<RenewRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await apiJson<RenewalsResponse>("/api/renewals", {
      searchParams: {
        cloudAccountId: account || undefined,
      },
    });
    if (!result.ok) {
      setRows(null);
      setError(result.message);
      setLoading(false);
      return;
    }
    setRows(result.data.renewals);
    setLoading(false);
  }, [account]);

  useEffect(() => {
    void load();
  }, [load]);

  const ordered = useMemo(() => {
    if (!rows) return [];
    return [...rows].sort((a, b) => a.lockEnd.localeCompare(b.lockEnd));
  }, [rows]);

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
        <Button asChild variant="outline">
          <Link href="/gaps">Open gaps</Link>
        </Button>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        Renew-by queue from commitment lock ends. Buy/reduce/hold packs ship
        later.
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
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Renew-by (lock_end)</th>
                <th className="px-3 py-2 font-medium">Commitment</th>
                <th className="px-3 py-2 font-medium">Provider</th>
                <th className="px-3 py-2 font-medium">Account</th>
              </tr>
            </thead>
            <tbody>
              {ordered.map((row) => (
                <tr
                  key={row.commitmentId}
                  className="border-b border-border/70 last:border-0"
                >
                  <td className="px-3 py-2 font-[family-name:var(--font-mono)] text-xs">
                    {row.lockEnd.slice(0, 10)}
                  </td>
                  <td className="px-3 py-2">{row.name}</td>
                  <td className="px-3 py-2 font-[family-name:var(--font-mono)] text-xs uppercase">
                    {row.provider}
                  </td>
                  <td className="px-3 py-2 font-[family-name:var(--font-mono)] text-xs">
                    {row.cloudAccountId.slice(0, 12)}…
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
