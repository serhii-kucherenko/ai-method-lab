"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Policy = {
  id: string;
  label: string;
  kind: string;
  packId: string;
  status: string;
  recipeHint: string;
};

const KINDS = [
  "audit_recipe",
  "escalation",
  "red_team",
  "disclosure",
  "custom",
] as const;

export function PoliciesPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Policy[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState<(typeof KINDS)[number]>("audit_recipe");
  const [recipeHint, setHint] = useState("policy_completeness,escalation");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [p, list] = await Promise.all([
        api<{ items: Pack[] }>("/api/packs"),
        api<{ items: Policy[] }>(
          `/api/policies?q=${encodeURIComponent(q)}`,
        ),
      ]);
      setPacks(p.items);
      setItems(list.items);
      if (!packId && p.items[0]) setPackId(p.items[0].id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load policies");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/policies", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          recipeHint,
          controlCount: 3,
          severityFloor: 0.3,
        }),
      });
      setLabel("");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create policy");
    }
  };

  return (
    <StudioShell
      title="Policy recipes"
      subtitle="Configure audit recipes, escalation, and disclosure controls."
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
          <Label htmlFor="hint">Recipe hint</Label>
          <Input
            id="hint"
            value={recipeHint}
            onChange={(e) => setHint(e.target.value)}
          />
          <Button>Create policy</Button>
        </form>
        <section>
          <div className="mb-4 flex gap-2">
            <Input
              aria-label="Search policies"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search policies"
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
                  {row.kind} · {row.recipeHint} · {row.status}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </StudioShell>
  );
}

export default PoliciesPage;
