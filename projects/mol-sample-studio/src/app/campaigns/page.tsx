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
  designScope: string;
  sampleBudget: number;
  status: string;
};

export default function CampaignsPage() {
  const [items, setItems] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [label, setLabel] = useState("New kinase campaign pack");
  const [version, setVersion] = useState("2026.2");
  const [designScope, setDesignScope] = useState(
    "Kinase hinge-binder campaign (soft-sim)",
  );
  const [error, setError] = useState("");

  async function load() {
    const data = await api<{ items: Pack[] }>(
      `/api/campaigns?q=${encodeURIComponent(q)}`,
    );
    setItems(data.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/campaigns", {
        method: "POST",
        body: JSON.stringify({
          label,
          version,
          designScope,
          sampleBudget: 800,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Campaign packs"
      subtitle="Versioned soft-sim molecular design scopes and sample budgets."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search packs"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          onClick={() => load().catch((e) => setError(String(e)))}
        >
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3">
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
        <div>
          <Label htmlFor="scope">Design scope</Label>
          <Input
            id="scope"
            value={designScope}
            onChange={(e) => setDesignScope(e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <Button onClick={create}>Create campaign pack</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--ms-teal)]">{error}</p>
      ) : null}
      <ul className="space-y-2">
        {items.map((p) => (
          <li
            key={p.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{p.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {p.version} · {p.designScope} · budget {p.sampleBudget} ·{" "}
              {p.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
