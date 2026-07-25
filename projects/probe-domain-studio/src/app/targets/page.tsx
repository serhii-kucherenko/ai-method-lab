"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = { id: string; label: string; status: string; kind?: string; [k: string]: string | number | undefined };

export function TargetsPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [label, setLabel] = useState("");
  const [sequenceHint, setSequenceHint] = useState("wt,bridge,physio");
  const [error, setError] = useState("");

  const load = async (query = q) => {
    try {
      setItems((await api<{ items: Row[] }>(`/api/targets?q=${encodeURIComponent(query)}`)).items);
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
      await api("/api/targets", {
        method: "POST",
        body: JSON.stringify({
          packId: "pack-demo",
          label,
          kind: "wild_type",
          sequenceHint,
          lengthNt: 48,
          bridgeFloor: 0.35,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  const archive = async (id: string) => {
    await api("/api/targets", { method: "POST", body: JSON.stringify({ action: "archive", id }) });
    await load();
  };

  return (
    <StudioShell title="Target sequences" subtitle="Register wild-type, SNP neighbor, and incomplete bridge targets for assay soft-sim.">
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="sequenceHint">Sequence hint</Label>
          <Input id="sequenceHint" value={sequenceHint} onChange={(e) => setSequenceHint(e.target.value)} required />
          <Button>Create target</Button>
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
                  <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">{row.kind} · {row.status}</p>
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

export default TargetsPage;
