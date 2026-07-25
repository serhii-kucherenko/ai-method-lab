"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { DepartmentKind, DepartmentTag } from "@/store";

const DEPTS: DepartmentKind[] = [
  "dermatology",
  "radiology",
  "ophthalmology",
  "orthopedics",
  "general",
];

export default function DepartmentsPage() {
  const [items, setItems] = useState<DepartmentTag[]>([]);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState<DepartmentKind>("dermatology");
  const [coverage, setCoverage] = useState("0.6");
  const [error, setError] = useState("");

  async function load() {
    const res = await api<{ items: DepartmentTag[] }>("/api/departments");
    setItems(res.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/departments", {
        method: "POST",
        body: JSON.stringify({
          name,
          department,
          coverage: Number(coverage),
        }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Department coverage"
      subtitle="Map where your multimodal consult eval set is strong or thin."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3"
      >
        <Input
          placeholder="Coverage label"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={department}
          onChange={(e) => setDepartment(e.target.value as DepartmentKind)}
        >
          {DEPTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <Input
          placeholder="Coverage 0–1"
          value={coverage}
          onChange={(e) => setCoverage(e.target.value)}
        />
        <div className="md:col-span-3">
          <Button type="submit">Add department tag</Button>
        </div>
        {error ? <p className="md:col-span-3 text-sm text-red-700">{error}</p> : null}
      </form>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((d) => (
          <div
            key={d.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <h2 className="font-[family-name:var(--font-display)] text-lg">
              {d.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {d.department} · coverage {(d.coverage * 100).toFixed(0)}% ·{" "}
              {d.caseCount} cases
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded bg-slate-200">
              <div
                className="h-full bg-[var(--studio-mint)] transition-all"
                style={{ width: `${Math.min(100, d.coverage * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </StudioShell>
  );
}
