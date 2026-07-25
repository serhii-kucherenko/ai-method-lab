"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Candidate = {
  id: string;
  packId: string;
  label: string;
  kind: string;
  reactionClasses: string;
  stepCount: number;
  status: string;
};

type Pack = { id: string; label: string };

export default function CandidatesPage() {
  const [items, setItems] = useState<Candidate[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Convergent SCS-gated candidate");
  const [kind, setKind] = useState("convergent");
  const [reactionClasses, setReactionClasses] = useState(
    "amide_coupling,reductive_amination",
  );
  const [stepCount, setStepCount] = useState("7");
  const [error, setError] = useState("");

  async function load() {
    const [cands, ps] = await Promise.all([
      api<{ items: Candidate[] }>("/api/candidates"),
      api<{ items: Pack[] }>("/api/routes"),
    ]);
    setItems(cands.items);
    setPacks(ps.items);
    if (!packId && ps.items[0]) setPackId(ps.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/candidates", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          reactionClasses,
          stepCount: Number(stepCount),
          coverageMin: 0.4,
          coverageMax: 0.9,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Candidate routes"
      subtitle="Propose retrosynthesis candidates with reaction classes and step counts."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Route pack</Label>
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
        <div>
          <Label htmlFor="kind">Kind</Label>
          <select
            id="kind"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            {["linear", "convergent", "divergent", "biomimetic", "mixed"].map(
              (k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ),
            )}
          </select>
        </div>
        <div>
          <Label htmlFor="steps">Step count</Label>
          <Input
            id="steps"
            value={stepCount}
            onChange={(e) => setStepCount(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="classes">Reaction classes</Label>
          <Input
            id="classes"
            value={reactionClasses}
            onChange={(e) => setReactionClasses(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={create}>Create candidate</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((c) => (
          <li
            key={c.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{c.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {c.kind} · {c.stepCount} steps · {c.reactionClasses} · {c.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
