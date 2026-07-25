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
  colearnFocus: string;
  labelBudget: number;
  status: string;
};

export function ColearnsPage() {
  const [items, setItems] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [label, setLabel] = useState("New SHARE colearn pack");
  const [version, setVersion] = useState("2026.2");
  const [colearnFocus, setColearnFocus] = useState(
    "Human–AI disease activity labeling soft-sim focus",
  );
  const [error, setError] = useState("");

  async function load() {
    const data = await api<{ items: Pack[] }>(
      `/api/colearns?q=${encodeURIComponent(q)}`,
    );
    setItems(data.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/colearns", {
        method: "POST",
        body: JSON.stringify({
          label,
          version,
          colearnFocus,
          labelBudget: 24,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function archive(id: string) {
    await api("/api/colearns", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  }

  return (
    <StudioShell
      title="Colearns"
      subtitle="Versioned colearn packs for human–AI disease activity labeling soft-sim."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder="Search packs"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button variant="outline" onClick={() => load()}>
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="version">Version</Label>
          <Input
            id="version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="focus">Colearn focus</Label>
          <Input
            id="focus"
            value={colearnFocus}
            onChange={(e) => setColearnFocus(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Create colearn pack</Button>
          {error ? (
            <p className="mt-2 text-sm text-[var(--sc-amber)]">{error}</p>
          ) : null}
        </div>
      </div>
      <ul className="space-y-2">
        {items.map((p) => (
          <li
            key={p.id}
            className="row-lift flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div>
              <p className="font-medium">
                {p.label}{" "}
                <span className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_50%,transparent)]">
                  v{p.version}
                </span>
              </p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {p.colearnFocus} · budget {p.labelBudget} · {p.status}
              </p>
            </div>
            {p.status !== "archived" ? (
              <Button variant="outline" onClick={() => archive(p.id)}>
                Archive
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default ColearnsPage;
