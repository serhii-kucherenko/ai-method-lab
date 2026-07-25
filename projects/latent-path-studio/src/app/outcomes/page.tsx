"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Outcome = {
  id: string;
  label: string;
  outcomeChannel: string;
  lockCondition: string;
  status: string;
};

export function OutcomesPage() {
  const [items, setItems] = useState<Outcome[]>([]);
  const [q, setQ] = useState("");
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");

  const load = async (query = q) => {
    try {
      setItems(
        (
          await api<{ items: Outcome[] }>(
            `/api/outcomes?q=${encodeURIComponent(query)}`,
          )
        ).items,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load outcomes");
    }
  };

  useEffect(() => {
    void load("");
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/outcomes", {
        method: "POST",
        body: JSON.stringify({
          packId: "pack-demo",
          label,
          captureNotes: "Soft-sim outcome batch",
          lockCondition: "review",
          outcomeChannel: "soft_sim_latent_path",
        }),
      });
      setLabel("");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create outcome");
    }
  };

  return (
    <StudioShell
      title="Outcomes"
      subtitle="Register outcome batches and lock conditions for latent path soft-sim."
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
          <Button>Create outcome batch</Button>
        </form>
        <section>
          <div className="mb-4 flex gap-2">
            <Input
              aria-label="Search outcomes"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search outcomes"
            />
            <Button type="button" variant="outline" onClick={() => void load()}>
              Search
            </Button>
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <div className="space-y-3">
            {items.map((row) => (
              <article key={row.id} className="row-lift rounded-lg border bg-white p-4">
                <h2 className="font-semibold">{row.label}</h2>
                <p className="text-sm text-slate-600">
                  {row.outcomeChannel} · {row.lockCondition} · {row.status}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </StudioShell>
  );
}

export default OutcomesPage;
