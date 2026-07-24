"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api, API_TOKEN } from "@/lib/client-api";
import type { Candidate } from "@/store";
import type { GenerationMode } from "@/domain/types";

type Page = { items: Candidate[]; total: number };

export default function LibraryPage() {
  const [data, setData] = useState<Page | null>(null);
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<string>("all");
  const [minAffinity, setMinAffinity] = useState("0");
  const [minDiseaseFit, setMinDiseaseFit] = useState("0");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      try {
        const params = new URLSearchParams({
          pageSize: "30",
          q,
          minAffinity,
          minDiseaseFit,
        });
        if (mode !== "all") params.set("mode", mode);
        const res = await api<Page>(`/api/candidates?${params}`);
        setData(res);
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "load_failed");
      }
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function exportJson() {
    const params = new URLSearchParams({ format: "json", q, minAffinity, minDiseaseFit });
    if (mode !== "all") params.set("mode", mode);
    const res = await fetch(`/api/candidates?${params}`, {
      headers: { authorization: `Bearer ${API_TOKEN}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "candidates.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <StudioShell
      title="Candidate library"
      subtitle="Filter ranked SMILES by mode, affinity, and disease fit — then export JSON."
    >
      <div className="mb-6 grid gap-3 md:grid-cols-4">
        <div>
          <Label>Search SMILES</Label>
          <Input value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div>
          <Label>Mode filter</Label>
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="disease_aware">Disease-aware</SelectItem>
              <SelectItem value="disease_blind">Disease-blind</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Min affinity</Label>
          <Input
            value={minAffinity}
            onChange={(e) => setMinAffinity(e.target.value)}
          />
        </div>
        <div>
          <Label>Min disease fit</Label>
          <Input
            value={minDiseaseFit}
            onChange={(e) => setMinDiseaseFit(e.target.value)}
          />
        </div>
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        <Button onClick={load} disabled={pending}>
          Apply filters
        </Button>
        <Button variant="outline" onClick={exportJson}>
          Export JSON
        </Button>
      </div>

      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>SMILES</TableHead>
            <TableHead>Mode</TableHead>
            <TableHead>Affinity</TableHead>
            <TableHead>Disease fit</TableHead>
            <TableHead>Validity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(data?.items ?? []).map((c, i) => (
            <TableRow
              key={c.id}
              className="animate-cand"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <TableCell>{c.rank}</TableCell>
              <TableCell className="max-w-[220px] truncate font-mono text-xs">
                {c.smiles}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{c.mode as GenerationMode}</Badge>
              </TableCell>
              <TableCell>{c.affinityScore}</TableCell>
              <TableCell>{c.diseaseFitScore}</TableCell>
              <TableCell>{c.validityScore}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="mt-3 text-sm text-slate-500">
        {data ? `${data.total} candidates` : "Loading…"}
      </p>
    </StudioShell>
  );
}
