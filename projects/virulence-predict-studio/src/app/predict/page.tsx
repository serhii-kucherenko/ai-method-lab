"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/client-api";
import type { OrganismPanel, PredictionRun } from "@/store";
import type { PredictMode, PredictProfile } from "@/domain/types";

type PanelPage = { items: OrganismPanel[] };
type RunPage = { items: PredictionRun[] };

export default function PredictPage() {
  const [panels, setPanels] = useState<OrganismPanel[]>([]);
  const [runs, setRuns] = useState<PredictionRun[]>([]);
  const [panelId, setPanelId] = useState("");
  const [mode, setMode] = useState<PredictMode>("feature_integrated");
  const [profile, setProfile] = useState<PredictProfile>("full");
  const [proteinLabel, setProteinLabel] = useState("Query VF candidate");
  const [seqLength, setSeqLength] = useState("420");
  const [pssm, setPssm] = useState("0.68");
  const [msa, setMsa] = useState("48");
  const [structure, setStructure] = useState("0.81");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function refresh() {
    start(async () => {
      try {
        const [p, r] = await Promise.all([
          api<PanelPage>("/api/panels?pageSize=50"),
          api<RunPage>("/api/runs?pageSize=20"),
        ]);
        setPanels(p.items);
        setRuns(r.items);
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

  function create() {
    start(async () => {
      try {
        await api("/api/runs", {
          method: "POST",
          body: JSON.stringify({
            panelId,
            mode,
            profile,
            proteinLabel,
            predictInput: {
              seqLength: Number(seqLength),
              pssmConservation: Number(pssm),
              msaDepth: Number(msa),
              structureCoverage: Number(structure),
              aaCompositionEntropy: 0.7,
              hydrophobicFraction: 0.35,
              contactMapDensity: 0.5,
              signalPeptideScore: 0.4,
              profile,
            },
          }),
        });
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "create_failed");
      }
    });
  }

  function advance(runId: string) {
    start(async () => {
      try {
        await api("/api/runs", {
          method: "POST",
          body: JSON.stringify({ action: "advance", runId }),
        });
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "advance_failed");
      }
    });
  }

  return (
    <StudioShell
      title="Prediction console"
      subtitle="Queue feature-integrated or sequence-only runs, then advance stage through featuring → scoring → complete."
    >
      <div className="mb-8 grid gap-4 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="panel">Organism panel</Label>
          <select
            id="panel"
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
        <div>
          <Label htmlFor="mode">Mode</Label>
          <select
            id="mode"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={mode}
            onChange={(e) => setMode(e.target.value as PredictMode)}
          >
            <option value="feature_integrated">Feature-integrated</option>
            <option value="sequence_only">Sequence-only</option>
          </select>
        </div>
        <div>
          <Label htmlFor="profile">Profile</Label>
          <select
            id="profile"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={profile}
            onChange={(e) => setProfile(e.target.value as PredictProfile)}
          >
            <option value="full">Full (structure + MSA)</option>
            <option value="fast">Fast</option>
          </select>
        </div>
        <div>
          <Label htmlFor="label">Protein label</Label>
          <Input
            id="label"
            value={proteinLabel}
            onChange={(e) => setProteinLabel(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="len">Sequence length</Label>
          <Input
            id="len"
            value={seqLength}
            onChange={(e) => setSeqLength(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="pssm">PSSM conservation</Label>
          <Input id="pssm" value={pssm} onChange={(e) => setPssm(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="msa">MSA depth</Label>
          <Input id="msa" value={msa} onChange={(e) => setMsa(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="struct">Structure coverage</Label>
          <Input
            id="struct"
            value={structure}
            onChange={(e) => setStructure(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create} disabled={pending || !panelId}>
            Queue prediction
          </Button>
        </div>
      </div>

      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      <ul className="space-y-3">
        {runs.map((r) => (
          <li
            key={r.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-medium text-slate-900">{r.proteinLabel}</h3>
                <p className="text-sm text-slate-600">
                  {r.mode.replace("_", " ")} · {r.profile}
                </p>
              </div>
              <Badge
                className={
                  r.stage === "scoring" || r.stage === "featuring"
                    ? "animate-pulse"
                    : ""
                }
              >
                {r.stage}
              </Badge>
            </div>
            {r.quality ? (
              <p className="mt-2 text-sm text-slate-700">
                Class {r.quality.predictedClass} · VF {r.quality.vfScore} · ARG{" "}
                {r.quality.argScore} · overall {r.quality.overall}
              </p>
            ) : null}
            {r.stage !== "complete" && r.stage !== "failed" ? (
              <Button
                className="mt-3"
                size="sm"
                variant="outline"
                onClick={() => advance(r.id)}
                disabled={pending}
              >
                Advance stage
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
