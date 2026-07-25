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
  imagingTarget: string;
  parserBudget: number;
  status: string;
};

export default function MeasuresPage() {
  const [items, setItems] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [label, setLabel] = useState("New macular thickness soft-sim pack");
  const [version, setVersion] = useState("2026.2");
  const [imagingTarget, setImagingTarget] = useState(
    "Optopol + Zeiss Cirrus → DICOM SR soft-sim",
  );
  const [error, setError] = useState("");

  async function load() {
    const data = await api<{ items: Pack[] }>(
      `/api/measures?q=${encodeURIComponent(q)}`,
    );
    setItems(data.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/measures", {
        method: "POST",
        body: JSON.stringify({
          label,
          version,
          imagingTarget,
          parserBudget: 36,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Measure packs"
      subtitle="Versioned soft-sim packs and parser budgets for Optopol/Zeiss OCT recovery."
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
          <Label htmlFor="target">Imaging target</Label>
          <Input
            id="target"
            value={imagingTarget}
            onChange={(e) => setImagingTarget(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={create}>Create measure pack</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((p) => (
          <li
            key={p.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{p.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {p.version} · {p.imagingTarget} · budget {p.parserBudget} ·{" "}
              {p.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
