"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label?: string };
type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  integrated: { overall: number };
  fragmented: { overall: number };
};

export function ComparePage() {
  const [quants, setQuants] = useState<Ref[]>([]);
  const [regs, setRegs] = useState<Ref[]>([]);
  const [runs, setRuns] = useState<Ref[]>([]);
  const [items, setItems] = useState<Compare[]>([]);
  const [name, setName] = useState(
    "Integrated atlas workflow vs fragmented multi-tool baseline",
  );
  const [quantificationId, setQuantificationId] = useState("");
  const [registrationId, setRegistrationId] = useState("");
  const [runId, setRunId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [q, r, runsData, compares] = await Promise.all([
      api<{ items: Ref[] }>("/api/quantifications"),
      api<{ items: Ref[] }>("/api/registrations"),
      api<{ items: Ref[] }>("/api/runs"),
      api<{ items: Compare[] }>("/api/compare"),
    ]);
    setQuants(q.items);
    setRegs(r.items);
    setRuns(runsData.items);
    setItems(compares.items);
    if (!quantificationId && q.items[0]) setQuantificationId(q.items[0].id);
    if (!registrationId && r.items[0]) setRegistrationId(r.items[0].id);
    if (!runId && runsData.items[0]) setRunId(runsData.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function run() {
    setError("");
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name,
          quantificationId,
          registrationId,
          runId,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Compare"
      subtitle="Dual A/B: integrated_atlas_workflow vs fragmented_multi_tool_baseline."
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
          <Label htmlFor="quant">Quantification</Label>
          <select
            id="quant"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={quantificationId}
            onChange={(e) => setQuantificationId(e.target.value)}
          >
            {quants.map((q) => (
              <option key={q.id} value={q.id}>
                {q.label ?? q.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="reg">Registration</Label>
          <select
            id="reg"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={registrationId}
            onChange={(e) => setRegistrationId(e.target.value)}
          >
            {regs.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label ?? r.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="run">Run</Label>
          <select
            id="run"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={runId}
            onChange={(e) => setRunId(e.target.value)}
          >
            {runs.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <Button onClick={run}>Run A/B compare</Button>
          {error ? (
            <p className="mt-2 text-sm text-[var(--af-amber)]">{error}</p>
          ) : null}
        </div>
      </div>
      <ul className="space-y-2">
        {items.map((c) => (
          <li
            key={c.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <p className="font-medium">{c.name}</p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              winner {c.winner} · gap {c.gap} · integrated{" "}
              {c.integrated.overall} · fragmented {c.fragmented.overall}
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
              <div
                className="score-bar h-full bg-[var(--af-teal)]"
                style={{ width: `${Math.min(100, c.integrated.overall)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default ComparePage;
