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
  distillId: string;
  traceId: string;
  cotStepQuality: number;
  arabicFluency: number;
  distillFidelity: number;
  agentGrounding: number;
  status: string;
};

export default function RunsPage() {
  const [distills, setDistills] = useState<Ref[]>([]);
  const [traces, setTraces] = useState<Ref[]>([]);
  const [items, setItems] = useState<Run[]>([]);
  const [distillId, setDistillId] = useState("");
  const [traceId, setTraceId] = useState("");
  const [cotStepQuality, setCotStepQuality] = useState(0.6);
  const [arabicFluency, setArabicFluency] = useState(0.65);
  const [distillFidelity, setDistillFidelity] = useState(0.7);
  const [agentGrounding, setAgentGrounding] = useState(0.68);
  const [error, setError] = useState("");

  async function load() {
    const [d, c, r] = await Promise.all([
      api<{ items: Ref[] }>("/api/distills"),
      api<{ items: Ref[] }>("/api/traces"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setDistills(d.items);
    setTraces(c.items);
    setItems(r.items);
    if (!distillId && d.items[0]) setDistillId(d.items[0].id);
    if (!traceId && c.items[0]) setTraceId(c.items[0].id);
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
          distillId,
          traceId,
          cotStepQuality,
          arabicFluency,
          distillFidelity,
          agentGrounding,
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
      subtitle="Soft-sim agent runs — CoT quality, Arabic fluency, distill fidelity, grounding."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="distill">Distill config</Label>
          <select
            id="distill"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={distillId}
            onChange={(e) => setDistillId(e.target.value)}
          >
            {distills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="trace">Trace set</Label>
          <select
            id="trace"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={traceId}
            onChange={(e) => setTraceId(e.target.value)}
          >
            {traces.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label ?? m.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="cot">CoT step quality</Label>
          <Input
            id="cot"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={cotStepQuality}
            onChange={(e) => setCotStepQuality(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="ar">Arabic fluency</Label>
          <Input
            id="ar"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={arabicFluency}
            onChange={(e) => setArabicFluency(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="df">Distill fidelity</Label>
          <Input
            id="df"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={distillFidelity}
            onChange={(e) => setDistillFidelity(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="ag">Agent grounding</Label>
          <Input
            id="ag"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={agentGrounding}
            onChange={(e) => setAgentGrounding(Number(e.target.value))}
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
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3 text-sm"
          >
            <div className="font-medium">{r.id}</div>
            <div className="text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              CoT {r.cotStepQuality} · Arabic {r.arabicFluency} · distill{" "}
              {r.distillFidelity} · ground {r.agentGrounding} · {r.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
