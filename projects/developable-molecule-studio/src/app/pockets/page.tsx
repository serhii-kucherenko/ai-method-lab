"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { BindingPocket, PocketFamily } from "@/store";

const FAMILIES: PocketFamily[] = [
  "kinase",
  "protease",
  "gpcr",
  "nuclear",
  "ion_channel",
];

export default function PocketsPage() {
  const [items, setItems] = useState<BindingPocket[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [family, setFamily] = useState<PocketFamily>("kinase");
  const [volumeA3, setVolumeA3] = useState("420");
  const [hydrophobicity, setHydrophobicity] = useState("0.6");
  const [error, setError] = useState("");
  const [checklist, setChecklist] = useState(false);

  async function load(search = q) {
    const res = await api<{ items: BindingPocket[] }>(
      `/api/pockets?q=${encodeURIComponent(search)}`,
    );
    setItems(res.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/pockets", {
        method: "POST",
        body: JSON.stringify({
          name,
          family,
          volumeA3: Number(volumeA3),
          hydrophobicity: Number(hydrophobicity),
          notes: "Registered from pockets page",
        }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Binding pockets"
      subtitle="Register the pockets you condition generation on — family, volume, and hydrophobicity first."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <label className="flex items-start gap-2 text-sm text-stone-600">
          <input
            type="checkbox"
            checked={checklist}
            onChange={(e) => setChecklist(e.target.checked)}
            className="mt-1"
          />
          <span>
            Onboarding: confirm pocket family and volume, and that this studio
            is a developability planner — not live wet-lab synthesis or docking
            hardware.
          </span>
        </label>
      </div>

      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-5"
      >
        <Input
          placeholder="Pocket name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={family}
          onChange={(e) => setFamily(e.target.value as PocketFamily)}
        >
          {FAMILIES.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <Input
          type="number"
          placeholder="Volume Å³"
          value={volumeA3}
          onChange={(e) => setVolumeA3(e.target.value)}
          required
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Hydrophobicity"
          value={hydrophobicity}
          onChange={(e) => setHydrophobicity(e.target.value)}
          required
        />
        <Button type="submit">Add pocket</Button>
      </form>

      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Search pockets"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button type="button" variant="outline" onClick={() => load()}>
          Search
        </Button>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((p) => (
          <li
            key={p.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
                {p.name}
              </h3>
              <span className="text-sm text-[var(--studio-teal)]">{p.family}</span>
            </div>
            <p className="mt-1 text-sm text-stone-500">
              {p.volumeA3} Å³ · hydrophobicity {p.hydrophobicity.toFixed(2)}
            </p>
            {p.notes ? (
              <p className="mt-2 text-sm text-stone-500">{p.notes}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
