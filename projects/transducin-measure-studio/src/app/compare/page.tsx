"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  snomedCoded: { overall: number };
  privateTagBaseline: { overall: number };
};

type Ref = { id: string; label?: string };

export default function ComparePage() {
  const [items, setItems] = useState<Compare[]>([]);
  const [exports, setExports] = useState<Ref[]>([]);
  const [parsers, setParsers] = useState<Ref[]>([]);
  const [runs, setRuns] = useState<Ref[]>([]);
  const [name, setName] = useState(
    "SNOMED-coded OCT recovery vs raw private-tag baseline",
  );
  const [exportId, setExportId] = useState("");
  const [parserId, setParserId] = useState("");
  const [runId, setRunId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [compares, es, ps, runList] = await Promise.all([
      api<{ items: Compare[] }>("/api/compare"),
      api<{ items: Ref[] }>("/api/exports"),
      api<{ items: Ref[] }>("/api/parsers"),
      api<{ items: Ref[] }>("/api/runs"),
    ]);
    setItems(compares.items);
    setExports(es.items);
    setParsers(ps.items);
    setRuns(runList.items);
    if (!exportId && es.items[0]) setExportId(es.items[0].id);
    if (!parserId && ps.items[0]) setParserId(ps.items[0].id);
    if (!runId && runList.items[0]) setRunId(runList.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function run() {
    setError("");
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name, exportId, parserId, runId }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="A/B compare"
      subtitle="SNOMED-CT coded OCT recovery (A) versus raw private-tag dump baseline (B)."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="name">Compare name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="export">DICOM SR export</Label>
          <select
            id="export"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={exportId}
            onChange={(e) => setExportId(e.target.value)}
          >
            {exports.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label ?? f.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="parser">Parser config</Label>
          <select
            id="parser"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={parserId}
            onChange={(e) => setParserId(e.target.value)}
          >
            {parsers.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label ?? f.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="run">Measure run</Label>
          <select
            id="run"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={runId}
            onChange={(e) => setRunId(e.target.value)}
          >
            {runs.map((f) => (
              <option key={f.id} value={f.id}>
                {f.id}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <Button onClick={run}>Run A/B compare</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((c) => (
          <li
            key={c.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{c.name}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              Winner {c.winner} · gap {c.gap} · A {c.snomedCoded.overall} · B{" "}
              {c.privateTagBaseline.overall}
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
              <div
                className="score-bar h-full bg-[var(--tm-teal)]"
                style={{ width: `${c.snomedCoded.overall}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
