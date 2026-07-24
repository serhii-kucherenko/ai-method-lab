"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/client-api";
import type { CompareResult, OrganismPanel } from "@/store";
import type { PredictInput } from "@/domain/types";

type PanelPage = { items: OrganismPanel[] };

export default function ComparePage() {
  const [panels, setPanels] = useState<OrganismPanel[]>([]);
  const [rows, setRows] = useState<CompareResult[]>([]);
  const [panelId, setPanelId] = useState("");
  const [name, setName] = useState("Integrated vs sequence-only");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function refresh() {
    start(async () => {
      try {
        const [p, c] = await Promise.all([
          api<PanelPage>("/api/panels?pageSize=50"),
          api<CompareResult[]>("/api/compare"),
        ]);
        setPanels(p.items);
        setRows(c);
        if (!panelId && p.items[0]) setPanelId(p.items[0].id);
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "load_failed");
      }
    });
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function runCompare() {
    start(async () => {
      try {
        const predictInput: PredictInput = {
          seqLength: 480,
          aaCompositionEntropy: 0.74,
          hydrophobicFraction: 0.4,
          pssmConservation: 0.78,
          msaDepth: 62,
          structureCoverage: 0.88,
          contactMapDensity: 0.62,
          signalPeptideScore: 0.55,
          profile: "full",
        };
        await api("/api/compare", {
          method: "POST",
          body: JSON.stringify({ name, panelId, predictInput }),
        });
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "compare_failed");
      }
    });
  }

  return (
    <StudioShell
      title="Feature-integrated vs sequence-only"
      subtitle="Side-by-side dual scores so structural and evolutionary signal is measurable — not assumed."
    >
      <div className="mb-8 grid gap-4 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="cname">Compare name</Label>
          <Input id="cname" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="cpanel">Panel</Label>
          <select
            id="cpanel"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={panelId}
            onChange={(e) => setPanelId(e.target.value)}
          >
            {panels.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <Button onClick={runCompare} disabled={pending || !panelId}>
            Run compare
          </Button>
        </div>
      </div>

      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      <ul className="space-y-4">
        {rows.map((row, idx) => (
          <li
            key={row.id}
            className="animate-compare-slide rounded-lg border border-[var(--studio-line)] bg-white p-5"
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-medium text-slate-900">{row.name}</h3>
              <Badge>
                Winner: {row.winner.replace("_", " ")}
              </Badge>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-[var(--studio-mint-ink)]">
                  Feature-integrated
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Overall {row.featureIntegrated.overall} · VF{" "}
                  {row.featureIntegrated.vfScore} · ARG{" "}
                  {row.featureIntegrated.argScore} · class{" "}
                  {row.featureIntegrated.predictedClass}
                </p>
                <div className="mt-2 h-2 overflow-hidden rounded bg-slate-100">
                  <div
                    className="animate-bar-grow h-full bg-teal-700"
                    style={{
                      width: `${Math.min(100, row.featureIntegrated.overall)}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Sequence-only
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Overall {row.sequenceOnly.overall} · VF{" "}
                  {row.sequenceOnly.vfScore} · ARG {row.sequenceOnly.argScore} ·
                  class {row.sequenceOnly.predictedClass}
                </p>
                <div className="mt-2 h-2 overflow-hidden rounded bg-slate-100">
                  <div
                    className="animate-bar-grow h-full bg-slate-500"
                    style={{
                      width: `${Math.min(100, row.sequenceOnly.overall)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
