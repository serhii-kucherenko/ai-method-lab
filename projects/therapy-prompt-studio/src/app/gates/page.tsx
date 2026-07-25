"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Gate = {
  id: string;
  label: string;
  architecture: string;
  gateChannel: string;
  status: string;
};

export function GatesPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Gate[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Structured therapy-safety gate set");
  const [architecture, setArchitecture] = useState(
    "Refusal + crisis escalation + boundary soft-sim",
  );
  const [error, setError] = useState("");

  async function load() {
    const [p, g] = await Promise.all([
      api<{ items: Pack[] }>("/api/prompts"),
      api<{ items: Gate[] }>(`/api/gates?q=${encodeURIComponent(q)}`),
    ]);
    setPacks(p.items);
    setItems(g.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/gates", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          architecture,
          lockCondition: "lock_soft_sim",
          gateChannel: "soft_sim_therapy_gate_signal",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function archive(id: string) {
    await api("/api/gates", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  }

  return (
    <StudioShell
      title="Gates"
      subtitle="Structured therapy-safety gates — refusal, escalation, and boundary channels."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder="Search gates"
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
          <Label htmlFor="label">Gate label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="arch">Architecture</Label>
          <Input
            id="arch"
            value={architecture}
            onChange={(e) => setArchitecture(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={() => create()}>Add safety gate</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      <ul className="space-y-2">
        {items.map((g) => (
          <li
            key={g.id}
            className="row-lift flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div>
              <p className="font-medium">{g.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {g.architecture} · {g.gateChannel} · {g.status}
              </p>
            </div>
            {g.status !== "archived" ? (
              <Button variant="outline" size="sm" onClick={() => archive(g.id)}>
                Archive
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default GatesPage;
