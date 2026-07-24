"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/client-api";
import type { PredictionRun } from "@/store";
import type { FeatureBreakdown } from "@/domain/types";

type FeaturesResponse = {
  run: PredictionRun | null;
  features: FeatureBreakdown | null;
  availableRuns: { id: string; proteinLabel: string; mode: string }[];
};

export default function FeaturesPage() {
  const [data, setData] = useState<FeaturesResponse | null>(null);
  const [runId, setRunId] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(id = runId) {
    start(async () => {
      try {
        const q = id ? `?runId=${encodeURIComponent(id)}` : "";
        const res = await api<FeaturesResponse>(`/api/features${q}`);
        setData(res);
        if (!id && res.run) setRunId(res.run.id);
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "load_failed");
      }
    });
  }

  useEffect(() => {
    load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const features = data?.features;
  const bars: { key: keyof FeatureBreakdown; label: string; color: string }[] = [
    { key: "statistical", label: "Statistical sequence", color: "bg-teal-800" },
    { key: "pssm", label: "PSSM / evolutionary", color: "bg-teal-600" },
    { key: "msa", label: "MSA depth", color: "bg-cyan-700" },
    { key: "structure", label: "Structure / contacts", color: "bg-slate-600" },
  ];

  return (
    <StudioShell
      title="Feature contributions"
      subtitle="Structural and evolutionary channels beside sequence statistics — see what drives the virulence call."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <select
          className="rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
          value={runId}
          onChange={(e) => setRunId(e.target.value)}
        >
          {(data?.availableRuns ?? []).map((r) => (
            <option key={r.id} value={r.id}>
              {r.proteinLabel} ({r.mode})
            </option>
          ))}
        </select>
        <Button variant="outline" onClick={() => load(runId)} disabled={pending}>
          Load features
        </Button>
      </div>

      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      {data?.run ? (
        <div className="mb-6 flex flex-wrap gap-2">
          <Badge>{data.run.mode.replace("_", " ")}</Badge>
          <Badge variant="secondary">{data.run.profile}</Badge>
          {data.run.quality ? (
            <Badge variant="outline">
              Class {data.run.quality.predictedClass}
            </Badge>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-slate-600">
          Complete a prediction run first to inspect feature bars.
        </p>
      )}

      {features ? (
        <div className="space-y-5 rounded-lg border border-[var(--studio-line)] bg-white p-6">
          {bars.map((b, i) => {
            const value = features[b.key];
            return (
              <div key={b.key}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-slate-800">{b.label}</span>
                  <span className="text-slate-600">{value.toFixed(1)}</span>
                </div>
                <div className="h-3 overflow-hidden rounded bg-slate-100">
                  <div
                    className={`animate-bar-grow h-full ${b.color}`}
                    style={{
                      width: `${Math.min(100, value)}%`,
                      animationDelay: `${i * 80}ms`,
                    }}
                  />
                </div>
              </div>
            );
          })}
          {data?.run?.quality ? (
            <p className="pt-2 text-sm text-slate-600">
              Structural contribution {data.run.quality.structuralContribution} ·
              Evolutionary {data.run.quality.evolutionaryContribution} · Sequence{" "}
              {data.run.quality.sequenceContribution}
            </p>
          ) : null}
        </div>
      ) : null}
    </StudioShell>
  );
}
