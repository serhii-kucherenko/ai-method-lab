"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label: string };
type Row = Ref & { kind: string; status: string; siteHint?: string };

const KINDS = [
  "infant_under_12m",
  "toddler_12_24m",
  "preschool_24_59m",
  "mixed_under_5",
  "custom",
] as const;

export function CohortsPage() {
  const [packs, setPacks] = useState<Ref[]>([]);
  const [items, setItems] = useState<Row[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState<(typeof KINDS)[number]>("mixed_under_5");
  const [siteHint, setSiteHint] = useState("site-1");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [p, c] = await Promise.all([
        api<{ items: Ref[] }>("/api/packs"),
        api<{ items: Row[] }>("/api/cohorts"),
      ]);
      setPacks(p.items);
      setItems(c.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
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
      await api("/api/cohorts", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          siteHint,
          severityCeiling: 0.45,
          followUpFloor: 0.4,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Cohorts"
      subtitle="Define age bands and follow-up floors for child diarrhea growth soft-sims."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label>Pack</Label>
          <select className="w-full rounded-md border px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)}>
            {packs.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label>Kind</Label>
          <select className="w-full rounded-md border px-3 py-2 text-sm" value={kind} onChange={(e) => setKind(e.target.value as (typeof KINDS)[number])}>
            {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
          <Label htmlFor="site">Site hint</Label>
          <Input id="site" value={siteHint} onChange={(e) => setSiteHint(e.target.value)} required />
          <Button type="submit">Create cohort</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {row.kind} · {row.siteHint} · {row.status}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default CohortsPage;
