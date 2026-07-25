"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Locale = {
  id: string;
  packId: string;
  label: string;
  kind: string;
  caseCount: number;
  status: string;
};

type Pack = { id: string; label: string };

export function LocalesPage() {
  const [items, setItems] = useState<Locale[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Hausa bedside locale suite");
  const [kind, setKind] = useState("hausa");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [locales, packData] = await Promise.all([
      api<{ items: Locale[] }>(`/api/locales?q=${encodeURIComponent(q)}`),
      api<{ items: Pack[] }>("/api/queries"),
    ]);
    setItems(locales.items);
    setPacks(packData.items);
    if (!packId && packData.items[0]) setPackId(packData.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/locales", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          dialectHint: "language_coverage,locale_grounding",
          caseCount: 4,
          hardnessMin: 0.35,
          hardnessMax: 0.9,
          metricHint: "Multilingual POC locale soft-sim",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Locales"
      subtitle="Multilingual point-of-care locale suites linked to query packs."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder="Search locales"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button variant="outline" onClick={() => load()}>
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Query pack</Label>
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
          <Label htmlFor="kind">Locale kind</Label>
          <Input
            id="kind"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="label">Suite label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={() => create()}>Create locale suite</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      <ul className="space-y-2">
        {items.map((m) => (
          <li
            key={m.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <p className="font-medium">{m.label}</p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {m.kind} · {m.caseCount} cases · {m.status}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default LocalesPage;
