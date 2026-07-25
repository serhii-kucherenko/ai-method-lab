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
  const [hasScene, setHasScene] = useState(false);
  const [hasGen, setHasGen] = useState(false);
  const [hasCompare, setHasCompare] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState("");

  async function refresh() {
    const [packs, scenes, generators, compares, settings] = await Promise.all([
      api<{ items: unknown[] }>("/api/packs"),
      api<{ items: unknown[] }>("/api/scenes"),
      api<{ items: unknown[] }>("/api/generators"),
      api<{ items: unknown[] }>("/api/compare"),
      api<{ org: { name: string } }>("/api/settings"),
    ]);
    setHasPack(packs.items.length > 0);
    setHasScene(scenes.items.length > 0);
    setHasGen(generators.items.length > 0);
    setHasCompare(compares.items.length > 0);
    setOrgName(settings.org.name);
  }

  useEffect(() => {
    refresh().catch((e) => setError(String(e)));
  }, []);

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
        label: "Have at least one scenario pack",
        done: hasPack,
        href: "/packs",
      },
      {
        id: "scene",
        label: "Author a coarse scene",
        done: hasScene,
        href: "/scenes",
      },
      {
        id: "gen",
        label: "Attach a detail generator",
        done: hasGen,
        href: "/generators",
      },
      {
        id: "compare",
        label: "Run hierarchical vs flat compare",
        done: hasCompare,
        href: "/compare",
      },
    ],
    [honesty, orgName, hasPack, hasScene, hasGen, hasCompare],
  );

  const doneCount = checks.filter((c) => c.done).length;
  const pct = Math.round((doneCount / checks.length) * 100);

  return (
    <StudioShell
      title="Onboarding"
      subtitle="First-run checklist with visible progress for AV world-model eval setup."
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
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <label className="flex items-center gap-3 text-sm">
              {c.id === "honesty" ? (
                <input
                  type="checkbox"
                  checked={honesty}
                  onChange={(e) => setHonesty(e.target.checked)}
                />
              ) : (
                <input type="checkbox" checked={c.done} readOnly />
              )}
              <span className={c.done ? "text-slate-900" : "text-slate-500"}>
                {c.label}
              </span>
            </label>
            <Button asChild variant="outline" size="sm">
              <Link href={c.href}>Open</Link>
            </Button>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          className="bg-[var(--studio-signal)]"
          onClick={() => refresh().catch((e) => setError(String(e)))}
        >
          Refresh checklist
        </Button>
        <Button asChild variant="outline">
          <Link href="/demo">Guided demo</Link>
        </Button>
      </div>
      {error ? (
        <p className="mt-4 text-sm text-[var(--studio-signal)]">{error}</p>
      ) : null}
    </StudioShell>
  );
}
