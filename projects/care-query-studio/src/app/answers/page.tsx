"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Rubric = {
  id: string;
  label: string;
  architecture: string;
  lockCondition: string;
  answerChannel: string;
  status: string;
};

type Pack = { id: string; label: string };

export function AnswersPage() {
  const [items, setItems] = useState<Rubric[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("POC answer rubric");
  const [architecture, setArchitecture] = useState(
    "Multilingual POC answer soft-sim",
  );
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [rubrics, packData] = await Promise.all([
      api<{ items: Rubric[] }>(`/api/answers?q=${encodeURIComponent(q)}`),
      api<{ items: Pack[] }>("/api/queries"),
    ]);
    setItems(rubrics.items);
    setPacks(packData.items);
    if (!packId && packData.items[0]) setPackId(packData.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/answers", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          architecture,
          lockCondition: "lock_soft_sim",
          answerChannel: "soft_sim_poc_answer_signal",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Answers"
      subtitle="Answer rubrics that define how POC LLM replies are scored."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder="Search rubrics"
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
          <Label htmlFor="label">Rubric label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="arch">Architecture</Label>
          <Input
            id="arch"
            value={architecture}
            onChange={(e) => setArchitecture(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={() => create()}>Create answer rubric</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      <ul className="space-y-2">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <p className="font-medium">{r.label}</p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {r.architecture} · lock {r.lockCondition} · {r.status}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default AnswersPage;
