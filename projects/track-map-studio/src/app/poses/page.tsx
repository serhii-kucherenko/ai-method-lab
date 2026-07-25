"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Pose = {
  id: string;
  packId: string;
  label: string;
  kind: string;
  poseHint: string;
  caseCount: number;
  status: string;
};

export function PosesPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Pose[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Motion-aware pose config");
  const [kind, setKind] = useState("motion_aware");
  const [poseHint, setPoseHint] = useState("deform_coverage,pose_grounding");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [p, poses] = await Promise.all([
      api<{ items: Pack[] }>("/api/tracks"),
      api<{ items: Pose[] }>(`/api/poses?q=${encodeURIComponent(q)}`),
    ]);
    setPacks(p.items);
    setItems(poses.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/poses", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          poseHint,
          caseCount: 4,
          hardnessMin: 0.3,
          hardnessMax: 0.9,
          metricHint: "pose soft-sim honesty",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function archive(id: string) {
    await api("/api/poses", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  }

  return (
    <StudioShell
      title="Poses"
      subtitle="Motion-aware pose optimization configs for deformable track packs."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder="Search poses"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button variant="outline" onClick={() => load()}>
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Track pack</Label>
          <select
            id="pack"
            className="flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-transparent px-3 text-sm"
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
          <Label htmlFor="kind">Pose kind</Label>
          <select
            id="kind"
            className="flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-transparent px-3 text-sm"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            <option value="motion_aware">motion_aware</option>
            <option value="stereo_bundle">stereo_bundle</option>
            <option value="tool_tip">tool_tip</option>
            <option value="custom">custom</option>
          </select>
        </div>
        <div>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="hint">Pose hint</Label>
          <Input id="hint" value={poseHint} onChange={(e) => setPoseHint(e.target.value)} />
        </div>
        <div>
          <Button onClick={() => create()}>Create pose config</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((m) => (
          <li
            key={m.id}
            className="row-lift flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div>
              <p className="font-medium">{m.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {m.kind} · cases {m.caseCount} · {m.poseHint} · {m.status}
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

export default PosesPage;
