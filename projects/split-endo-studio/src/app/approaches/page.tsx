"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = { id: string; label: string; kind: string; status: string; portalHint: string };

export function ApproachesPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [label, setLabel] = useState("");
  const [packId, setPackId] = useState("pack-demo");
  const [portalHint, setPortalHint] = useState("one-hole-split");

  const load = async () => {
    try {
      setItems((await api<{ items: Row[] }>("/api/approaches")).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/approaches", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind: "one_hole_split",
          portalHint,
          bloodLossFloor: 0.4,
          recoveryFloor: 0.35,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Approaches"
      subtitle="Configure one-hole split endoscopy portal specs versus open laminectomy baselines."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="packId">Pack id</Label>
          <Input id="packId" value={packId} onChange={(e) => setPackId(e.target.value)} required />
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="portalHint">Portal hint</Label>
          <Input id="portalHint" value={portalHint} onChange={(e) => setPortalHint(e.target.value)} required />
          <Button type="submit">Create approach</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {row.kind} · {row.portalHint} · {row.status} · {row.id}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default ApproachesPage;
