"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Wearer = {
  id: string;
  label: string;
  kind: string;
  status: string;
  packId: string;
};

const KINDS = ["hmd_wearer", "body_proxy", "mixed_rig", "custom"] as const;

export function WearersPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Wearer[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState<(typeof KINDS)[number]>("hmd_wearer");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  const load = async (query = q) => {
    try {
      const [p, w] = await Promise.all([
        api<{ items: Pack[] }>("/api/captures"),
        api<{ items: Wearer[] }>(
          `/api/wearers?q=${encodeURIComponent(query)}`,
        ),
      ]);
      setPacks(p.items);
      setItems(w.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load wearers");
    }
  };

  useEffect(() => {
    void load("");
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/wearers", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          egoHint: "ego_coverage",
          caseCount: 2,
          hardnessMin: 0.2,
          hardnessMax: 0.8,
        }),
      });
      setLabel("");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create wearer");
    }
  };

  return (
    <StudioShell
      title="Wearers"
      subtitle="Configure HMD wearers and ego coverage assumptions."
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
          <Button>Create wearer</Button>
        </form>
        <section>
          <div className="mb-4 flex gap-2">
            <Input
              aria-label="Search wearers"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search wearers"
            />
            <Button type="button" variant="outline" onClick={() => void load()}>
              Search
            </Button>
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <div className="space-y-3">
            {items.map((w) => (
              <article
                key={w.id}
                className="row-lift rounded-lg border bg-white p-4"
              >
                <h2 className="font-semibold">{w.label}</h2>
                <p className="text-sm text-slate-600">
                  {w.kind} · {w.status}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </StudioShell>
  );
}

export default WearersPage;
