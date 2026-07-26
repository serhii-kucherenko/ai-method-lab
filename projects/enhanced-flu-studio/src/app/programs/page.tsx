"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = Record<string, string | number | undefined> & {
  id: string;
  label: string;
  status: string;
};

export function Page() {
  const [items, setItems] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("pack-demo");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("expanded_eiv_65plus");
  const [eivHint, setEivHint] = useState("high-dose-adjuvanted-mix");

  const load = async (query = q) => {
    try {
      setItems(
        (
          await api<{ items: Row[] }>(
            `/api/programs?q=${encodeURIComponent(query)}`,
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
      await api("/api/programs", {
        method: "POST",
        body: JSON.stringify({ packId, label, kind, eivHint, eivFloor: 0.45, stickinessCeiling: 0.35 }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  const archive = async (id: string) => {
    await api("/api/programs", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  };

  return (
    <StudioShell title="Programs" subtitle="Design expanded enhanced influenza vaccine program specs — soft-sim only, not clinical prescribing.">
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="packId">Pack id</Label>
          <Input id="packId" value={packId} onChange={(e) => setPackId(e.target.value)} required />
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Program kind</Label>
          <Input id="kind" value={kind} onChange={(e) => setKind(e.target.value)} required />
          <Label htmlFor="eivHint">EIV hint</Label>
          <Input id="eivHint" value={eivHint} onChange={(e) => setEivHint(e.target.value)} required />
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
                    {row.kind as string} · {row.eivHint as string} · {row.status}
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

export default Page;
