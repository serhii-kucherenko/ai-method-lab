"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Surrogate = {
  id: string;
  packId?: string;
  label: string;
  surrogateText: string;
  successCondition: string;
  membraneChannel: string;
  status: string;
};

export default function SurrogatesPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Surrogate[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("ChemGNN CNT surrogate set");
  const [surrogateText, setSurrogateText] = useState(
    "Soft-sim ChemGNN graph surrogate for CNT desalination membrane.",
  );
  const [successCondition, setSuccessCondition] = useState("lock_soft_sim");
  const [membraneChannel, setMembraneChannel] = useState(
    "soft_sim_chemgnn_cnt",
  );
  const [error, setError] = useState("");

  async function load() {
    const [p, s] = await Promise.all([
      api<{ items: Pack[] }>("/api/membranes"),
      api<{ items: Surrogate[] }>(
        `/api/surrogates?q=${encodeURIComponent(q)}`,
      ),
    ]);
    setPacks(p.items);
    setItems(s.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/surrogates", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          surrogateText,
          successCondition,
          membraneChannel,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function archive(id: string) {
    await api("/api/surrogates", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  }

  return (
    <StudioShell
      title="Surrogates"
      subtitle="ChemGNN surrogate specs and pack lock success conditions."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder="Search surrogates"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button variant="outline" onClick={() => load()}>
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Membrane pack</Label>
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
        <div className="md:col-span-2">
          <Label htmlFor="text">Surrogate text</Label>
          <Input
            id="text"
            value={surrogateText}
            onChange={(e) => setSurrogateText(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="success">Success condition</Label>
          <Input
            id="success"
            value={successCondition}
            onChange={(e) => setSuccessCondition(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="channel">Membrane channel</Label>
          <Input
            id="channel"
            value={membraneChannel}
            onChange={(e) => setMembraneChannel(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={create}>Create surrogate</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((s) => (
          <li
            key={s.id}
            className="row-lift flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div>
              <div className="font-medium">{s.label}</div>
              <p className="text-sm">
                {s.membraneChannel} · {s.successCondition} · {s.status}
              </p>
            </div>
            {s.status !== "archived" ? (
              <Button variant="outline" size="sm" onClick={() => archive(s.id)}>
                Archive
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
