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
  cohortScope: string;
  patientCount: number;
  status: string;
};

export default function CohortsPage() {
  const [items, setItems] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [label, setLabel] = useState("");
  const [version, setVersion] = useState("1.0");
  const [cohortScope, setCohortScope] = useState(
    "Adult CVD risk cohort (soft-sim)",
  );
  const [error, setError] = useState("");

  async function load(query = q) {
    const data = await api<{ items: Pack[] }>(
      `/api/cohorts?q=${encodeURIComponent(query)}`,
    );
    setItems(data.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/cohorts", {
        method: "POST",
        body: JSON.stringify({
          label: label || "Untitled cohort pack",
          version,
          cohortScope,
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
      title="Cohort packs"
      subtitle="Versioned soft-sim cohort scopes and patient assumptions."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search pack or cohort scope"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          onClick={() => load(q).catch((e) => setError(String(e)))}
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
          <Label htmlFor="scope">Cohort scope</Label>
          <Input
            id="scope"
            value={cohortScope}
            onChange={(e) => setCohortScope(e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <Button onClick={() => create()}>Create cohort pack</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      <ul className="space-y-3">
        {items.map((p) => (
          <li
            key={p.id}
            className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <div className="font-medium">{p.label}</div>
            <div className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {p.version} · {p.cohortScope} · {p.patientCount} patients ·{" "}
              {p.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
