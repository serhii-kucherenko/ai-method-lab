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
  escalateFocus: string;
  caseBudget: number;
  status: string;
};

export function EscalatesPage() {
  const [items, setItems] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [label, setLabel] = useState("New PHE escalate pack");
  const [version, setVersion] = useState("2026.2");
  const [escalateFocus, setEscalateFocus] = useState(
    "AI-assisted outbreak escalation soft-sim focus",
  );
  const [error, setError] = useState("");

  async function load() {
    const data = await api<{ items: Pack[] }>(
      `/api/escalates?q=${encodeURIComponent(q)}`,
    );
    setItems(data.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/escalates", {
        method: "POST",
        body: JSON.stringify({
          label,
          version,
          escalateFocus,
          caseBudget: 24,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function archive(id: string) {
    await api("/api/escalates", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  }

  return (
    <StudioShell
      title="Escalates"
      subtitle="Versioned escalate packs for AI-assisted PHE classification and escalation soft-sim."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder="Search packs"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button variant="outline" onClick={() => load()}>
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
          <Label htmlFor="version">Version</Label>
          <Input
            id="version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="focus">Escalate focus</Label>
          <Input
            id="focus"
            value={escalateFocus}
            onChange={(e) => setEscalateFocus(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={create}>Create escalate pack</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((p) => (
          <li
            key={p.id}
            className="row-lift flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div>
              <div className="font-medium">
                {p.label} · v{p.version}
              </div>
              <p className="text-sm">
                {p.escalateFocus} · budget {p.caseBudget} · {p.status}
              </p>
            </div>
            {p.status !== "archived" ? (
              <Button variant="outline" size="sm" onClick={() => archive(p.id)}>
                Archive
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default EscalatesPage;
