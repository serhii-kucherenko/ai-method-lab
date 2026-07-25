"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type StyleAxis = {
  id: string;
  packId: string;
  name: string;
  lowPole: string;
  highPole: string;
  weight: number;
  status: string;
};

export default function StylesPage() {
  const [items, setItems] = useState<StyleAxis[]>([]);
  const [name, setName] = useState("");
  const [lowPole, setLowPole] = useState("direct");
  const [highPole, setHighPole] = useState("hedging");
  const [weight, setWeight] = useState(0.75);
  const [error, setError] = useState("");

  async function load() {
    const data = await api<{ items: StyleAxis[] }>("/api/styles");
    setItems(data.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/styles", {
        method: "POST",
        body: JSON.stringify({
          packId: "pack-demo",
          name: name || "Untitled axis",
          lowPole,
          highPole,
          weight,
        }),
      });
      setName("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Style axes"
      subtitle="Communication-style workspace — tune poles and weights, then re-score."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-4">
        <div>
          <Label htmlFor="name">Axis name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="low">Low pole</Label>
          <Input
            id="low"
            value={lowPole}
            onChange={(e) => setLowPole(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="high">High pole</Label>
          <Input
            id="high"
            value={highPole}
            onChange={(e) => setHighPole(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="weight">Weight (0–1)</Label>
          <Input
            id="weight"
            type="number"
            step="0.05"
            min={0}
            max={1}
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={() => create()}>Add style axis</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-[var(--studio-coral)]">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-slate-500">No axes defined — add the first style axis.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((a) => (
            <li
              key={a.id}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium text-slate-900">{a.name}</div>
              <div className="mt-1 text-sm text-slate-500">
                {a.lowPole} ↔ {a.highPole} · weight {a.weight} · {a.status}
              </div>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
