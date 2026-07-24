"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
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
import { api } from "@/lib/client-api";
import type { Artifact, ArtifactKind } from "@/store";

export default function ArtifactsPage() {
  const [items, setItems] = useState<Artifact[]>([]);
  const [kind, setKind] = useState<string>("all");
  const [pending, start] = useTransition();

  function load(k = kind) {
    start(async () => {
      const qs =
        k === "all" ? "pageSize=50" : `kind=${encodeURIComponent(k)}&pageSize=50`;
      const res = await api<{ items: Artifact[] }>(`/api/artifacts?${qs}`);
      setItems(res.items);
    });
  }

  useEffect(() => {
    load("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StudioShell
      title="IR / binary artifact browser"
      subtitle="Inspect MLIR, optimized IR, binary, and report snapshots from compile runs."
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Select
          value={kind}
          onValueChange={(v) => {
            setKind(v);
            load(v);
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Kind filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All kinds</SelectItem>
            <SelectItem value="mlir">mlir</SelectItem>
            <SelectItem value="optimized_ir">optimized_ir</SelectItem>
            <SelectItem value="binary">binary</SelectItem>
            <SelectItem value="report">report</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" disabled={pending} onClick={() => load(kind)}>
          Refresh
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Label</TableHead>
            <TableHead>Kind</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((a, i) => (
            <TableRow
              key={a.id}
              className="animate-artifact-fade"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <TableCell className="font-medium">{a.label}</TableCell>
              <TableCell>
                <Badge variant="secondary">{a.kind as ArtifactKind}</Badge>
              </TableCell>
              <TableCell>{a.sizeKb} KB</TableCell>
              <TableCell className="max-w-sm truncate text-slate-600">
                {a.notes || "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StudioShell>
  );
}
