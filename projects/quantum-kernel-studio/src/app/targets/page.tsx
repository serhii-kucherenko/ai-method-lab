"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/client-api";

type Target = {
  id: string;
  label: string;
  bindingSummary: string;
  successCondition: string;
  assayChannel: string;
  status: string;
};

export default function TargetsPage() {
  const [items, setItems] = useState<Target[]>([]);
  const [q, setQ] = useState("");
  const [label, setLabel] = useState("");
  const [summary, setSummary] = useState("");
  const [assayChannel, setAssayChannel] = useState("soft_sim_qsar");
  const [condition, setCondition] = useState("binding_positive");
  const [error, setError] = useState("");

  async function load(query = q) {
    const data = await api<{ items: Target[] }>(
      `/api/targets?q=${encodeURIComponent(query)}`,
    );
    setItems(data.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/targets", {
        method: "POST",
        body: JSON.stringify({
          label: label || "Untitled target case",
          bindingSummary:
            summary ||
            "Soft-sim binding pocket with fingerprint-rich actives and classical decoys.",
          successCondition: condition,
          assayChannel,
        }),
      });
      setLabel("");
      setSummary("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Target cases"
      subtitle="Attach binding cases that quantum and classical kernels can score."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search target or assay"
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
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="assay">Assay channel</Label>
          <Input
            id="assay"
            value={assayChannel}
            onChange={(e) => setAssayChannel(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="summary">Binding summary</Label>
          <Textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="condition">Success condition</Label>
          <Input
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={() => create()}>Create target case</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-slate-500">No target cases yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((s) => (
            <li
              key={s.id}
              tabIndex={0}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium text-slate-900">{s.label}</div>
              <div className="mt-1 text-sm text-slate-500">
                {s.assayChannel} · {s.successCondition} · {s.status}
              </div>
              <p className="mt-1 text-sm text-slate-600">{s.bindingSummary}</p>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
