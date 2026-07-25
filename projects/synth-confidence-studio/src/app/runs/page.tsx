"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label?: string };
type Run = {
  id: string;
  scoreId: string;
  candidateId: string;
  packCoverage: number;
  confidenceFidelity: number;
  candidateClarity: number;
  runStability: number;
  status: string;
};

export default function RunsPage() {
  const [items, setItems] = useState<Run[]>([]);
  const [scores, setScores] = useState<Ref[]>([]);
  const [candidates, setCandidates] = useState<Ref[]>([]);
  const [scoreId, setScoreId] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [packCoverage, setPackCoverage] = useState("0.62");
  const [confidenceFidelity, setConfidenceFidelity] = useState("0.7");
  const [candidateClarity, setCandidateClarity] = useState("0.74");
  const [runStability, setRunStability] = useState("0.68");
  const [error, setError] = useState("");

  async function load() {
    const [runs, ss, cs] = await Promise.all([
      api<{ items: Run[] }>("/api/runs"),
      api<{ items: Ref[] }>("/api/scores"),
      api<{ items: Ref[] }>("/api/candidates"),
    ]);
    setItems(runs.items);
    setScores(ss.items);
    setCandidates(cs.items);
    if (!scoreId && ss.items[0]) setScoreId(ss.items[0].id);
    if (!candidateId && cs.items[0]) setCandidateId(cs.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/runs", {
        method: "POST",
        body: JSON.stringify({
          scoreId,
          candidateId,
          packCoverage: Number(packCoverage),
          confidenceFidelity: Number(confidenceFidelity),
          candidateClarity: Number(candidateClarity),
          runStability: Number(runStability),
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Synth runs"
      subtitle="Soft-sim runs that feed confidence-gated vs naive AI compares."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="score">Confidence score</Label>
          <select
            id="score"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={scoreId}
            onChange={(e) => setScoreId(e.target.value)}
          >
            {scores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="candidate">Candidate route</Label>
          <select
            id="candidate"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={candidateId}
            onChange={(e) => setCandidateId(e.target.value)}
          >
            {candidates.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label ?? c.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="cov">Pack coverage</Label>
          <Input
            id="cov"
            value={packCoverage}
            onChange={(e) => setPackCoverage(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="fid">Confidence fidelity</Label>
          <Input
            id="fid"
            value={confidenceFidelity}
            onChange={(e) => setConfidenceFidelity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="clar">Candidate clarity</Label>
          <Input
            id="clar"
            value={candidateClarity}
            onChange={(e) => setCandidateClarity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="stab">Run stability</Label>
          <Input
            id="stab"
            value={runStability}
            onChange={(e) => setRunStability(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={create}>Create run</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{r.id}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              cov {r.packCoverage} · fid {r.confidenceFidelity} · clar{" "}
              {r.candidateClarity} · stab {r.runStability} · {r.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
