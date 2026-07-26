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

export function PacksPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [label, setLabel] = useState("");
  const [version, setVersion] = useState("1.0");
  const [programFocus, setProgramFocus] = useState("");

  const load = async (query = q) => {
    try {
      setItems(
        (
          await api<{ items: Row[] }>(
            `/api/packs?q=${encodeURIComponent(query)}`,
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
      await api("/api/packs", {
        method: "POST",
        body: JSON.stringify({ label, version, programFocus }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  const archive = async (id: string) => {
    await api("/api/packs", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  };

  return (
    <StudioShell
      title="Country packs"
      subtitle="Version the responsible AI governance context before comparing structured indexes against naive commitment checklists."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="version">Version</Label>
          <Input id="version" value={version} onChange={(e) => setVersion(e.target.value)} required />
          <Label htmlFor="programFocus">Program focus</Label>
          <Input id="programFocus" value={programFocus} onChange={(e) => setProgramFocus(e.target.value)} required />
          <Button type="submit">Create pack</Button>
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
                    {row.programFocus as string} · {row.version as string} · {row.status}
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

export default PacksPage;
