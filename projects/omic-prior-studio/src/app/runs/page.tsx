"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Run = {
  id: string;
  traitPanelId: string;
  priorSetId: string;
  priorCoverage: number;
  transformerFidelity: number;
  traitGrounding: number;
  packCompleteness: number;
  status: string;
};
type Trait = { id: string; label: string };
type Prior = { id: string; label: string };

export function RunsPage() {
  const [items, setItems] = useState<Run[]>([]);
  const [traits, setTraits] = useState<Trait[]>([]);
  const [priors, setPriors] = useState<Prior[]>([]);
  const [traitPanelId, setTraitPanelId] = useState("");
  const [priorSetId, setPriorSetId] = useState("");
  const [priorCoverage, setPriorCoverage] = useState(0.65);
  const [transformerFidelity, setTransformerFidelity] = useState(0.7);
  const [traitGrounding, setTraitGrounding] = useState(0.72);
  const [packCompleteness, setPackCompleteness] = useState(0.68);
  const [error, setError] = useState("");

  async function load() {
    const [runs, c, t] = await Promise.all([
      api<{ items: Run[] }>("/api/runs"),
      api<{ items: Trait[] }>("/api/traits"),
      api<{ items: Prior[] }>("/api/priors"),
    ]);
    setItems(runs.items);
    setTraits(c.items);
    setPriors(t.items);
    if (!traitPanelId && c.items[0]) setTraitPanelId(c.items[0].id);
    if (!priorSetId && t.items[0]) setPriorSetId(t.items[0].id);
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
          traitPanelId,
          priorSetId,
          priorCoverage,
          transformerFidelity,
          traitGrounding,
          packCompleteness,
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
      subtitle="Capture soft-sim proxies for prior coverage, transformer fidelity, trait grounding, and pack completeness."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="c">Trait panel</Label>
          <select
            id="c"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={traitPanelId}
            onChange={(e) => setTraitPanelId(e.target.value)}
          >
            {traits.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="t">Prior set</Label>
          <select
            id="t"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={priorSetId}
            onChange={(e) => setPriorSetId(e.target.value)}
          >
            {priors.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="priorCoverage">priorCoverage</Label>
          <Input id="priorCoverage" type="number" step="0.01" min={0} max={1} value={priorCoverage} onChange={(e) => setPriorCoverage(Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="transformerFidelity">transformerFidelity</Label>
          <Input id="transformerFidelity" type="number" step="0.01" min={0} max={1} value={transformerFidelity} onChange={(e) => setTransformerFidelity(Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="traitGrounding">traitGrounding</Label>
          <Input id="traitGrounding" type="number" step="0.01" min={0} max={1} value={traitGrounding} onChange={(e) => setTraitGrounding(Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="packCompleteness">packCompleteness</Label>
          <Input id="packCompleteness" type="number" step="0.01" min={0} max={1} value={packCompleteness} onChange={(e) => setPackCompleteness(Number(e.target.value))} />
        </div>
        <div><Button onClick={() => create()}>Create run</Button></div>
      </div>
      {error ? <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((r) => (
          <li key={r.id} className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3">
            <p className="font-medium">{r.id}</p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              prior {r.priorCoverage} · fidelity {r.transformerFidelity} · trait {r.traitGrounding} · pack {r.packCompleteness}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default RunsPage;
