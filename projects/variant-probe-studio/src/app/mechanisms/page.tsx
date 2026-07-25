"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Mechanism = {
  id: string;
  label: string;
  mechanismText: string;
  successCondition: string;
  pathwayChannel: string;
  status: string;
};

type Pack = { id: string; label: string };

export default function MechanismsPage() {
  const [items, setItems] = useState<Mechanism[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Splice disruption mechanism link");
  const [mechanismText, setMechanismText] = useState(
    "Does the probe attribute score mass to splice-site disruption?",
  );
  const [error, setError] = useState("");

  async function load() {
    const [ms, pks] = await Promise.all([
      api<{ items: Mechanism[] }>(
        `/api/mechanisms?q=${encodeURIComponent(q)}`,
      ),
      api<{ items: Pack[] }>("/api/panels"),
    ]);
    setItems(ms.items);
    setPacks(pks.items);
    if (!packId && pks.items[0]) setPackId(pks.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/mechanisms", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          mechanismText,
          successCondition: "lock_soft_sim",
          pathwayChannel: "soft_sim_splice",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Mechanism links"
      subtitle="Biological mechanism links with honesty-fenced success conditions."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search mechanisms"
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
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Panel pack</Label>
          <select
            id="pack"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
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
          <Label htmlFor="text">Mechanism text</Label>
          <Input
            id="text"
            value={mechanismText}
            onChange={(e) => setMechanismText(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Create mechanism link</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{item.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {item.mechanismText} · {item.successCondition} · {item.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
