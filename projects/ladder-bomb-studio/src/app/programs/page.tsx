"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { LadderDialect, LadderProgram, Plant } from "@/store";

const DIALECTS: LadderDialect[] = ["ld", "fbd", "sfc", "st", "il"];

export default function ProgramsPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [items, setItems] = useState<LadderProgram[]>([]);
  const [plantId, setPlantId] = useState("");
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [dialect, setDialect] = useState<LadderDialect>("ld");
  const [fbCount, setFbCount] = useState("6");
  const [lineCount, setLineCount] = useState("320");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(search = q, plant = plantId) {
    start(async () => {
      const qs = new URLSearchParams({
        page: "1",
        pageSize: "20",
        q: search,
      });
      if (plant) qs.set("plantId", plant);
      const res = await api<{ items: LadderProgram[] }>(
        `/api/programs?${qs.toString()}`,
      );
      setItems(res.items);
    });
  }

  useEffect(() => {
    start(async () => {
      const res = await api<{ items: Plant[] }>(
        "/api/plants?page=1&pageSize=50",
      );
      setPlants(res.items);
      if (res.items[0]) setPlantId(res.items[0].id);
      const prog = await api<{ items: LadderProgram[] }>(
        "/api/programs?page=1&pageSize=20",
      );
      setItems(prog.items);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api<LadderProgram>("/api/programs", {
          method: "POST",
          body: JSON.stringify({
            plantId,
            name,
            dialect,
            fbCount: Number(fbCount),
            lineCount: Number(lineCount),
            notes,
          }),
        });
        setName("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Programs"
      subtitle="IEC 61131-3 ladder library — dialects, FB counts, and import notes."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Import program</p>
          <div>
            <Label htmlFor="pr-plant">Plant</Label>
            <select
              id="pr-plant"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={plantId}
              onChange={(e) => setPlantId(e.target.value)}
            >
              {plants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="pr-name">Name</Label>
            <Input
              id="pr-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Conveyor interlock LD"
            />
          </div>
          <div>
            <Label htmlFor="pr-dialect">Dialect</Label>
            <select
              id="pr-dialect"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={dialect}
              onChange={(e) => setDialect(e.target.value as LadderDialect)}
            >
              {DIALECTS.map((d) => (
                <option key={d} value={d}>
                  {d.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="pr-fb">FB count</Label>
              <Input
                id="pr-fb"
                value={fbCount}
                onChange={(e) => setFbCount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="pr-lines">Line count</Label>
              <Input
                id="pr-lines"
                value={lineCount}
                onChange={(e) => setLineCount(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="pr-notes">Notes</Label>
            <Input
              id="pr-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button
            disabled={pending || !name.trim() || !plantId}
            onClick={create}
          >
            Import program
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search dialect / notes"
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
                  <Badge variant="secondary">{p.dialect.toUpperCase()}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {p.fbCount} FBs · {p.lineCount} lines · {p.notes || "No notes"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
