"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Collaborator = {
  id: string;
  label: string;
  collaboratorSummary: string;
  draftChannel: string;
  status: string;
};

export default function CollaboratorsPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Collaborator[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [summary, setSummary] = useState(
    "Multi-LLM collaborative panel for rare glioma findings.",
  );
  const [error, setError] = useState("");

  async function load(query = q) {
    const [p, c] = await Promise.all([
      api<{ items: Pack[] }>("/api/cases"),
      api<{ items: Collaborator[] }>(
        `/api/collaborators?q=${encodeURIComponent(query)}`,
      ),
    ]);
    setPacks(p.items);
    setItems(c.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/collaborators", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label: label || "Untitled collaborator panel",
          collaboratorSummary: summary,
          successCondition: "report_positive",
          draftChannel: "soft_sim_report",
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
      title="Collaborator configs"
      subtitle="Multi-LLM panels and draft channels for soft-sim report generation."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search collaborators"
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
          <Label htmlFor="pack">Case pack</Label>
          <select
            id="pack"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={packId}
            onChange={(e) => setPackId(e.target.value)}
          >
            {packs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="summary">Collaborator summary</Label>
          <Input
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={() => create()}>Create collaborator</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      <ul className="space-y-3">
        {items.map((c) => (
          <li
            key={c.id}
            className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <div className="font-medium">{c.label}</div>
            <div className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {c.draftChannel} · {c.status}
            </div>
            <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              {c.collaboratorSummary}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
