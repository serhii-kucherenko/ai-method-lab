"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type FailCase = {
  id: string;
  label: string;
  specialty: string;
  severityHint: number;
  status: string;
  notes: string;
};

export default function CasesPage() {
  const [items, setItems] = useState<FailCase[]>([]);
  const [q, setQ] = useState("");
  const [label, setLabel] = useState("");
  const [specialty, setSpecialty] = useState("internal-medicine");
  const [severityHint, setSeverityHint] = useState(0.7);
  const [error, setError] = useState("");

  async function load(query = q) {
    const data = await api<{ items: FailCase[] }>(
      `/api/cases?q=${encodeURIComponent(query)}`,
    );
    setItems(data.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/cases", {
        method: "POST",
        body: JSON.stringify({
          label: label || "Untitled fail case",
          specialty,
          promptHash: `p-${Date.now()}`,
          modelAnswerHash: `a-${Date.now()}`,
          severityHint,
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
      title="Fail cases"
      subtitle="Registry of medical AI fail cases for release-gate review."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search specialty or label"
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
          <Label htmlFor="specialty">Specialty</Label>
          <Input
            id="specialty"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="sev">Severity hint (0–1)</Label>
          <Input
            id="sev"
            type="number"
            step="0.05"
            min={0}
            max={1}
            value={severityHint}
            onChange={(e) => setSeverityHint(Number(e.target.value))}
          />
        </div>
        <div className="flex items-end">
          <Button className="bg-[var(--studio-signal)]" onClick={create}>
            Create case
          </Button>
        </div>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          No cases yet — create the first fail case above.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((c) => (
            <li
              key={c.id}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium text-slate-900">{c.label}</div>
              <div className="text-sm text-slate-500">
                {c.specialty} · severity {c.severityHint} · {c.status}
              </div>
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
