"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = { id: string; label: string; status: string; kind?: string };

export function LineagesPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [label, setLabel] = useState("");
  const [mixHint, setMixHint] = useState("hepatocyte,stellate,cholangiocyte");

  const load = async (query = q) => {
    try {
      setItems(
        (
          await api<{ items: Row[] }>(
            `/api/lineages?q=${encodeURIComponent(query)}`,
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
      await api("/api/lineages", {
        method: "POST",
        body: JSON.stringify({
          label,
          kind: "stellate_include",
          mixHint,
          stellateFloor: 0.4,
          cholangiocyteFloor: 0.3,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Lineages"
      subtitle="Configure multicellular lineage mixes — hepatocyte, stellate, cholangiocyte soft-sim."
    >
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
          />
          <Label htmlFor="mix">Mix hint</Label>
          <Input
            id="mix"
            value={mixHint}
            onChange={(e) => setMixHint(e.target.value)}
          />
          <Button>Create lineage</Button>
        </form>
        <section>
          <div className="mb-4 flex gap-2">
            <Input
              aria-label="Search lineages"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Button type="button" onClick={() => void load()}>
              Search
            </Button>
          </div>
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          <ul className="space-y-3">
            {items.map((row) => (
              <li key={row.id} className="row-lift rounded-lg border bg-white p-4">
                <p className="font-semibold">{row.label}</p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
                  {row.kind} · {row.status}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </StudioShell>
  );
}

export default LineagesPage;
