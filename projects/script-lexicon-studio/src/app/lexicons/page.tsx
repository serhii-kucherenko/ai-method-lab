"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Lexicon = {
  id: string;
  packId: string;
  label: string;
  languages: string[];
  addedSubwords: number;
  expansionWeight: number;
  baselineWeight: number;
  status: string;
};

export default function LexiconsPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Lexicon[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [languages, setLanguages] = useState("am, ti");
  const [addedSubwords, setAddedSubwords] = useState("30000");
  const [expansionWeight, setExpansionWeight] = useState("0.62");
  const [error, setError] = useState("");

  async function load(query = q) {
    const [p, a] = await Promise.all([
      api<{ items: Pack[] }>("/api/languages"),
      api<{ items: Lexicon[] }>(
        `/api/lexicons?q=${encodeURIComponent(query)}`,
      ),
    ]);
    setPacks(p.items);
    setItems(a.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/lexicons", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label: label || "Untitled lexicon expansion",
          languages: languages
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          addedSubwords: Number(addedSubwords),
          expansionWeight: Number(expansionWeight),
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
      title="Lexicon expansions"
      subtitle="Configure expanded Ge'ez-script subword counts and expansion weights."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search lexicon or language"
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
          <Label htmlFor="pack">Language pack</Label>
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
        <div>
          <Label htmlFor="languages">Languages (comma-separated)</Label>
          <Input
            id="languages"
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="addedSubwords">Added subwords</Label>
          <Input
            id="addedSubwords"
            value={addedSubwords}
            onChange={(e) => setAddedSubwords(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="expansionWeight">Expansion weight (0–1)</Label>
          <Input
            id="expansionWeight"
            value={expansionWeight}
            onChange={(e) => setExpansionWeight(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={() => create()}>Create lexicon expansion</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-stone-500">No lexicon expansions yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((a) => (
            <li
              key={a.id}
              tabIndex={0}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium text-stone-900">{a.label}</div>
              <div className="mt-1 text-sm text-stone-500">
                languages: {a.languages.join(", ")} · +{a.addedSubwords}{" "}
                subwords · expansion {a.expansionWeight} · baseline{" "}
                {a.baselineWeight} · {a.status}
              </div>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
