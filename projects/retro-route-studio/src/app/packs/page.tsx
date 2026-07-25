"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = {
  id: string;
  label: string;
  version: string;
  targetSmiles: string;
  routeCount: number;
  status: string;
};

export default function PacksPage() {
  const [items, setItems] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [label, setLabel] = useState("");
  const [version, setVersion] = useState("1.0.0");
  const [targetSmiles, setTargetSmiles] = useState("c1ccccc1");
  const [error, setError] = useState("");

  async function load(query = q) {
    const data = await api<{ items: Pack[] }>(
      `/api/packs${query ? `?q=${encodeURIComponent(query)}` : ""}`,
    );
    setItems(data.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/packs", {
        method: "POST",
        body: JSON.stringify({
          label: label || "Route pack",
          version,
          targetSmiles,
          notes: "",
        }),
      });
      setLabel("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Route packs"
      subtitle="Versioned route packs for soft-sim synthesis-planning benches."
    >
      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Search packs…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button variant="outline" onClick={() => load(q)}>
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-4">
        <div>
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="ver">Version</Label>
          <Input
            id="ver"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="smiles">Target SMILES-like</Label>
          <Input
            id="smiles"
            value={targetSmiles}
            onChange={(e) => setTargetSmiles(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button className="bg-[var(--studio-teal)]" onClick={create}>
            Create pack
          </Button>
        </div>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          No packs yet — create one above.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((p) => (
            <li
              key={p.id}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3 text-sm"
            >
              <strong>{p.label}</strong> · v{p.version} · {p.targetSmiles} ·{" "}
              {p.routeCount} routes · {p.status}
            </li>
          ))}
        </ul>
      )}
      {error ? (
        <p className="mt-4 text-sm text-[var(--studio-amber)]">{error}</p>
      ) : null}
    </StudioShell>
  );
}
