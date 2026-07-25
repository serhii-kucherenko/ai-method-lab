"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  label: string;
  status: string;
  kind?: string | number;
  pryHint?: string | number;
};

export function PeptidesPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("pde_pry");
  const [pryHint, setPryHint] = useState("");
  const [pryFloor, setPryFloor] = useState("0.4");
  const [systolicFloor, setSystolicFloor] = useState("0.5");

  const load = async (query = q) => {
    try {
      setItems(
        (await api<{ items: Row[] }>(`/api/peptides?q=${encodeURIComponent(query)}`))
          .items,
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
      await api("/api/peptides", {
        method: "POST",
        body: JSON.stringify({ label, kind, pryHint, pryFloor: Number(pryFloor), systolicFloor: Number(systolicFloor) }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  const archive = async (id: string) => {
    await api("/api/peptides", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  };

  return (
    <StudioShell title="Peptides" subtitle="Configure PDE pry strength and systolic preservation floors for soft-sim.">
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
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
          <Label htmlFor="pryHint">Pry hint</Label>
          <Input
            id="pryHint"
            value={pryHint}
            onChange={(e) => setPryHint(e.target.value)}
            required
          />
          <Label htmlFor="pryFloor">Pry floor</Label>
          <Input
            id="pryFloor"
            value={pryFloor}
            onChange={(e) => setPryFloor(e.target.value)}
            required
          />
          <Label htmlFor="systolicFloor">Systolic floor</Label>
          <Input
            id="systolicFloor"
            value={systolicFloor}
            onChange={(e) => setSystolicFloor(e.target.value)}
            required
          />
          <Button>Create</Button>
        </form>
        <section>
          <div className="mb-4 flex gap-2">
            <Input aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} />
            <Button type="button" onClick={() => void load()}>Search</Button>
          </div>
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          <ul className="space-y-3">
            {items.map((row) => (
              <li key={row.id} className="row-lift flex items-center justify-between rounded-lg border bg-white p-4">
                <div>
                  <p className="font-semibold">{row.label}</p>
                  <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                    {row.status} · {String(row.kind ?? "")} · {String(row.pryHint ?? "")}
                  </p>
                </div>
                {row.status !== "archived" ? (
                  <Button type="button" variant="outline" onClick={() => void archive(row.id)}>
                    Archive
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </StudioShell>
  );
}

export default PeptidesPage;
