"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type LabelRow = {
  id: string;
  label: string;
  kind: string;
  packId: string;
  status: string;
  channelHint: string;
};

export function LabelsPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<LabelRow[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("DAS28 activity set");
  const [kind, setKind] = useState("das28");
  const [channelHint, setChannelHint] = useState(
    "clinician_agreement,activity_signal,ehr_completeness",
  );
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [p, l] = await Promise.all([
      api<{ items: Pack[] }>("/api/colearns"),
      api<{ items: LabelRow[] }>(`/api/labels?q=${encodeURIComponent(q)}`),
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
      await api("/api/labels", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          channelHint,
          seriesCount: 3,
          fidelityMin: 0.4,
          fidelityMax: 0.9,
          metricHint: "Disease activity soft-sim channels",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function archive(id: string) {
    await api("/api/labels", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  }

  return (
    <StudioShell
      title="Labels"
      subtitle="Disease activity label sets linked to colearn packs."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder="Search labels"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button variant="outline" onClick={() => load()}>
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Colearn pack</Label>
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
            <option value="das28">das28</option>
            <option value="cadai">cadai</option>
            <option value="rapidity">rapidity</option>
            <option value="composite">composite</option>
            <option value="custom">custom</option>
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
          <Label htmlFor="channel">Channel hint</Label>
          <Input
            id="channel"
            value={channelHint}
            onChange={(e) => setChannelHint(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Create label set</Button>
          {error ? (
            <p className="mt-2 text-sm text-[var(--sc-amber)]">{error}</p>
          ) : null}
        </div>
      </div>
      <ul className="space-y-2">
        {items.map((row) => (
          <li
            key={row.id}
            className="row-lift flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div>
              <p className="font-medium">
                {row.label}{" "}
                <span className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_50%,transparent)]">
                  {row.kind}
                </span>
              </p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {row.channelHint} · {row.status}
              </p>
            </div>
            {row.status !== "archived" ? (
              <Button variant="outline" onClick={() => archive(row.id)}>
                Archive
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default LabelsPage;
