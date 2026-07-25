"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

type Check = { id: string; label: string; done: boolean; href: string };

export default function OnboardingPage() {
  const [honesty, setHonesty] = useState(false);
  const [hasPack, setHasPack] = useState(false);
  const [hasRoute, setHasRoute] = useState(false);
  const [hasMemory, setHasMemory] = useState(false);
  const [hasCompare, setHasCompare] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState("");

  async function refresh() {
    const [packs, routes, memory, compares, settings] = await Promise.all([
      api<{ items: unknown[] }>("/api/packs"),
      api<{ items: unknown[] }>("/api/routes"),
      api<{ items: unknown[] }>("/api/memory"),
      api<{ items: unknown[] }>("/api/compare"),
      api<{ org: { name: string; honestyAckedAt: string | null } }>(
        "/api/settings",
      ),
    ]);
    setHasPack(packs.items.length > 0);
    setHasRoute(routes.items.length > 0);
    setHasMemory(memory.items.length > 0);
    setHasCompare(compares.items.length > 0);
    setOrgName(settings.org.name);
    if (settings.org.honestyAckedAt) setHonesty(true);
  }

  useEffect(() => {
    refresh().catch((e) => setError(String(e)));
  }, []);

  async function ackHonesty() {
    setHonesty(true);
    try {
      await api("/api/settings", {
        method: "PATCH",
        body: JSON.stringify({ honestyAckedAt: new Date().toISOString() }),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  const checks: Check[] = useMemo(
    () => [
      {
        id: "honesty",
        label: "Acknowledge soft-sim honesty fence",
        done: honesty,
        href: "/honesty",
      },
      {
        id: "org",
        label: `Confirm org settings (${orgName || "…"})`,
        done: Boolean(orgName),
        href: "/settings",
      },
      {
        id: "pack",
        label: "Have at least one route pack",
        done: hasPack,
        href: "/packs",
      },
      {
        id: "route",
        label: "Add a candidate multi-step route",
        done: hasRoute,
        href: "/routes",
      },
      {
        id: "memory",
        label: "Record a search-memory cell",
        done: hasMemory,
        href: "/memory",
      },
      {
        id: "compare",
        label: "Run structured-memory vs naive compare",
        done: hasCompare,
        href: "/compare",
      },
    ],
    [honesty, orgName, hasPack, hasRoute, hasMemory, hasCompare],
  );

  const doneCount = checks.filter((c) => c.done).length;
  const pct = Math.round((doneCount / checks.length) * 100);

  return (
    <StudioShell
      title="Onboarding"
      subtitle="First-run checklist with visible progress for synthesis-planning setup."
    >
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm text-slate-600">
          <span>Progress</span>
          <span>
            {doneCount}/{checks.length} · {pct}%
          </span>
        </div>
        <div className="h-2 rounded bg-slate-200">
          <div
            className="h-2 rounded bg-[var(--studio-teal)] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <ul className="space-y-3">
        {checks.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <span className={c.done ? "text-[var(--studio-teal)]" : ""}>
              {c.done ? "✓ " : "○ "}
              {c.label}
            </span>
            <Button asChild variant="outline" size="sm">
              <Link href={c.href}>Open</Link>
            </Button>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button className="bg-[var(--studio-teal)]" onClick={ackHonesty}>
          Acknowledge honesty
        </Button>
        <Button variant="outline" onClick={() => refresh().catch(setError)}>
          Refresh checklist
        </Button>
      </div>
      {error ? (
        <p className="mt-4 text-sm text-[var(--studio-amber)]">{String(error)}</p>
      ) : null}
    </StudioShell>
  );
}
