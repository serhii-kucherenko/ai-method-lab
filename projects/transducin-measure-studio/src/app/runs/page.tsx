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
  exportId: string;
  parserId: string;
  measureCoverage: number;
  parseFidelity: number;
  snomedClarity: number;
  exportStability: number;
  status: string;
};

export default function RunsPage() {
  const [items, setItems] = useState<Run[]>([]);
  const [exports, setExports] = useState<Ref[]>([]);
  const [parsers, setParsers] = useState<Ref[]>([]);
  const [exportId, setExportId] = useState("");
  const [parserId, setParserId] = useState("");
  const [measureCoverage, setMeasureCoverage] = useState("0.62");
  const [parseFidelity, setParseFidelity] = useState("0.7");
  const [snomedClarity, setSnomedClarity] = useState("0.74");
  const [exportStability, setExportStability] = useState("0.68");
  const [error, setError] = useState("");

  async function load() {
    const [runs, es, ps] = await Promise.all([
      api<{ items: Run[] }>("/api/runs"),
      api<{ items: Ref[] }>("/api/exports"),
      api<{ items: Ref[] }>("/api/parsers"),
    ]);
    setItems(runs.items);
    setExports(es.items);
    setParsers(ps.items);
    if (!exportId && es.items[0]) setExportId(es.items[0].id);
    if (!parserId && ps.items[0]) setParserId(ps.items[0].id);
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
          exportId,
          parserId,
          measureCoverage: Number(measureCoverage),
          parseFidelity: Number(parseFidelity),
          snomedClarity: Number(snomedClarity),
          exportStability: Number(exportStability),
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Measure runs"
      subtitle="Soft-sim runs that feed SNOMED-coded recovery vs raw private-tag compares."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="export">DICOM SR export</Label>
          <select
            id="export"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={exportId}
            onChange={(e) => setExportId(e.target.value)}
          >
            {exports.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
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
            {parsers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label ?? c.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="cov">Measure coverage</Label>
          <Input
            id="cov"
            value={measureCoverage}
            onChange={(e) => setMeasureCoverage(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="fid">Parse fidelity</Label>
          <Input
            id="fid"
            value={parseFidelity}
            onChange={(e) => setParseFidelity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="clar">SNOMED clarity</Label>
          <Input
            id="clar"
            value={snomedClarity}
            onChange={(e) => setSnomedClarity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="stab">Export stability</Label>
          <Input
            id="stab"
            value={exportStability}
            onChange={(e) => setExportStability(e.target.value)}
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
              cov {r.measureCoverage} · parse {r.parseFidelity} · snomed{" "}
              {r.snomedClarity} · export {r.exportStability} · {r.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
