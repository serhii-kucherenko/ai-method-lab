"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Regimen = { id: string; label: string };
type Onset = { id: string; label: string };
type Run = {
  id: string;
  onsetId: string;
  regimenId: string;
  onsetCoverage: number;
  regimenFidelity: number;
  hmmStateClarity: number;
  packCompleteness: number;
  runNotes: string;
  status: string;
};

export function RunsPage() {
  const [regimens, setRegimens] = useState<Regimen[]>([]);
  const [onsets, setOnsets] = useState<Onset[]>([]);
  const [items, setItems] = useState<Run[]>([]);
  const [onsetId, setOnsetId] = useState("");
  const [regimenId, setRegimenId] = useState("");
  const [onsetCoverage, setOnsetCoverage] = useState("0.7");
  const [regimenFidelity, setRegimenFidelity] = useState("0.72");
  const [hmmStateClarity, setHmmStateClarity] = useState("0.68");
  const [packCompleteness, setPackCompleteness] = useState("0.65");
  const [runNotes, setRunNotes] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [c, e, runs] = await Promise.all([
      api<{ items: Regimen[] }>("/api/regimens"),
      api<{ items: Onset[] }>("/api/onsets"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setRegimens(c.items);
    setOnsets(e.items);
    setItems(runs.items);
    if (!regimenId && c.items[0]) setRegimenId(c.items[0].id);
    if (!onsetId && e.items[0]) setOnsetId(e.items[0].id);
  }

  useEffect(() => {
    load().catch((err) => setError(String(err)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/runs", {
        method: "POST",
        body: JSON.stringify({
          onsetId,
          regimenId,
          onsetCoverage: Number(onsetCoverage),
          regimenFidelity: Number(regimenFidelity),
          hmmStateClarity: Number(hmmStateClarity),
          packCompleteness: Number(packCompleteness),
          runNotes,
        }),
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <StudioShell
      title="Runs"
      subtitle="Capture soft-sim proxies for CT-HMM therapy effectiveness runs."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="onset">Onset</Label>
          <select
            id="onset"
            className="flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-transparent px-3 text-sm"
            value={onsetId}
            onChange={(e) => setOnsetId(e.target.value)}
          >
            {onsets.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="regimen">Regimen</Label>
          <select
            id="regimen"
            className="flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-transparent px-3 text-sm"
            value={regimenId}
            onChange={(e) => setRegimenId(e.target.value)}
          >
            {regimens.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="oc">Onset coverage (0–1)</Label>
          <Input id="oc" value={onsetCoverage} onChange={(e) => setOnsetCoverage(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="rf">Regimen fidelity (0–1)</Label>
          <Input id="rf" value={regimenFidelity} onChange={(e) => setRegimenFidelity(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="hmm">HMM state clarity (0–1)</Label>
          <Input id="hmm" value={hmmStateClarity} onChange={(e) => setHmmStateClarity(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="pack">Pack completeness (0–1)</Label>
          <Input id="pack" value={packCompleteness} onChange={(e) => setPackCompleteness(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="notes">Run notes</Label>
          <Input id="notes" value={runNotes} onChange={(e) => setRunNotes(e.target.value)} />
        </div>
        <div>
          <Button onClick={() => create()}>Create therapy run</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <p className="font-medium">{r.id.slice(0, 8)}… · {r.status}</p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              onset {r.onsetCoverage} · regimen {r.regimenFidelity} · HMM{" "}
              {r.hmmStateClarity} · pack {r.packCompleteness}
            </p>
            {r.runNotes ? <p className="mt-1 text-sm">{r.runNotes}</p> : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default RunsPage;
