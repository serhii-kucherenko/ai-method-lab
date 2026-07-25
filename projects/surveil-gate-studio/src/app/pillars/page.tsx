"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Pillar = {
  id: string;
  label: string;
  kind: string;
  packId: string;
  status: string;
  coverageHint: string;
};

const KINDS = [
  "transparency",
  "accountability",
  "equity",
  "safety",
  "privacy",
  "public_trust",
  "custom",
] as const;

export function PillarsPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Pillar[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState<(typeof KINDS)[number]>("public_trust");
  const [coverageHint, setHint] = useState("pillar_coverage,equity");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [p, list] = await Promise.all([
        api<{ items: Pack[] }>("/api/packs"),
        api<{ items: Pillar[] }>(
          `/api/pillars?q=${encodeURIComponent(q)}`,
        ),
      ]);
      setPacks(p.items);
      setItems(list.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load pillars");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/pillars", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          coverageHint,
          caseCount: 4,
          hardnessMin: 0.3,
          hardnessMax: 0.9,
        }),
      });
      setLabel("");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create pillar");
    }
  };

  return (
    <StudioShell
      title="Governance pillars"
      subtitle="Configure six-pillar coverage assumptions for soft-sim surveillance packs."
    >
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label>Pack</Label>
          <select
            className="w-full rounded-md border p-2"
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
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
          />
          <Label>Kind</Label>
          <select
            className="w-full rounded-md border p-2"
            value={kind}
            onChange={(e) =>
              setKind(e.target.value as (typeof KINDS)[number])
            }
          >
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
          <Label htmlFor="hint">Coverage hint</Label>
          <Input
            id="hint"
            value={coverageHint}
            onChange={(e) => setHint(e.target.value)}
          />
          <Button>Create pillar</Button>
        </form>
        <section>
          <div className="mb-4 flex gap-2">
            <Input
              aria-label="Search pillars"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search pillars"
            />
            <Button type="button" variant="outline" onClick={() => void load()}>
              Search
            </Button>
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <div className="space-y-3">
            {items.map((row) => (
              <article
                key={row.id}
                className="row-lift rounded-lg border bg-white p-4"
              >
                <h2 className="font-semibold">{row.label}</h2>
                <p className="text-sm text-slate-600">
                  {row.kind} · {row.coverageHint} · {row.status}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </StudioShell>
  );
}

export default PillarsPage;
