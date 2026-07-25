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
  scriptFamily: string;
  languageCount: number;
  status: string;
};

export default function LanguagesPage() {
  const [items, setItems] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [label, setLabel] = useState("");
  const [version, setVersion] = useState("1.0");
  const [scriptFamily, setScriptFamily] = useState(
    "Ge'ez (Amharic + Tigrinya)",
  );
  const [error, setError] = useState("");

  async function load(query = q) {
    const data = await api<{ items: Pack[] }>(
      `/api/languages?q=${encodeURIComponent(query)}`,
    );
    setItems(data.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/languages", {
        method: "POST",
        body: JSON.stringify({
          label: label || "Untitled language pack",
          version,
          scriptFamily,
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
      title="Language packs"
      subtitle="Versioned Ge'ez-script families and language assumptions for NLP soft-sim."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search pack or script family"
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
          <Label htmlFor="scriptFamily">Script family</Label>
          <Input
            id="scriptFamily"
            value={scriptFamily}
            onChange={(e) => setScriptFamily(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={() => create()}>Create language pack</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-stone-500">No language packs yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((p) => (
            <li
              key={p.id}
              tabIndex={0}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium text-stone-900">{p.label}</div>
              <div className="mt-1 text-sm text-stone-500">
                {p.version} · {p.scriptFamily} · {p.languageCount} languages ·{" "}
                {p.status}
              </div>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
