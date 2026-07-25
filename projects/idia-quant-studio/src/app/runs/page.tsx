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
  targetCoverage: number;
  spectrumInformedness: number;
  proteinDetectability: number;
  quantPrecision: number;
  status: string;
};

export default function RunsPage() {
  const [targets, setTargets] = useState<Ref[]>([]);
  const [spectra, setSpectra] = useState<Ref[]>([]);
  const [items, setItems] = useState<Run[]>([]);
  const [targetId, setTargetId] = useState("");
  const [spectrumId, setSpectrumId] = useState("");
  const [targetCoverage, setTargetCoverage] = useState(0.65);
  const [spectrumInformedness, setSpectrumInformedness] = useState(0.7);
  const [proteinDetectability, setProteinDetectability] = useState(0.72);
  const [quantPrecision, setQuantPrecision] = useState(0.68);
  const [error, setError] = useState("");

  async function load() {
    const [t, s, r] = await Promise.all([
      api<{ items: Ref[] }>("/api/targets"),
      api<{ items: Ref[] }>("/api/spectra"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setTargets(t.items);
    setSpectra(s.items);
    setItems(r.items);
    if (!targetId && t.items[0]) setTargetId(t.items[0].id);
    if (!spectrumId && s.items[0]) setSpectrumId(s.items[0].id);
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
          targetId,
          spectrumId,
          targetCoverage,
          spectrumInformedness,
          proteinDetectability,
          quantPrecision,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Runs"
      subtitle="Soft-sim runs capturing coverage, informedness, detectability, and precision."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="target">Target panel</Label>
          <select
            id="target"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
          >
            {targets.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label ?? t.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="spectrum">Spectrum</Label>
          <select
            id="spectrum"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={spectrumId}
            onChange={(e) => setSpectrumId(e.target.value)}
          >
            {spectra.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="cov">Target coverage</Label>
          <Input
            id="cov"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={targetCoverage}
            onChange={(e) => setTargetCoverage(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="inf">Spectrum informedness</Label>
          <Input
            id="inf"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={spectrumInformedness}
            onChange={(e) => setSpectrumInformedness(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="det">Protein detectability</Label>
          <Input
            id="det"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={proteinDetectability}
            onChange={(e) => setProteinDetectability(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="prec">Quant precision</Label>
          <Input
            id="prec"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={quantPrecision}
            onChange={(e) => setQuantPrecision(Number(e.target.value))}
          />
        </div>
        <div>
          <Button onClick={create}>Create run</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{r.id}</div>
            <p className="text-sm">
              cov {r.targetCoverage} · informed {r.spectrumInformedness} · det{" "}
              {r.proteinDetectability} · prec {r.quantPrecision} · {r.status}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
