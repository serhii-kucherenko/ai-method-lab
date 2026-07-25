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
  scenarioText: string;
  regionChannel: string;
  status: string;
};

export default function ScenariosPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Scenario[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Sovereign infra water–energy scenario");
  const [scenarioText, setScenarioText] = useState(
    "Does sovereign-infra W/E/E accounting beat naive cloud-footprint baselines before lock?",
  );
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [p, s] = await Promise.all([
      api<{ items: Pack[] }>("/api/costs"),
      api<{ items: Scenario[] }>(`/api/scenarios?q=${encodeURIComponent(q)}`),
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
          scenarioText,
          successCondition: "lock_soft_sim",
          regionChannel: "soft_sim_sovereign_infra",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Scenarios"
      subtitle="Infrastructure scenarios that ask whether sovereign W/E/E accounting beats naive cloud footprints."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search scenarios"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button variant="outline" onClick={() => load().catch((e) => setError(String(e)))}>
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <div>
          <Label htmlFor="pack">Cost pack</Label>
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
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="text">Scenario text</Label>
          <Input
            id="text"
            value={scenarioText}
            onChange={(e) => setScenarioText(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={create}>Create scenario</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((s) => (
          <li
            key={s.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{s.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {s.regionChannel} · {s.status}
            </div>
            <p className="mt-1 text-sm">{s.scenarioText}</p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
