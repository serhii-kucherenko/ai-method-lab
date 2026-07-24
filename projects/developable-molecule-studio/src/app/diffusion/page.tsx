"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { BindingPocket, DiffusionRun } from "@/store";

export default function DiffusionPage() {
  const [pockets, setPockets] = useState<BindingPocket[]>([]);
  const [items, setItems] = useState<DiffusionRun[]>([]);
  const [pocketId, setPocketId] = useState("");
  const [name, setName] = useState("");
  const [steps, setSteps] = useState("200");
  const [conditioning, setConditioning] = useState("0.8");
  const [error, setError] = useState("");

  async function load() {
    const [p, d] = await Promise.all([
      api<{ items: BindingPocket[] }>("/api/pockets"),
      api<DiffusionRun[]>(
        `/api/diffusion${pocketId ? `?pocketId=${encodeURIComponent(pocketId)}` : ""}`,
      ),
    ]);
    setPockets(p.items);
    if (!pocketId && p.items[0]) setPocketId(p.items[0].id);
    setItems(d);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/diffusion", {
        method: "POST",
        body: JSON.stringify({
          pocketId,
          name,
          steps: Number(steps),
          pocketConditioning: Number(conditioning),
          status: "queued",
          notes: "Pocket-conditioned diffusion run",
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
      title="Pocket-conditioned diffusion"
      subtitle="Queue diffusion runs that stay conditioned on binding-pocket geometry."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-4"
      >
        <Input
          placeholder="Run name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={pocketId}
          onChange={(e) => setPocketId(e.target.value)}
          required
        >
          {pockets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <Input
          type="number"
          placeholder="Steps"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
        />
        <div className="flex gap-2">
          <Input
            type="number"
            step="0.01"
            placeholder="Conditioning"
            value={conditioning}
            onChange={(e) => setConditioning(e.target.value)}
          />
          <Button type="submit">Queue</Button>
        </div>
      </form>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((r) => (
          <li
            key={r.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
                {r.name}
              </h3>
              <span className="text-sm text-[var(--studio-teal)]">{r.status}</span>
            </div>
            <p className="mt-1 text-sm text-stone-500">
              {r.steps} steps · conditioning {r.pocketConditioning.toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
