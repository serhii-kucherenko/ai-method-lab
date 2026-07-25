"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { ConsultCase, DepartmentKind } from "@/store";

const DEPTS: DepartmentKind[] = [
  "dermatology",
  "radiology",
  "ophthalmology",
  "orthopedics",
  "general",
];

export default function CasesPage() {
  const [items, setItems] = useState<ConsultCase[]>([]);
  const [q, setQ] = useState("");
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState<DepartmentKind>("dermatology");
  const [complaint, setComplaint] = useState("");
  const [error, setError] = useState("");
  const [checklist, setChecklist] = useState(false);

  async function load(search = q) {
    const res = await api<{ items: ConsultCase[] }>(
      `/api/cases?q=${encodeURIComponent(search)}`,
    );
    setItems(res.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/cases", {
        method: "POST",
        body: JSON.stringify({
          title,
          department,
          chiefComplaint: complaint,
          status: "active",
          notes: "Captured from cases page",
        }),
      });
      setTitle("");
      setComplaint("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Consult case registry"
      subtitle="Register consult moments where the next reply may depend on an attached image."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <label className="flex items-start gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={checklist}
            onChange={(e) => setChecklist(e.target.checked)}
            className="mt-1"
          />
          <span>
            Onboarding: cases are method-lab eval fixtures — not live patient
            records. Guide:{" "}
            <a
              className="text-[var(--studio-mint-deep)] underline-offset-2 hover:underline"
              href="/docs/guides/61-consult-bench-studio-lessons.md"
            >
              lessons
            </a>
          </span>
        </label>
      </div>

      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
      >
        <Input
          placeholder="Case title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          className="md:col-span-2"
          placeholder="Chief complaint"
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
        />
        <div className="md:col-span-2 flex flex-wrap gap-2">
          <Button type="submit">Add case</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const params = new URLSearchParams({ q });
              load(q).catch((e) => setError(String(e)));
              void params;
            }}
          >
            Search
          </Button>
          <Input
            className="max-w-xs"
            placeholder="Search cases"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        {error ? <p className="md:col-span-2 text-sm text-red-700">{error}</p> : null}
      </form>

      <ul className="space-y-3">
        {items.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-[family-name:var(--font-display)] text-lg text-slate-900">
                {c.title}
              </h2>
              <span className="text-xs uppercase tracking-wide text-slate-500">
                {c.department} · {c.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{c.chiefComplaint || "—"}</p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
