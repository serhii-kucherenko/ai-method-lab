"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Run = {
  id: string;
  fusionId: string;
  specimenId: string;
  deformableQuality: number;
  surfaceFidelity: number;
  marginClarity: number;
  fusionStability: number;
  status: string;
};

type Ref = { id: string; label: string };

export default function RunsPage() {
  const [items, setItems] = useState<Run[]>([]);
  const [fusions, setFusions] = useState<Ref[]>([]);
  const [specimens, setSpecimens] = useState<Ref[]>([]);
  const [fusionId, setFusionId] = useState("");
  const [specimenId, setSpecimenId] = useState("");
  const [deformableQuality, setDeformableQuality] = useState("0.65");
  const [surfaceFidelity, setSurfaceFidelity] = useState("0.7");
  const [marginClarity, setMarginClarity] = useState("0.72");
  const [fusionStability, setFusionStability] = useState("0.68");
  const [error, setError] = useState("");

  async function load() {
    const [runs, fus, specs] = await Promise.all([
      api<{ items: Run[] }>("/api/runs"),
      api<{ items: Ref[] }>("/api/fusions"),
      api<{ items: Ref[] }>("/api/specimens"),
    ]);
    setItems(runs.items);
    setFusions(fus.items);
    setSpecimens(specs.items);
    if (!fusionId && fus.items[0]) setFusionId(fus.items[0].id);
    if (!specimenId && specs.items[0]) setSpecimenId(specs.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/runs", {
        method: "POST",
        body: JSON.stringify({
          fusionId,
          specimenId,
          deformableQuality: Number(deformableQuality),
          surfaceFidelity: Number(surfaceFidelity),
          marginClarity: Number(marginClarity),
          fusionStability: Number(fusionStability),
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Margin runs"
      subtitle="Record soft-sim deformable quality, surface fidelity, margin clarity, and stability."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3">
        <div>
          <Label htmlFor="fusion">Fusion</Label>
          <select
            id="fusion"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={fusionId}
            onChange={(e) => setFusionId(e.target.value)}
          >
            {fusions.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="specimen">Specimen</Label>
          <select
            id="specimen"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={specimenId}
            onChange={(e) => setSpecimenId(e.target.value)}
          >
            {specimens.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="dq">Deformable quality</Label>
          <Input
            id="dq"
            value={deformableQuality}
            onChange={(e) => setDeformableQuality(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="sf">Surface fidelity</Label>
          <Input
            id="sf"
            value={surfaceFidelity}
            onChange={(e) => setSurfaceFidelity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="mc">Margin clarity</Label>
          <Input
            id="mc"
            value={marginClarity}
            onChange={(e) => setMarginClarity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="fs">Fusion stability</Label>
          <Input
            id="fs"
            value={fusionStability}
            onChange={(e) => setFusionStability(e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <Button onClick={create}>Create margin run</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{r.id}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              D {r.deformableQuality.toFixed(2)} · S{" "}
              {r.surfaceFidelity.toFixed(2)} · M {r.marginClarity.toFixed(2)} ·
              Stab {r.fusionStability.toFixed(2)} · {r.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
