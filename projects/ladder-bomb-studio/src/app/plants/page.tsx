"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { Plant, PlantCriticality } from "@/store";

const CRITICALITY: PlantCriticality[] = [
  "low",
  "medium",
  "high",
  "safety-critical",
];

export default function PlantsPage() {
  const [items, setItems] = useState<Plant[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [siteCode, setSiteCode] = useState("");
  const [criticality, setCriticality] =
    useState<PlantCriticality>("safety-critical");
  const [plcCount, setPlcCount] = useState("4");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(search = q) {
    start(async () => {
      const res = await api<{ items: Plant[] }>(
        `/api/plants?q=${encodeURIComponent(search)}&page=1&pageSize=20`,
      );
      setItems(res.items);
    });
  }

  useEffect(() => {
    load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api<Plant>("/api/plants", {
          method: "POST",
          body: JSON.stringify({
            name,
            siteCode,
            criticality,
            plcCount: Number(plcCount),
            notes,
          }),
        });
        setName("");
        setSiteCode("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Plants"
      subtitle="Register OT sites with criticality and PLC counts before ladder imports."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <p className="font-medium text-slate-900">Onboarding</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-500">
          <li>Create a plant with site code and criticality.</li>
          <li>Import ladder programs, then run FB-aware scans.</li>
          <li>Review findings, synthesize triggers, compare dropped-FB.</li>
        </ol>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Register plant</p>
          <div>
            <Label htmlFor="p-name">Name</Label>
            <Input
              id="p-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="West Pack Line"
            />
          </div>
          <div>
            <Label htmlFor="p-site">Site code</Label>
            <Input
              id="p-site"
              value={siteCode}
              onChange={(e) => setSiteCode(e.target.value)}
              placeholder="WPL-01"
            />
          </div>
          <div>
            <Label htmlFor="p-crit">Criticality</Label>
            <select
              id="p-crit"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={criticality}
              onChange={(e) =>
                setCriticality(e.target.value as PlantCriticality)
              }
            >
              {CRITICALITY.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="p-plc">PLC count</Label>
            <Input
              id="p-plc"
              value={plcCount}
              onChange={(e) => setPlcCount(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="p-notes">Notes</Label>
            <Input
              id="p-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button
            disabled={pending || !name.trim() || !siteCode.trim()}
            onClick={create}
          >
            Register plant
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search site / criticality"
            />
            <Button variant="outline" onClick={() => load(q)}>
              Search
            </Button>
          </div>
          <ul className="space-y-2">
            {items.map((p) => (
              <li
                key={p.id}
                className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-slate-900">{p.name}</p>
                  <Badge variant="secondary">{p.siteCode}</Badge>
                  <Badge>{p.criticality}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {p.plcCount} PLCs · {p.notes || "No notes"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
