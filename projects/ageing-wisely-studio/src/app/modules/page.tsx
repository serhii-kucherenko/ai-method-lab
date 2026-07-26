"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = Record<string, string | number | undefined> & { id: string; label: string; status: string };
type Pack = { id: string; label: string };

export function ModulesPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("behavioral_activation");
  const [pathHint, setPathHint] = useState("");
  const [engagementFloor, setEngagementFloor] = useState("0.4");
  const [dropoutCeiling, setDropoutCeiling] = useState("0.35");

  const load = async (query = q) => {
    try {
      const [modules, packList] = await Promise.all([
        api<{ items: Row[] }>(`/api/modules?q=${encodeURIComponent(query)}`),
        api<{ items: Pack[] }>("/api/packs"),
      ]);
      setItems(modules.items);
      setPacks(packList.items);
      if (!packId && packList.items[0]) setPackId(packList.items[0].id);
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
      await api("/api/modules", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          pathHint,
          engagementFloor: Number(engagementFloor),
          dropoutCeiling: Number(dropoutCeiling),
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  const archive = async (id: string) => {
    await api("/api/modules", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  };

  return (
    <StudioShell
      title="Modules"
      subtitle="Configure internet CBT module paths for older-adult soft-sim — not live therapist delivery."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="pack">Pack</Label>
          <select
            id="pack"
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={packId}
            onChange={(e) => setPackId(e.target.value)}
          >
            {packs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Kind</Label>
          <Input id="kind" value={kind} onChange={(e) => setKind(e.target.value)} required />
          <Label htmlFor="path">Path hint</Label>
          <Input id="path" value={pathHint} onChange={(e) => setPathHint(e.target.value)} required />
          <Label htmlFor="engagement">Engagement floor</Label>
          <Input id="engagement" value={engagementFloor} onChange={(e) => setEngagementFloor(e.target.value)} />
          <Label htmlFor="dropout">Dropout ceiling</Label>
          <Input id="dropout" value={dropoutCeiling} onChange={(e) => setDropoutCeiling(e.target.value)} />
          <Button type="submit">Create</Button>
        </form>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
            <Button type="button" variant="outline" onClick={() => void load()}>
              Search
            </Button>
          </div>
          <ul className="space-y-2">
            {items.map((row) => (
              <li key={row.id} className="row-lift flex items-center justify-between rounded-lg border bg-white px-4 py-3">
                <div>
                  <p className="font-medium">{row.label}</p>
                  <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                    {row.kind as string} · {row.status}
                  </p>
                </div>
                <Button type="button" variant="outline" onClick={() => void archive(row.id)}>
                  Archive
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}

export default ModulesPage;
