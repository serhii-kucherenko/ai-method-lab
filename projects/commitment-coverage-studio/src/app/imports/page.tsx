"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/studio-states";
import { apiJson } from "@/lib/api";

type ImportBatch = {
  id: string;
  status: string;
  source_kind: string;
  row_count: number;
  accepted_count: number;
  failed_count: number;
  error_detail: string | null;
  created_at: string;
};

type ImportsResponse = { softSim: boolean; imports: ImportBatch[] };
type ImportDetailResponse = {
  softSim: boolean;
  batch: ImportBatch;
  errorDetail: string | null;
};

export default function ImportsPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [batches, setBatches] = useState<ImportBatch[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ImportDetailResponse | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await apiJson<ImportsResponse>("/api/imports");
    if (!result.ok) {
      setBatches(null);
      setError(result.message);
      setLoading(false);
      return;
    }
    setBatches(result.data.imports);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!batches) return [];
    if (!statusFilter) return batches;
    return batches.filter((b) => b.status === statusFilter);
  }, [batches, statusFilter]);

  const loadDetail = useCallback(async (id: string) => {
    setSelectedId(id);
    setDetailLoading(true);
    setDetailError(null);
    setDetail(null);
    const result = await apiJson<ImportDetailResponse>(`/api/imports/${id}`);
    if (!result.ok) {
      setDetailError(result.message);
      setDetailLoading(false);
      return;
    }
    setDetail(result.data);
    setDetailLoading(false);
  }, []);

  return (
    <StudioShell title="Imports">
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <label className="flex w-44 flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">All</option>
            <option value="accepted">accepted</option>
            <option value="failed">failed</option>
          </select>
        </label>
      </div>

      {loading ? <LoadingState label="Loading imports…" /> : null}
      {!loading && error ? (
        <ErrorState message={error} onRetry={() => void load()} />
      ) : null}
      {!loading && !error && filtered.length === 0 ? (
        <EmptyState>No imports yet</EmptyState>
      ) : null}
      {!loading && !error && filtered.length > 0 ? (
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Created</th>
                <th className="px-3 py-2 font-medium">Source</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Accepted</th>
                <th className="px-3 py-2 font-medium">Failed</th>
                <th className="px-3 py-2 font-medium">Detail</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((batch) => (
                <tr
                  key={batch.id}
                  className="border-b border-border/70 last:border-0"
                >
                  <td className="px-3 py-2 font-[family-name:var(--font-mono)] text-xs">
                    {batch.created_at.slice(0, 19).replace("T", " ")}
                  </td>
                  <td className="px-3 py-2">{batch.source_kind}</td>
                  <td className="px-3 py-2 font-[family-name:var(--font-mono)] text-xs uppercase">
                    {batch.status}
                  </td>
                  <td className="px-3 py-2 font-[family-name:var(--font-mono)]">
                    {batch.accepted_count}
                  </td>
                  <td className="px-3 py-2 font-[family-name:var(--font-mono)]">
                    {batch.failed_count}
                  </td>
                  <td className="px-3 py-2">
                    {batch.status === "failed" || batch.failed_count > 0 ? (
                      <button
                        type="button"
                        onClick={() => void loadDetail(batch.id)}
                        className="text-sm font-medium text-[var(--color-accent)] underline-offset-4 hover:underline"
                      >
                        View failed detail
                      </button>
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

      {selectedId ? (
        <div className="mt-6 border border-border px-4 py-4">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">
            Failed batch detail
          </h2>
          {detailLoading ? <LoadingState label="Loading batch…" /> : null}
          {detailError ? <ErrorState message={detailError} /> : null}
          {detail ? (
            <p className="mt-3 text-sm text-foreground">
              {detail.errorDetail ||
                detail.batch.error_detail ||
                "No error detail recorded (soft-sim)."}
            </p>
          ) : null}
        </div>
      ) : null}
    </StudioShell>
  );
}
