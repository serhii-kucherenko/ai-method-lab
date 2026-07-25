"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Federation = {
  id: string;
  label: string;
  siteSummary: string;
  successCondition: string;
  status: string;
};

export default function FederationPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Federation[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [siteSummary, setSiteSummary] = useState(
    "Soft-sim hospital federation ring",
  );
  const [successCondition, setSuccessCondition] = useState("elevated");
  const [error, setError] = useState("");

  async function load() {
    const [p, f] = await Promise.all([
      api<{ items: Pack[] }>("/api/cohorts"),
      api<{ items: Federation[] }>("/api/federation"),
    ]);
    setPacks(p.items);
    setItems(f.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/federation", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label: label || "Untitled federation",
          siteSummary,
          successCondition,
          federationChannel: "soft_sim_federation",
        }),
      });
      setLabel("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Federation configs"
      subtitle="Record site rings and CVD risk success conditions."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Cohort pack</Label>
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
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="summary">Site summary</Label>
          <Input
            id="summary"
            value={siteSummary}
            onChange={(e) => setSiteSummary(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="success">Success condition</Label>
          <Input
            id="success"
            value={successCondition}
            onChange={(e) => setSuccessCondition(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={() => create()}>Create federation</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      <ul className="space-y-3">
        {items.map((f) => (
          <li
            key={f.id}
            className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <div className="font-medium">{f.label}</div>
            <div className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {f.siteSummary} · success {f.successCondition} · {f.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
