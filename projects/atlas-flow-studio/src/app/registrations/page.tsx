"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Registration = {
  id: string;
  packId: string;
  label: string;
  kind: string;
  channelHint: string;
  status: string;
};

export function RegistrationsPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Registration[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Affine multimodal registration");
  const [kind, setKind] = useState("affine");
  const [channelHint, setChannelHint] = useState(
    "registration_fidelity,region_coverage,atlas_alignment",
  );
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [p, r] = await Promise.all([
      api<{ items: Pack[] }>("/api/atlases"),
      api<{ items: Registration[] }>(
        `/api/registrations?q=${encodeURIComponent(q)}`,
      ),
    ]);
    setPacks(p.items);
    setItems(r.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/registrations", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          channelHint,
          seriesCount: 3,
          fidelityMin: 0.4,
          fidelityMax: 0.9,
          metricHint: "Soft-sim registration fidelity cues",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Registrations"
      subtitle="Configure atlas registration kinds, channel cues, and fidelity bands."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder="Search registrations"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button variant="outline" onClick={() => load()}>
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Atlas pack</Label>
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
          <Input
            id="kind"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          />
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
          <Label htmlFor="channel">Channel hint</Label>
          <Input
            id="channel"
            value={channelHint}
            onChange={(e) => setChannelHint(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Create registration</Button>
          {error ? (
            <p className="mt-2 text-sm text-[var(--af-amber)]">{error}</p>
          ) : null}
        </div>
      </div>
      <ul className="space-y-2">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <p className="font-medium">{r.label}</p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {r.kind} · {r.channelHint} · {r.status}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default RegistrationsPage;
