"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label: string };
type Run = {
  id: string;
  labelId: string;
  skeletonId: string;
  skeletonCoverage: number;
  scaffoldConfidence: number;
  labelFit: number;
  navIntegrity: number;
  status: string;
};

export default function RunsPage() {
  const [labels, setLabels] = useState<Ref[]>([]);
  const [skeletons, setSkeletons] = useState<Ref[]>([]);
  const [items, setItems] = useState<Run[]>([]);
  const [labelId, setLabelId] = useState("");
  const [skeletonId, setSkeletonId] = useState("");
  const [skeletonCoverage, setSkeletonCoverage] = useState("0.6");
  const [scaffoldConfidence, setScaffoldConfidence] = useState("0.7");
  const [labelFit, setLabelFit] = useState("0.72");
  const [navIntegrity, setNavIntegrity] = useState("0.68");
  const [error, setError] = useState("");

  async function load() {
    const [l, s, r] = await Promise.all([
      api<{ items: Ref[] }>("/api/labels"),
      api<{ items: Ref[] }>("/api/skeletons"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setLabels(l.items);
    setSkeletons(s.items);
    setItems(r.items);
    if (!labelId && l.items[0]) setLabelId(l.items[0].id);
    if (!skeletonId && s.items[0]) setSkeletonId(s.items[0].id);
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
          labelId,
          skeletonId,
          skeletonCoverage: Number(skeletonCoverage),
          scaffoldConfidence: Number(scaffoldConfidence),
          labelFit: Number(labelFit),
          navIntegrity: Number(navIntegrity),
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Author runs"
      subtitle="Soft-sim authoring runs that feed dual A/B compares."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="label">Label template</Label>
          <select
            id="label"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={labelId}
            onChange={(e) => setLabelId(e.target.value)}
          >
            {labels.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="skel">Skeleton</Label>
          <select
            id="skel"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={skeletonId}
            onChange={(e) => setSkeletonId(e.target.value)}
          >
            {skeletons.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="cov">Skeleton coverage</Label>
          <Input
            id="cov"
            value={skeletonCoverage}
            onChange={(e) => setSkeletonCoverage(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="conf">Scaffold confidence</Label>
          <Input
            id="conf"
            value={scaffoldConfidence}
            onChange={(e) => setScaffoldConfidence(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="fit">Label fit</Label>
          <Input
            id="fit"
            value={labelFit}
            onChange={(e) => setLabelFit(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="nav">Nav integrity</Label>
          <Input
            id="nav"
            value={navIntegrity}
            onChange={(e) => setNavIntegrity(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Create run</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{r.id}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              coverage {r.skeletonCoverage} · scaffold {r.scaffoldConfidence} ·
              fit {r.labelFit} · nav {r.navIntegrity} · {r.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
