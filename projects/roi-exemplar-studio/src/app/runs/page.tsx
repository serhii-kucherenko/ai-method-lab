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
  promptId: string;
  roiId: string;
  localizationPrecision: number;
  coverageBreadth: number;
  exemplarDiversity: number;
  promptFit: number;
  status: string;
};

export default function RunsPage() {
  const [prompts, setPrompts] = useState<Ref[]>([]);
  const [rois, setRois] = useState<Ref[]>([]);
  const [items, setItems] = useState<Run[]>([]);
  const [promptId, setPromptId] = useState("");
  const [roiId, setRoiId] = useState("");
  const [localizationPrecision, setLocalizationPrecision] = useState("0.65");
  const [coverageBreadth, setCoverageBreadth] = useState("0.7");
  const [exemplarDiversity, setExemplarDiversity] = useState("0.72");
  const [promptFit, setPromptFit] = useState("0.68");
  const [error, setError] = useState("");

  async function load() {
    const [p, r, runs] = await Promise.all([
      api<{ items: Ref[] }>("/api/prompts"),
      api<{ items: Ref[] }>("/api/rois"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setPrompts(p.items);
    setRois(r.items);
    setItems(runs.items);
    if (!promptId && p.items[0]) setPromptId(p.items[0].id);
    if (!roiId && r.items[0]) setRoiId(r.items[0].id);
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
          promptId,
          roiId,
          localizationPrecision: Number(localizationPrecision),
          coverageBreadth: Number(coverageBreadth),
          exemplarDiversity: Number(exemplarDiversity),
          promptFit: Number(promptFit),
          reviewerNotes: "Soft-sim exemplar run",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Exemplar runs"
      subtitle="Soft-sim intensity inputs for localization, coverage, diversity, and prompt fit."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="prompt">Prompt set</Label>
          <select
            id="prompt"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={promptId}
            onChange={(e) => setPromptId(e.target.value)}
          >
            {prompts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label ?? p.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="roi">ROI config</Label>
          <select
            id="roi"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={roiId}
            onChange={(e) => setRoiId(e.target.value)}
          >
            {rois.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label ?? r.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="loc">Localization precision</Label>
          <Input
            id="loc"
            value={localizationPrecision}
            onChange={(e) => setLocalizationPrecision(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="cov">Coverage breadth</Label>
          <Input
            id="cov"
            value={coverageBreadth}
            onChange={(e) => setCoverageBreadth(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="div">Exemplar diversity</Label>
          <Input
            id="div"
            value={exemplarDiversity}
            onChange={(e) => setExemplarDiversity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="fit">Prompt fit</Label>
          <Input
            id="fit"
            value={promptFit}
            onChange={(e) => setPromptFit(e.target.value)}
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
              loc {r.localizationPrecision} · cov {r.coverageBreadth} · div{" "}
              {r.exemplarDiversity} · fit {r.promptFit} · {r.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
