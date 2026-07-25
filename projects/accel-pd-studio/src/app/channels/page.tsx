"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Channel = {
  id: string;
  packId: string;
  label: string;
  kind: string;
  caseCount: number;
  status: string;
};

type Pack = { id: string; label: string };

export function ChannelsPage() {
  const [items, setItems] = useState<Channel[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Wrist multi-channel set");
  const [kind, setKind] = useState("wrist");
  const [error, setError] = useState("");

  async function load() {
    const [ch, pk] = await Promise.all([
      api<{ items: Channel[] }>(
        `/api/channels?q=${encodeURIComponent(q)}`,
      ),
      api<{ items: Pack[] }>("/api/accels"),
    ]);
    setItems(ch.items);
    setPacks(pk.items);
    if (!packId && pk.items[0]) setPackId(pk.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/channels", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          placementHint: "channel_coverage,activity_grounding",
          caseCount: 4,
          hardnessMin: 0.35,
          hardnessMax: 0.9,
          metricHint: "Wearable channel soft-sim metrics",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function archive(id: string) {
    await api("/api/channels", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  }

  return (
    <StudioShell
      title="Channels"
      subtitle="Wearable channel sets — wrist, hip, ankle, or multi-placement."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder="Search channels"
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
          <Label htmlFor="kind">Kind</Label>
          <select
            id="kind"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            {["wrist", "hip", "ankle", "multi", "custom"].map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={() => create()}>Create channel set</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      <ul className="space-y-2">
        {items.map((c) => (
          <li
            key={c.id}
            className="row-lift flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div>
              <p className="font-medium">{c.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {c.kind} · cases {c.caseCount} · {c.status}
              </p>
            </div>
            {c.status !== "archived" ? (
              <Button variant="outline" size="sm" onClick={() => archive(c.id)}>
                Archive
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default ChannelsPage;
