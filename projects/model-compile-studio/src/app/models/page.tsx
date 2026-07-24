"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/client-api";
import type { ModelProject } from "@/store";

type Page = {
  items: ModelProject[];
  page: number;
  total: number;
};

export default function ModelsPage() {
  const [data, setData] = useState<Page | null>(null);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [family, setFamily] = useState("decoder");
  const [scale, setScale] = useState("7B");
  const [tags, setTags] = useState("chat, demo");
  const [params, setParams] = useState("7");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(query = q) {
    start(async () => {
      const res = await api<Page>(
        `/api/models?q=${encodeURIComponent(query)}&page=1&pageSize=20`,
      );
      setData(res);
    });
  }

  useEffect(() => {
    load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api("/api/models", {
          method: "POST",
          body: JSON.stringify({
            name,
            family,
            parameterScale: scale,
            tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
            parameterBillion: Number(params) || 1,
          }),
        });
        setName("");
        setError("");
        load(q);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Model registry"
      subtitle="Register LLM projects, search by family / scale / tags, then open the compile console."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-white p-4">
        <p className="font-medium text-[var(--studio-cyan-ink)]">Onboarding</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-600">
          <li>Create or select a model project</li>
          <li>Add a target profile under Targets</li>
          <li>Run a multi-pass plan in Compile</li>
          <li>Compare against single-pass on Compare</li>
        </ol>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Input
          placeholder="Search family, scale, tags…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button variant="outline" disabled={pending} onClick={() => load(q)}>
          Search
        </Button>
        <Button asChild variant="secondary">
          <Link href="/compile">Open compile console</Link>
        </Button>
      </div>

      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <Label htmlFor="m-name">Name</Label>
          <Input id="m-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="m-family">Family</Label>
          <Input id="m-family" value={family} onChange={(e) => setFamily(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="m-scale">Parameter scale</Label>
          <Input id="m-scale" value={scale} onChange={(e) => setScale(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="m-tags">Tags</Label>
          <Input id="m-tags" value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="m-params">Parameters (B)</Label>
          <Input id="m-params" value={params} onChange={(e) => setParams(e.target.value)} />
        </div>
        <div className="flex items-end">
          <Button disabled={pending || !name} onClick={create}>
            Create model
          </Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Family</TableHead>
            <TableHead>Scale</TableHead>
            <TableHead>Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(data?.items ?? []).map((m) => (
            <TableRow key={m.id}>
              <TableCell className="font-medium">{m.name}</TableCell>
              <TableCell>{m.family}</TableCell>
              <TableCell>{m.parameterScale}</TableCell>
              <TableCell className="flex flex-wrap gap-1">
                {m.tags.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="mt-3 text-sm text-slate-500">
        {data ? `${data.total} models` : "Loading…"}
      </p>
    </StudioShell>
  );
}
