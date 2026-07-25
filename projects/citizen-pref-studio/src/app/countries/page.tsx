"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = { id: string; label: string; status: string; [k: string]: string | number };

export function CountriesPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("pack-demo");
  const [label, setLabel] = useState("");
  const [region, setRegion] = useState("multi_country");
  const [countryHint, setCountryHint] = useState("seven_country");
  const [strataCount, setStrataCount] = useState(7);
  const [prefMin, setPrefMin] = useState(0.4);
  const [prefMax, setPrefMax] = useState(0.9);
  const [error, setError] = useState("");

  const load = async (query = q) => {
    try {
      setItems(
        (
          await api<{ items: Row[] }>(
            `/api/countries?q=${encodeURIComponent(query)}`,
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
      await api("/api/countries", {
        method: "POST",
        body: JSON.stringify({ packId, label, region, countryHint, strataCount, prefMin, prefMax }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  const archive = async (id: string) => {
    await api("/api/countries", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  };

  return (
    <StudioShell title="Country cohorts" subtitle="Multi-country preference cohorts with soft-sim preference bounds.">
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
          <Label htmlFor="region">Region</Label>
          <Input
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            required
          />
          <Label htmlFor="countryHint">Country hint</Label>
          <Input
            id="countryHint"
            value={countryHint}
            onChange={(e) => setCountryHint(e.target.value)}
            required
          />
          <Label htmlFor="strataCount">Strata</Label>
          <Input
            id="strataCount"
            value={strataCount}
            onChange={(e) => setStrataCount(Number(e.target.value))}
            required
          />
          <Label htmlFor="prefMin">Pref min</Label>
          <Input
            id="prefMin"
            value={prefMin}
            onChange={(e) => setPrefMin(Number(e.target.value))}
            required
          />
          <Label htmlFor="prefMax">Pref max</Label>
          <Input
            id="prefMax"
            value={prefMax}
            onChange={(e) => setPrefMax(Number(e.target.value))}
            required
          />
          <Button>Create country</Button>
          <p className="text-xs text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">Soft-sim only — not certified polling.</p>
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
                  <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">Country cohort · {row.status}</p>
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

export default CountriesPage;
