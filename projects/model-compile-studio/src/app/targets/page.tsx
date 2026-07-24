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
import type { TargetProfile } from "@/store";

export default function TargetsPage() {
  const [items, setItems] = useState<TargetProfile[]>([]);
  const [name, setName] = useState("");
  const [accel, setAccel] = useState("NPU-class");
  const [mem, setMem] = useState("16");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const res = await api<{ items: TargetProfile[] }>("/api/targets?pageSize=50");
      setItems(res.items);
    });
  }

  useEffect(() => {
    load();
  }, []);

  function create() {
    start(async () => {
      try {
        await api("/api/targets", {
          method: "POST",
          body: JSON.stringify({
            name,
            acceleratorClass: accel,
            memoryGb: Number(mem) || 8,
            notes,
          }),
        });
        setName("");
        setNotes("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Accelerator / target profiles"
      subtitle="Soft target profiles for plan affinity — not productized chip timing claims."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="t-name">Name</Label>
          <Input id="t-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="t-accel">Accelerator class</Label>
          <Input id="t-accel" value={accel} onChange={(e) => setAccel(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="t-mem">Memory (GB)</Label>
          <Input id="t-mem" value={mem} onChange={(e) => setMem(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="t-notes">Notes</Label>
          <Input id="t-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Button disabled={pending || !name} onClick={create}>
            Create target profile
          </Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Memory</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-medium">{t.name}</TableCell>
              <TableCell>{t.acceleratorClass}</TableCell>
              <TableCell>{t.memoryGb} GB</TableCell>
              <TableCell className="max-w-xs truncate text-slate-600">
                {t.notes || "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StudioShell>
  );
}
