"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Repr = {
  id: string;
  label: string;
  architecture: string;
  lockCondition: string;
  signalChannel: string;
  status: string;
};

type Pack = { id: string; label: string };

export function RepresentationsPage() {
  const [items, setItems] = useState<Repr[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("PA representation set");
  const [architecture, setArchitecture] = useState(
    "Multi-channel PA transformer soft-sim",
  );
  const [error, setError] = useState("");

  async function load() {
    const [rep, pk] = await Promise.all([
      api<{ items: Repr[] }>(
        `/api/representations?q=${encodeURIComponent(q)}`,
      ),
      api<{ items: Pack[] }>("/api/accels"),
    ]);
    setItems(rep.items);
    setPacks(pk.items);
    if (!packId && pk.items[0]) setPackId(pk.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/representations", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          architecture,
          lockCondition: "lock_soft_sim",
          signalChannel: "soft_sim_accel_pa_signal",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function archive(id: string) {
    await api("/api/representations", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  }

  return (
    <StudioShell
      title="Representations"
      subtitle="PA representation registries with lock conditions for soft-sim honesty."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder="Search representations"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button variant="outline" onClick={() => load()}>
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Accel pack</Label>
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
          <Label htmlFor="arch">Architecture</Label>
          <Input
            id="arch"
            value={architecture}
            onChange={(e) => setArchitecture(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={() => create()}>Create representation</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      <ul className="space-y-2">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div>
              <p className="font-medium">{r.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {r.architecture} · {r.lockCondition} · {r.status}
              </p>
            </div>
            {r.status !== "archived" ? (
              <Button variant="outline" size="sm" onClick={() => archive(r.id)}>
                Archive
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default RepresentationsPage;
