"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type ClassificationRow = {
  id: string;
  packId: string;
  label: string;
  kind: string;
  channelHint: string;
  status: string;
};

export function ClassificationsPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<ClassificationRow[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Syndromic + lab hybrid signal");
  const [kind, setKind] = useState("hybrid_signal");
  const [channelHint, setChannelHint] = useState(
    "signal_clarity,case_velocity,geo_spread,lab_confirm",
  );
  const [error, setError] = useState("");

  async function load() {
    const [p, g] = await Promise.all([
      api<{ items: Pack[] }>("/api/escalates"),
      api<{ items: ClassificationRow[] }>(
        `/api/classifications?q=${encodeURIComponent(q)}`,
      ),
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
      await api("/api/classifications", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          channelHint,
          seriesCount: 4,
          fidelityMin: 0.4,
          fidelityMax: 0.9,
          metricHint: "Case velocity / geo / lab soft-sim channels",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function archive(id: string) {
    await api("/api/classifications", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  }

  return (
    <StudioShell
      title="Classifications"
      subtitle="Classification rules — case velocity, geo cluster, lab confirm, and hybrid signals."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder="Search classifications"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button variant="outline" onClick={() => load()}>
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Escalate pack</Label>
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
          <Label htmlFor="channels">Channel hint</Label>
          <Input
            id="channels"
            value={channelHint}
            onChange={(e) => setChannelHint(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={create}>Create classification</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((m) => (
          <li
            key={m.id}
            className="row-lift flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div>
              <div className="font-medium">
                {m.label} · {m.kind}
              </div>
              <p className="text-sm">
                {m.channelHint} · {m.status}
              </p>
            </div>
            {m.status !== "archived" ? (
              <Button variant="outline" size="sm" onClick={() => archive(m.id)}>
                Archive
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default ClassificationsPage;
