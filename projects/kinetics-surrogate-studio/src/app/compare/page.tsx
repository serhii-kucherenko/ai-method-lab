"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Entity = { id: string; label?: string };
type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  entropyConstrained: { overall: number };
  fullRateBaseline: { overall: number };
};

export default function ComparePage() {
  const [surrogates, setSurrogates] = useState<Entity[]>([]);
  const [rates, setRates] = useState<Entity[]>([]);
  const [runs, setRuns] = useState<Entity[]>([]);
  const [items, setItems] = useState<Compare[]>([]);
  const [name, setName] = useState("Entropy surrogate vs full-rate compare");
  const [surrogateId, setSurrogateId] = useState("");
  const [rateTableId, setRateTableId] = useState("");
  const [kineticsRunId, setKineticsRunId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [s, a, r, c] = await Promise.all([
      api<{ items: Entity[] }>("/api/surrogates"),
      api<{ items: Entity[] }>("/api/rates"),
      api<{ items: Entity[] }>("/api/runs"),
      api<{ items: Compare[] }>("/api/compare"),
    ]);
    setSurrogates(s.items);
    setRates(a.items);
    setRuns(r.items);
    setItems(c.items);
    if (!surrogateId && s.items[0]) setSurrogateId(s.items[0].id);
    if (!rateTableId && a.items[0]) setRateTableId(a.items[0].id);
    if (!kineticsRunId && r.items[0]) setKineticsRunId(r.items[0].id);
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
          surrogateId,
          rateTableId,
          kineticsRunId,
          bias: "balanced",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="A/B compare"
      subtitle="Entropy-constrained surrogate vs full-rate / unconstrained baseline."
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
          <Label htmlFor="surrogate">Surrogate config</Label>
          <select
            id="surrogate"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={surrogateId}
            onChange={(e) => setSurrogateId(e.target.value)}
          >
            {surrogates.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="rate">Rate table</Label>
          <select
            id="rate"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={rateTableId}
            onChange={(e) => setRateTableId(e.target.value)}
          >
            {rates.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label ?? a.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="run">Kinetics run</Label>
          <select
            id="run"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={kineticsRunId}
            onChange={(e) => setKineticsRunId(e.target.value)}
          >
            {runs.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <Button onClick={() => run()}>Run A/B compare</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
          No compares yet — run one above.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((c) => (
            <li
              key={c.id}
              className="rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
            >
              <div className="font-medium text-[var(--studio-ink)]">{c.name}</div>
              <div className="mt-2 grid gap-2 md:grid-cols-3">
                <div>
                  <div className="text-xs text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                    Entropy-constrained
                  </div>
                  <div className="mt-1 h-2 rounded bg-[var(--ks-ash)]">
                    <div
                      className="score-bar h-2 rounded bg-[var(--ks-amber)]"
                      style={{ width: `${c.entropyConstrained.overall}%` }}
                    />
                  </div>
                  <div className="mt-1 text-sm">
                    {c.entropyConstrained.overall}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                    Full-rate baseline
                  </div>
                  <div className="mt-1 h-2 rounded bg-[var(--ks-ash)]">
                    <div
                      className="score-bar h-2 rounded bg-[var(--ks-teal)]"
                      style={{ width: `${c.fullRateBaseline.overall}%` }}
                    />
                  </div>
                  <div className="mt-1 text-sm">
                    {c.fullRateBaseline.overall}
                  </div>
                </div>
                <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
                  winner <strong>{c.winner}</strong> · gap {c.gap}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
