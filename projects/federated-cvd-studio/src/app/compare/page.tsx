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
  federatedCvdRisk: { overall: number };
  centralizedBaseline: { overall: number };
};

export default function ComparePage() {
  const [federations, setFederations] = useState<Entity[]>([]);
  const [schemas, setSchemas] = useState<Entity[]>([]);
  const [runs, setRuns] = useState<Entity[]>([]);
  const [items, setItems] = useState<Compare[]>([]);
  const [name, setName] = useState("Federated vs centralized compare");
  const [federationId, setFederationId] = useState("");
  const [schemaId, setSchemaId] = useState("");
  const [runId, setRunId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [f, s, r, cmp] = await Promise.all([
      api<{ items: Entity[] }>("/api/federation"),
      api<{ items: Entity[] }>("/api/features?kind=schemas"),
      api<{ items: Entity[] }>("/api/runs"),
      api<{ items: Compare[] }>("/api/compare"),
    ]);
    setFederations(f.items);
    setSchemas(s.items);
    setRuns(r.items);
    setItems(cmp.items);
    if (!federationId && f.items[0]) setFederationId(f.items[0].id);
    if (!schemaId && s.items[0]) setSchemaId(s.items[0].id);
    if (!runId && r.items[0]) setRunId(r.items[0].id);
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
          federationId,
          schemaId,
          runId,
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
      subtitle="Federated CVD risk vs centralized baseline."
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
          <Label htmlFor="fed">Federation config</Label>
          <select
            id="fed"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={federationId}
            onChange={(e) => setFederationId(e.target.value)}
          >
            {federations.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label ?? c.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="schema">Feature schema</Label>
          <select
            id="schema"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={schemaId}
            onChange={(e) => setSchemaId(e.target.value)}
          >
            {schemas.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="run">CVD run</Label>
          <select
            id="run"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={runId}
            onChange={(e) => setRunId(e.target.value)}
          >
            {runs.map((d) => (
              <option key={d.id} value={d.id}>
                {d.id}
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
                    Federated CVD risk
                  </div>
                  <div className="mt-1 h-2 rounded bg-[var(--fc-mist)]">
                    <div
                      className="score-bar h-2 rounded bg-[var(--fc-teal)]"
                      style={{
                        width: `${c.federatedCvdRisk.overall}%`,
                      }}
                    />
                  </div>
                  <div className="mt-1 text-sm">
                    {c.federatedCvdRisk.overall}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                    Centralized baseline
                  </div>
                  <div className="mt-1 h-2 rounded bg-[var(--fc-mist)]">
                    <div
                      className="score-bar h-2 rounded bg-[var(--fc-rose)]"
                      style={{ width: `${c.centralizedBaseline.overall}%` }}
                    />
                  </div>
                  <div className="mt-1 text-sm">
                    {c.centralizedBaseline.overall}
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
