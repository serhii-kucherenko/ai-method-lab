"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Sensor = {
  id: string;
  packId: string;
  label: string;
  kind: string;
  channels: string;
  channelCount: number;
  status: string;
};

type Pack = { id: string; label: string };

export default function SensorsPage() {
  const [items, setItems] = useState<Sensor[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("FolioClip multimodal leaf clip");
  const [kind, setKind] = useState("leaf_clip");
  const [channels, setChannels] = useState(
    "temp,humidity,spectral,impedance",
  );
  const [channelCount, setChannelCount] = useState("4");
  const [error, setError] = useState("");

  async function load() {
    const [sensors, ps] = await Promise.all([
      api<{ items: Sensor[] }>("/api/sensors"),
      api<{ items: Pack[] }>("/api/clips"),
    ]);
    setItems(sensors.items);
    setPacks(ps.items);
    if (!packId && ps.items[0]) setPackId(ps.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/sensors", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          channels,
          channelCount: Number(channelCount),
          coverageMin: 0.4,
          coverageMax: 0.9,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Sensor configs"
      subtitle="Configure multimodal wearable sensors with channels and coverage spans."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Clip pack</Label>
          <select
            id="pack"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
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
        <div>
          <Label htmlFor="kind">Kind</Label>
          <select
            id="kind"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            {[
              "leaf_clip",
              "stem_band",
              "canopy_probe",
              "petiole_pad",
              "mixed",
            ].map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="count">Channel count</Label>
          <Input
            id="count"
            value={channelCount}
            onChange={(e) => setChannelCount(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="channels">Channels</Label>
          <Input
            id="channels"
            value={channels}
            onChange={(e) => setChannels(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={create}>Create sensor</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((c) => (
          <li
            key={c.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{c.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {c.kind} · {c.channelCount} channels · {c.channels} · {c.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
