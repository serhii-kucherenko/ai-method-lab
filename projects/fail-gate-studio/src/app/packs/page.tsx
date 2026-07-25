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
  specialtyFocus: string;
  caseCount: number;
  status: string;
};

export default function PacksPage() {
  const [items, setItems] = useState<Pack[]>([]);
  const [label, setLabel] = useState("");
  const [version, setVersion] = useState("1.0.0");
  const [specialtyFocus, setSpecialtyFocus] = useState("general");
  const [error, setError] = useState("");

  async function load() {
    const data = await api<{ items: Pack[] }>("/api/packs");
    setItems(data.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/packs", {
        method: "POST",
        body: JSON.stringify({
          label: label || "Private fail pack",
          version,
          specialtyFocus,
          notes: "",
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
      title="Case packs"
      subtitle="Versioned private fail-case packs for bench seats."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-4">
        <div>
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="ver">Version</Label>
          <Input
            id="ver"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="focus">Specialty focus</Label>
          <Input
            id="focus"
            value={specialtyFocus}
            onChange={(e) => setSpecialtyFocus(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button className="bg-[var(--studio-signal)]" onClick={create}>
            Create pack
          </Button>
        </div>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">No packs yet — create one above.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((p) => (
            <li
              key={p.id}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3 text-sm"
            >
              <strong>{p.label}</strong> · v{p.version} · {p.specialtyFocus} ·{" "}
              {p.caseCount} cases · {p.status}
            </li>
          ))}
        </ul>
      )}
      {error ? (
        <p className="mt-4 text-sm text-[var(--studio-signal)]">{error}</p>
      ) : null}
    </StudioShell>
  );
}
