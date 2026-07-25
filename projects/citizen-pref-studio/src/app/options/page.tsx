"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = { id: string; label: string; status: string; [k: string]: string | number };

export function OptionsPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("pack-demo");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("public_oversight");
  const [oversightHint, setOversightHint] = useState("agency_review");
  const [attributeCount, setAttributeCount] = useState(5);
  const [safetyFloor, setSafetyFloor] = useState(0.4);
  const [error, setError] = useState("");

  const load = async (query = q) => {
    try {
      setItems(
        (
          await api<{ items: Row[] }>(
            `/api/options?q=${encodeURIComponent(query)}`,
          )
        ).items,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  };

  useEffect(() => {
    void load("");
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/options", {
        method: "POST",
        body: JSON.stringify({ packId, label, kind, oversightHint, attributeCount, safetyFloor }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  const archive = async (id: string) => {
    await api("/api/options", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  };

  return (
    <StudioShell title="Regulatory options" subtitle="Configure conjoint-style regulatory options with safety floors.">
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="packId">Pack id</Label>
          <Input
            id="packId"
            value={packId}
            onChange={(e) => setPackId(e.target.value)}
            required
          />
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
          />
          <Label htmlFor="kind">Kind</Label>
          <Input
            id="kind"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            required
          />
          <Label htmlFor="oversightHint">Oversight hint</Label>
          <Input
            id="oversightHint"
            value={oversightHint}
            onChange={(e) => setOversightHint(e.target.value)}
            required
          />
          <Label htmlFor="attributeCount">Attributes</Label>
          <Input
            id="attributeCount"
            value={attributeCount}
            onChange={(e) => setAttributeCount(Number(e.target.value))}
            required
          />
          <Label htmlFor="safetyFloor">Safety floor</Label>
          <Input
            id="safetyFloor"
            value={safetyFloor}
            onChange={(e) => setSafetyFloor(Number(e.target.value))}
            required
          />
          <Button>Create option</Button>
          <p className="text-xs text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">Use pack-demo or a pack id from /packs.</p>
        </form>
        <section>
          <div className="mb-4 flex gap-2">
            <Input aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} />
            <Button type="button" onClick={() => void load()}>Search</Button>
          </div>
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          <ul className="space-y-3">
            {items.map((row) => (
              <li key={row.id} className="row-lift flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white p-4">
                <div>
                  <p className="font-semibold">{row.label}</p>
                  <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">Option · {row.status}</p>
                </div>
                <Button type="button" variant="outline" onClick={() => void archive(row.id)}>Archive</Button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </StudioShell>
  );
}

export default OptionsPage;
