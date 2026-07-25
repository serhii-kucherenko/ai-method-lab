"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type PolicyRow = {
  id: string;
  packId?: string;
  label: string;
  policySummary: string;
  successCondition: string;
  actionChannel: string;
  status: string;
};

export default function PoliciesPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<PolicyRow[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Yield-then-merge action policy");
  const [policySummary, setPolicySummary] = useState(
    "Soft-sim dual-level world-cognitive action vs single-level reactive VLA.",
  );
  const [successCondition, setSuccessCondition] = useState("lock_soft_sim");
  const [actionChannel, setActionChannel] = useState("soft_sim_actions");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [p, l] = await Promise.all([
      api<{ items: Pack[] }>("/api/routes"),
      api<{ items: PolicyRow[] }>(
        `/api/policies?q=${encodeURIComponent(q)}`,
      ),
    ]);
    setPacks(p.items);
    setItems(l.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/policies", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          policySummary,
          successCondition,
          actionChannel,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Action policies"
      subtitle="Action policies that ride the world forecast before a pack lock."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search policies"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          onClick={() => load().catch((e) => setError(String(e)))}
        >
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Route pack</Label>
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
          <Label htmlFor="label">Policy name</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="summary">Policy summary</Label>
          <Input
            id="summary"
            value={policySummary}
            onChange={(e) => setPolicySummary(e.target.value)}
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
        <div>
          <Label htmlFor="channel">Action channel</Label>
          <Input
            id="channel"
            value={actionChannel}
            onChange={(e) => setActionChannel(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Create action policy</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((row) => (
          <li
            key={row.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{row.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {row.policySummary}
            </div>
            <div className="mt-1 text-xs text-[color-mix(in_srgb,var(--studio-ink)_45%,transparent)]">
              {row.successCondition} · {row.actionChannel} · {row.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
