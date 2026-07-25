"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Scene = { id: string; label: string };
type Gen = { id: string; fidelity: number };
type Quality = {
  overall: number;
  structureScore: number;
  detailScore: number;
  temporalScore: number;
  sceneIntegrity: number;
  flatRolloutScore: number;
};
type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  hierarchical: Quality;
  flat: Quality;
};

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div className="mb-2">
      <div className="mb-1 flex justify-between text-xs text-slate-500">
        <span>{label}</span>
        <span>{value.toFixed(1)}</span>
      </div>
      <div className="h-2 rounded bg-slate-200">
        <div
          className="score-bar h-2 rounded bg-[var(--studio-signal)]"
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  );
}

export default function ComparePage() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [generators, setGenerators] = useState<Gen[]>([]);
  const [compares, setCompares] = useState<Compare[]>([]);
  const [sceneId, setSceneId] = useState("");
  const [generatorId, setGeneratorId] = useState("");
  const [name, setName] = useState("Horizon A/B");
  const [latest, setLatest] = useState<Compare | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const sceneData = await api<{ items: Scene[] }>("/api/scenes");
    setScenes(sceneData.items);
    const sid = sceneId || sceneData.items[0]?.id || "";
    if (!sceneId && sid) setSceneId(sid);
    const gens = await api<{ items: Gen[] }>("/api/generators");
    setGenerators(gens.items);
    const gid = generatorId || gens.items[0]?.id || "";
    if (!generatorId && gid) setGeneratorId(gid);
    const cmp = await api<{ items: Compare[] }>("/api/compare");
    setCompares(cmp.items);
    if (cmp.items[0]) setLatest(cmp.items[0]);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function run() {
    setError("");
    try {
      const res = await api<{ compare: Compare }>("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name, sceneId, generatorId }),
      });
      setLatest(res.compare);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  const ready = scenes.length > 0 && generators.length > 0;

  return (
    <StudioShell
      title="Dual compare"
      subtitle="Hierarchical world model (A) vs flat naive rollout baseline (B)."
    >
      {!ready ? (
        <p className="text-sm text-slate-500">
          Need scene + detail generator — seed from onboarding or create each
          entity first.
        </p>
      ) : (
        <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3">
          <div>
            <Label htmlFor="name">Compare name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="scene">Scene</Label>
            <select
              id="scene"
              className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-2 py-2 text-sm"
              value={sceneId}
              onChange={(e) => setSceneId(e.target.value)}
            >
              {scenes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="gen">Generator</Label>
            <select
              id="gen"
              className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-2 py-2 text-sm"
              value={generatorId}
              onChange={(e) => setGeneratorId(e.target.value)}
            >
              {generators.map((g) => (
                <option key={g.id} value={g.id}>
                  fidelity {g.fidelity}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3">
            <Button className="bg-[var(--studio-signal)]" onClick={run}>
              Run A vs B
            </Button>
          </div>
        </div>
      )}

      {latest ? (
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
            <h2 className="mb-3 font-[family-name:var(--font-display)] text-lg">
              A · Hierarchical ({latest.hierarchical.overall.toFixed(1)})
            </h2>
            <Bar label="Structure" value={latest.hierarchical.structureScore} />
            <Bar label="Detail" value={latest.hierarchical.detailScore} />
            <Bar label="Temporal" value={latest.hierarchical.temporalScore} />
            <Bar
              label="Scene integrity"
              value={latest.hierarchical.sceneIntegrity}
            />
          </div>
          <div className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
            <h2 className="mb-3 font-[family-name:var(--font-display)] text-lg">
              B · Flat rollout ({latest.flat.overall.toFixed(1)})
            </h2>
            <Bar label="Flat rollout" value={latest.flat.flatRolloutScore} />
            <Bar label="Structure (naive)" value={latest.flat.structureScore} />
            <Bar label="Detail (naive)" value={latest.flat.detailScore} />
            <Bar label="Temporal (naive)" value={latest.flat.temporalScore} />
          </div>
          <p className="md:col-span-2 text-sm text-slate-600">
            Winner: <strong>{latest.winner}</strong> · gap {latest.gap}
          </p>
        </div>
      ) : null}

      <ul className="space-y-2">
        {compares.map((c) => (
          <li
            key={c.id}
            className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3 text-sm"
          >
            {c.name} · {c.winner} · gap {c.gap}
          </li>
        ))}
      </ul>
      {error ? (
        <p className="mt-4 text-sm text-[var(--studio-signal)]">{error}</p>
      ) : null}
    </StudioShell>
  );
}
