"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Surrogate = {
  id: string;
  packId?: string;
  label: string;
  surrogateSummary: string;
  successCondition: string;
  simChannel: string;
  status: string;
};

export default function SurrogatesPage() {
  const [items, setItems] = useState<Surrogate[]>([]);
  const [q, setQ] = useState("");
  const [label, setLabel] = useState("");
  const [summary, setSummary] = useState(
    "Entropy-constrained ML surrogate soft-sim case.",
  );
  const [successCondition, setSuccessCondition] = useState("kinetics_positive");
  const [simChannel, setSimChannel] = useState("soft_sim_kinetics");
  const [error, setError] = useState("");

  async function load(query = q) {
    const data = await api<{ items: Surrogate[] }>(
      `/api/surrogates?q=${encodeURIComponent(query)}`,
    );
    setItems(data.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/surrogates", {
        method: "POST",
        body: JSON.stringify({
          label: label || "Untitled surrogate",
          surrogateSummary: summary,
          successCondition,
          simChannel,
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
      title="Surrogate configs"
      subtitle="Configure entropy-constrained surrogates and success conditions before A/B compare."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search surrogates"
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
          <Label htmlFor="channel">Sim channel</Label>
          <Input
            id="channel"
            value={simChannel}
            onChange={(e) => setSimChannel(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="summary">Surrogate summary</Label>
          <Input
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="success">Success condition</Label>
          <Input
            id="success"
            value={successCondition}
            onChange={(e) => setSuccessCondition(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={() => create()}>Create surrogate</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
          No surrogates yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((s) => (
            <li
              key={s.id}
              tabIndex={0}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium">{s.label}</div>
              <div className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {s.simChannel} · {s.successCondition} · {s.status}
              </div>
              <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
                {s.surrogateSummary}
              </p>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
