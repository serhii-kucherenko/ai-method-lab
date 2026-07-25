"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Schema = {
  id: string;
  label: string;
  sectionCount: number;
  collaboratorWeight: number;
  soloWeight: number;
  status: string;
};

export default function SchemasPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Schema[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [sections, setSections] = useState(
    "Indication, Technique, Findings, Impression",
  );
  const [collaboratorWeight, setCollaboratorWeight] = useState("0.6");
  const [error, setError] = useState("");

  async function load() {
    const [p, s] = await Promise.all([
      api<{ items: Pack[] }>("/api/cases"),
      api<{ items: Schema[] }>("/api/schemas"),
    ]);
    setPacks(p.items);
    setItems(s.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      const sectionList = sections
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      await api("/api/schemas", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label: label || "Untitled schema",
          sections: sectionList,
          sectionCount: sectionList.length,
          collaboratorWeight: Number(collaboratorWeight),
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
      title="Report schemas"
      subtitle="Structured sections with collaborator vs solo weights for soft-sim drafts."
    >
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
          <Label htmlFor="sections">Sections (comma-separated)</Label>
          <Input
            id="sections"
            value={sections}
            onChange={(e) => setSections(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="cw">Collaborator weight</Label>
          <Input
            id="cw"
            value={collaboratorWeight}
            onChange={(e) => setCollaboratorWeight(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={() => create()}>Create schema</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      <ul className="space-y-3">
        {items.map((s) => (
          <li
            key={s.id}
            className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <div className="font-medium">{s.label}</div>
            <div className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {s.sectionCount} sections · collaborator {s.collaboratorWeight} ·
              solo {s.soloWeight} · {s.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
