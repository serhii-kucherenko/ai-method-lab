"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/client-api";
import type { GraphSnapshot } from "@/store";

export default function GraphPage() {
  const [graphs, setGraphs] = useState<GraphSnapshot[]>([]);
  const [graphId, setGraphId] = useState("");
  const [graph, setGraph] = useState<GraphSnapshot | null>(null);
  const [startEntityId, setStartEntityId] = useState("");
  const [hops, setHops] = useState(2);
  const [highlight, setHighlight] = useState<{
    entities: string[];
    edges: string[];
  } | null>(null);
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function loadList(search = q) {
    start(async () => {
      try {
        const res = await api<{ items: GraphSnapshot[] }>(
          `/api/graph?q=${encodeURIComponent(search)}&pageSize=20`,
        );
        setGraphs(res.items);
        const first = res.items[0];
        if (first && !graphId) {
          setGraphId(first.id);
          setGraph(first);
          setStartEntityId(first.entities[0]?.id ?? "");
        }
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "load failed");
      }
    });
  }

  useEffect(() => {
    loadList("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectGraph(id: string) {
    setGraphId(id);
    start(async () => {
      try {
        const g = await api<GraphSnapshot>(`/api/graph?id=${encodeURIComponent(id)}`);
        setGraph(g);
        setStartEntityId(g.entities[0]?.id ?? "");
        setHighlight(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "load failed");
      }
    });
  }

  function runHighlight() {
    start(async () => {
      try {
        const res = await api<{ entities: string[]; edges: string[] }>(
          "/api/graph",
          {
            method: "POST",
            body: JSON.stringify({ graphId, startEntityId, hops }),
          },
        );
        setHighlight(res);
      } catch (e) {
        setError(e instanceof Error ? e.message : "highlight failed");
      }
    });
  }

  const hiE = new Set(highlight?.entities ?? []);
  const hiR = new Set(highlight?.edges ?? []);

  return (
    <StudioShell
      title="Graph explorer"
      subtitle="Browse entities and edges from consolidated snapshots. Hop highlight shows neighborhood reach."
    >
      <div className="mb-4 flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder="Search entities"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button variant="outline" onClick={() => loadList()}>
          Search
        </Button>
        <Select value={graphId} onValueChange={selectGraph}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Graph snapshot" />
          </SelectTrigger>
          <SelectContent>
            {graphs.map((g) => (
              <SelectItem key={g.id} value={g.id}>
                {g.id.slice(0, 8)}… ({g.entities.length} nodes)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}

      {graph ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border border-[var(--studio-line)] bg-white p-5">
            <h2 className="font-semibold">Entities</h2>
            <ul className="mt-3 space-y-2">
              {graph.entities.map((e) => (
                <li
                  key={e.id}
                  className={`rounded-md px-3 py-2 text-sm ${
                    hiE.has(e.id)
                      ? "bg-teal-100 text-teal-950"
                      : "bg-slate-50 text-slate-800"
                  }`}
                >
                  <span className="font-medium">{e.name}</span>
                  <span className="ml-2 text-slate-500">{e.kind}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-slate-500">
              Quality overall {graph.quality.overall} ·{" "}
              {graph.quality.duplicatesRemoved} duplicates removed
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--studio-line)] bg-white p-5">
              <h2 className="font-semibold">Edges</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {graph.edges.map((e) => {
                  const from = graph.entities.find((x) => x.id === e.from)?.name;
                  const to = graph.entities.find((x) => x.id === e.to)?.name;
                  return (
                    <li
                      key={e.id}
                      className={`rounded-md px-3 py-2 ${
                        hiR.has(e.id) ? "bg-teal-100" : "bg-slate-50"
                      }`}
                    >
                      {from} —{e.label}→ {to}{" "}
                      <span className="text-slate-500">({e.strength})</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-lg border border-[var(--studio-line)] bg-white p-5">
              <h2 className="font-semibold">Hop highlight</h2>
              <div className="mt-3 flex flex-wrap items-end gap-3">
                <div className="space-y-2">
                  <Label>Start entity</Label>
                  <Select value={startEntityId} onValueChange={setStartEntityId}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {graph.entities.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Hops</Label>
                  <Input
                    type="number"
                    min={1}
                    max={4}
                    className="w-20"
                    value={hops}
                    onChange={(e) => setHops(Number(e.target.value))}
                  />
                </div>
                <Button disabled={pending} onClick={runHighlight}>
                  Highlight
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </StudioShell>
  );
}
