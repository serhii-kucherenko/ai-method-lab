"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { DomainKind, RulePack } from "@/store";

const DOMAINS: DomainKind[] = [
  "physics",
  "chemistry",
  "biology",
  "math",
  "materials",
];

export default function RulesPage() {
  const [items, setItems] = useState<RulePack[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [domainKind, setDomainKind] = useState<DomainKind>("physics");
  const [coverage, setCoverage] = useState("0.75");
  const [ruleCount, setRuleCount] = useState("12");
  const [error, setError] = useState("");
  const [checklist, setChecklist] = useState(false);

  async function load(search = q) {
    const res = await api<{ items: RulePack[] }>(
      `/api/rules?q=${encodeURIComponent(search)}`,
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
      await api("/api/rules", {
        method: "POST",
        body: JSON.stringify({
          name,
          domainKind,
          coverage: Number(coverage),
          ruleCount: Number(ruleCount),
          status: "active",
          notes: "Captured from rules page",
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
      title="Scientific rule packs"
      subtitle="Define the rule-based domain your agents must respect before any fluent answer ships."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <label className="flex items-start gap-2 text-sm text-stone-600">
          <input
            type="checkbox"
            checked={checklist}
            onChange={(e) => setChecklist(e.target.checked)}
            className="mt-1"
          />
          <span>
            Onboarding: confirm packs encode scientific constraints (not prompt
            fluff), and that this studio is a method-lab planner — not a live
            LLM gateway. Guide:{" "}
            <a
              className="text-[var(--studio-amber)] underline-offset-2 hover:underline"
              href="/docs/guides/60-reason-frame-studio-lessons.md"
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
          placeholder="Pack name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={domainKind}
          onChange={(e) => setDomainKind(e.target.value as DomainKind)}
        >
          {DOMAINS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <Input
          type="number"
          step="0.01"
          placeholder="Coverage"
          value={coverage}
          onChange={(e) => setCoverage(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Rule count"
          value={ruleCount}
          onChange={(e) => setRuleCount(e.target.value)}
        />
        <div className="flex gap-2 md:col-span-2">
          <Button type="submit">Add rule pack</Button>
          <Input
            placeholder="Search packs"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => load().catch((e) => setError(String(e)))}
          >
            Search
          </Button>
        </div>
      </form>

      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-[family-name:var(--font-display)] text-lg">
                {item.name}
              </h2>
              <span className="text-xs uppercase tracking-wide text-stone-500">
                {item.domainKind} · {item.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-stone-600">
              coverage {(item.coverage * 100).toFixed(0)}% · {item.ruleCount}{" "}
              rules
            </p>
            {item.notes ? (
              <p className="mt-2 text-sm text-stone-500">{item.notes}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
