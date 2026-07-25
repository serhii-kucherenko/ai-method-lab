"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Run = {
  id: string;
  queryId: string;
  modalityId: string;
  cohortCoverage: number;
  modalityFidelity: number;
  queryClarity: number;
  runStability: number;
  status: string;
};

type Ref = { id: string; label?: string };

export default function RunsPage() {
  const [items, setItems] = useState<Run[]>([]);
  const [queries, setQueries] = useState<Ref[]>([]);
  const [modalities, setModalities] = useState<Ref[]>([]);
  const [queryId, setQueryId] = useState("");
  const [modalityId, setModalityId] = useState("");
  const [cohortCoverage, setCohortCoverage] = useState("0.65");
  const [modalityFidelity, setModalityFidelity] = useState("0.7");
  const [queryClarity, setQueryClarity] = useState("0.72");
  const [runStability, setRunStability] = useState("0.68");
  const [error, setError] = useState("");

  async function load() {
    const [runs, qs, mods] = await Promise.all([
      api<{ items: Run[] }>("/api/runs"),
      api<{ items: Ref[] }>("/api/queries"),
      api<{ items: Ref[] }>("/api/modalities"),
    ]);
    setItems(runs.items);
    setQueries(qs.items);
    setModalities(mods.items);
    if (!queryId && qs.items[0]) setQueryId(qs.items[0].id);
    if (!modalityId && mods.items[0]) setModalityId(mods.items[0].id);
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
          queryId,
          modalityId,
          cohortCoverage: Number(cohortCoverage),
          modalityFidelity: Number(modalityFidelity),
          queryClarity: Number(queryClarity),
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
      title="Shared runs"
      subtitle="Soft-sim runs that feed dual shared vs disease-specific compares."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="query">Risk query</Label>
          <select
            id="query"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={queryId}
            onChange={(e) => setQueryId(e.target.value)}
          >
            {queries.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label ?? f.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="modality">Modality schema</Label>
          <select
            id="modality"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={modalityId}
            onChange={(e) => setModalityId(e.target.value)}
          >
            {modalities.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label ?? f.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="cov">Cohort coverage</Label>
          <Input
            id="cov"
            value={cohortCoverage}
            onChange={(e) => setCohortCoverage(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="fid">Modality fidelity</Label>
          <Input
            id="fid"
            value={modalityFidelity}
            onChange={(e) => setModalityFidelity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="clr">Query clarity</Label>
          <Input
            id="clr"
            value={queryClarity}
            onChange={(e) => setQueryClarity(e.target.value)}
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
        <div className="md:col-span-2">
          <Button onClick={create}>Create shared run</Button>
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
              cov {r.cohortCoverage} · fid {r.modalityFidelity} · clr{" "}
              {r.queryClarity} · stab {r.runStability} · {r.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
