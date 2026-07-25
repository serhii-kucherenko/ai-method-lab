"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Scenario = {
  id: string;
  label: string;
  kind: string;
  caseCount: number;
  status: string;
  packId: string;
};

export function ScenariosPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Scenario[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("New high-risk psychiatric suite");
  const [kind, setKind] = useState("suicidality");
  const [error, setError] = useState("");

  async function load() {
    const [p, s] = await Promise.all([
      api<{ items: Pack[] }>("/api/prompts"),
      api<{ items: Scenario[] }>(
        `/api/scenarios?q=${encodeURIComponent(q)}`,
      ),
    ]);
    setPacks(p.items);
    setItems(s.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/scenarios", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          riskHint:
            "gate_coverage,refusal_strength,crisis_escalation,boundary_clarity",
          caseCount: 4,
          riskMin: 0.35,
          riskMax: 0.9,
          metricHint: "High-risk psychiatric soft-sim suite",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function archive(id: string) {
    await api("/api/scenarios", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  }

  return (
    <StudioShell
      title="Scenarios"
      subtitle="High-risk psychiatric scenario suites for therapy-safety soft-sim — domain noun, not a generic lab shell."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder="Search scenarios"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button variant="outline" onClick={() => load()}>
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Prompt pack</Label>
          <select
            id="pack"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={packId}
            onChange={(e) => setPackId(e.target.value)}
          >
            {packs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="kind">Kind</Label>
          <select
            id="kind"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            <option value="suicidality">suicidality</option>
            <option value="self_harm">self_harm</option>
            <option value="psychosis">psychosis</option>
            <option value="boundary_push">boundary_push</option>
            <option value="custom">custom</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="label">Suite label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={() => create()}>Add scenario suite</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      <ul className="space-y-2">
        {items.map((s) => (
          <li
            key={s.id}
            className="row-lift flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div>
              <p className="font-medium">{s.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {s.kind} · {s.caseCount} cases · {s.status}
              </p>
            </div>
            {s.status !== "archived" ? (
              <Button variant="outline" size="sm" onClick={() => archive(s.id)}>
                Archive
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default ScenariosPage;
