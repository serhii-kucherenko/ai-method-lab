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

type CommitmentRow = {
  id: string;
  name: string;
  provider: string;
  instrument_type: string;
  rate_usd: number;
  lock_start: string;
  lock_end: string;
  archived_at: string | null;
  tags: string;
};

type CommitmentsResponse = {
  softSim: boolean;
  commitments: CommitmentRow[];
};

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CommitmentsPage() {
  const [search, setSearch] = useState("");
  const [provider, setProvider] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [rows, setRows] = useState<CommitmentRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await apiJson<CommitmentsResponse>("/api/commitments", {
      searchParams: {
        search: debouncedSearch || undefined,
      },
    });
    if (!result.ok) {
      setRows(null);
      setError(result.message);
      setLoading(false);
      return;
    }
    setRows(result.data.commitments);
    setLoading(false);
  }, [debouncedSearch]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!rows) return [];
    if (!provider) return rows;
    return rows.filter(
      (row) => row.provider.toLowerCase() === provider.toLowerCase(),
    );
  }, [rows, provider]);

  return (
    <StudioShell title="Commitments">
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <label className="flex min-w-[12rem] flex-1 flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, tag, provider…"
            className="h-8 rounded-md border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>
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
        <Button asChild variant="outline">
          <Link href="/imports">Import usage</Link>
        </Button>
      </div>

      {loading ? <LoadingState label="Loading commitments…" /> : null}
      {!loading && error ? (
        <ErrorState message={error} onRetry={() => void load()} />
      ) : null}
      {!loading && !error && filtered.length === 0 ? (
        <EmptyState
          action={
            <Button asChild>
              <Link href="/imports">Import or add first commit</Link>
            </Button>
          }
        >
          Import or add first commit
        </EmptyState>
      ) : null}
      {!loading && !error && filtered.length > 0 ? (
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Provider</th>
                <th className="px-3 py-2 font-medium">Type</th>
                <th className="px-3 py-2 font-medium">Rate</th>
                <th className="px-3 py-2 font-medium">Lock end</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border/70 last:border-0"
                >
                  <td className="px-3 py-2 text-foreground">{row.name}</td>
                  <td className="px-3 py-2 font-[family-name:var(--font-mono)] text-xs uppercase">
                    {row.provider}
                  </td>
                  <td className="px-3 py-2">{row.instrument_type}</td>
                  <td className="px-3 py-2 font-[family-name:var(--font-mono)]">
                    {formatUsd(row.rate_usd)}
                  </td>
                  <td className="px-3 py-2 font-[family-name:var(--font-mono)] text-xs">
                    {row.lock_end.slice(0, 10)}
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
