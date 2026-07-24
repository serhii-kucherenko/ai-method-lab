"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/client-api";
import type { CorpusProject } from "@/store";

type Page = {
  items: CorpusProject[];
  total: number;
  page: number;
};

export default function CorporaPage() {
  const [data, setData] = useState<Page | null>(null);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [domainTag, setDomainTag] = useState("medical");
  const [docCount, setDocCount] = useState(20);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function load(search = q) {
    start(async () => {
      try {
        const res = await api<Page>(
          `/api/corpora?q=${encodeURIComponent(search)}&page=1&pageSize=20`,
        );
        setData(res);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "load failed");
      }
    });
  }

  useEffect(() => {
    load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api("/api/corpora", {
          method: "POST",
          body: JSON.stringify({ name, domainTag, docCount }),
        });
        setName("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : "create failed");
      }
    });
  }

  return (
    <StudioShell
      title="Corpora"
      subtitle="Corpus projects for GraphRAG construction — domain tag and document count drive pipeline extract load."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <form
          className="space-y-4 rounded-lg border border-[var(--studio-line)] bg-white p-5"
          onSubmit={(e) => {
            e.preventDefault();
            create();
          }}
        >
          <h2 className="font-semibold text-slate-900">New corpus</h2>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tag">Domain tag</Label>
            <Input
              id="tag"
              value={domainTag}
              onChange={(e) => setDomainTag(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="docs">Document count</Label>
            <Input
              id="docs"
              type="number"
              min={1}
              value={docCount}
              onChange={(e) => setDocCount(Number(e.target.value))}
            />
          </div>
          <Button type="submit" disabled={pending || !name.trim()}>
            Create corpus
          </Button>
        </form>

        <div>
          <div className="mb-4 flex gap-2">
            <Input
              placeholder="Search corpora"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Button type="button" variant="outline" onClick={() => load()}>
              Search
            </Button>
          </div>
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Docs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data?.items ?? []).map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.domainTag}</TableCell>
                  <TableCell>{c.docCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="mt-2 text-sm text-slate-500">
            {data?.total ?? 0} corpora
          </p>
        </div>
      </div>
    </StudioShell>
  );
}
