"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Run = {
  id: string;
  loopId: string;
  reagentId: string;
  packCoverage: number;
  reagentFidelity: number;
  loopClarity: number;
  runStability: number;
  status: string;
};

type Ref = { id: string; label: string };

export default function RunsPage() {
  const [items, setItems] = useState<Run[]>([]);
  const [loops, setLoops] = useState<Ref[]>([]);
  const [reagents, setReagents] = useState<Ref[]>([]);
  const [loopId, setLoopId] = useState("");
  const [reagentId, setReagentId] = useState("");
  const [packCoverage, setPackCoverage] = useState("0.65");
  const [reagentFidelity, setReagentFidelity] = useState("0.7");
  const [loopClarity, setLoopClarity] = useState("0.72");
  const [runStability, setRunStability] = useState("0.68");
  const [error, setError] = useState("");

  async function load() {
    const [runs, lps, rgs] = await Promise.all([
      api<{ items: Run[] }>("/api/runs"),
      api<{ items: Ref[] }>("/api/loops"),
      api<{ items: Ref[] }>("/api/reagents"),
    ]);
    setItems(runs.items);
    setLoops(lps.items);
    setReagents(rgs.items);
    if (!loopId && lps.items[0]) setLoopId(lps.items[0].id);
    if (!reagentId && rgs.items[0]) setReagentId(rgs.items[0].id);
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
          loopId,
          reagentId,
          packCoverage: Number(packCoverage),
          reagentFidelity: Number(reagentFidelity),
          loopClarity: Number(loopClarity),
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
      title="Reaction runs"
      subtitle="Record soft-sim pack coverage, reagent fidelity, loop clarity, and run stability."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3">
        <div>
          <Label htmlFor="loop">Loop policy</Label>
          <select
            id="loop"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={loopId}
            onChange={(e) => setLoopId(e.target.value)}
          >
            {loops.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="reagent">Reagent space</Label>
          <select
            id="reagent"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={reagentId}
            onChange={(e) => setReagentId(e.target.value)}
          >
            {reagents.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="pc">Pack coverage</Label>
          <Input
            id="pc"
            value={packCoverage}
            onChange={(e) => setPackCoverage(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="rf">Reagent fidelity</Label>
          <Input
            id="rf"
            value={reagentFidelity}
            onChange={(e) => setReagentFidelity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="lc">Loop clarity</Label>
          <Input
            id="lc"
            value={loopClarity}
            onChange={(e) => setLoopClarity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="rs">Run stability</Label>
          <Input
            id="rs"
            value={runStability}
            onChange={(e) => setRunStability(e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <Button onClick={create}>Create reaction run</Button>
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
              P {r.packCoverage.toFixed(2)} · R {r.reagentFidelity.toFixed(2)} ·
              L {r.loopClarity.toFixed(2)} · S {r.runStability.toFixed(2)} ·{" "}
              {r.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
