"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

type Check = {
  id: string;
  label: string;
  href: string;
  done: boolean;
};

export default function OnboardingPage() {
  const [orgOk, setOrgOk] = useState(false);
  const [packOk, setPackOk] = useState(false);
  const [compareOk, setCompareOk] = useState(false);
  const [honestyAck, setHonestyAck] = useState(false);
  const [memberOk, setMemberOk] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  async function refresh() {
    const org = await api<{ org: { name: string } }>("/api/settings");
    setOrgOk(Boolean(org.org.name));
    const packs = await api<{ items: unknown[] }>("/api/packs");
    setPackOk(packs.items.length > 0);
    const cmp = await api<{ items: unknown[] }>("/api/compare");
    setCompareOk(cmp.items.length > 0);
    const members = await api<{ items: unknown[] }>("/api/members");
    setMemberOk(members.items.length > 0);
  }

  useEffect(() => {
    refresh().catch((e) => setError(String(e)));
    try {
      setHonestyAck(localStorage.getItem("tfs-honesty") === "1");
    } catch {
      /* ignore */
    }
  }, []);

  const checks: Check[] = useMemo(
    () => [
      {
        id: "org",
        label: "Confirm org settings",
        href: "/settings",
        done: orgOk,
      },
      {
        id: "pack",
        label: "Have at least one terrain pack",
        href: "/packs",
        done: packOk,
      },
      {
        id: "compare",
        label: "Run one physics-aware vs naive compare",
        href: "/compare",
        done: compareOk,
      },
      {
        id: "member",
        label: "Org has a member",
        href: "/settings",
        done: memberOk,
      },
      {
        id: "honesty",
        label: "Acknowledge soft-sim honesty fence",
        href: "/honesty",
        done: honestyAck,
      },
    ],
    [orgOk, packOk, compareOk, memberOk, honestyAck],
  );

  const doneCount = checks.filter((c) => c.done).length;
  const pct = Math.round((doneCount / checks.length) * 100);

  async function seedPack() {
    setError("");
    setMsg("");
    try {
      await api("/api/packs", {
        method: "POST",
        body: JSON.stringify({
          label: `Onboard pack ${Date.now()}`,
          region: "Demo foothills",
          elevationSpanM: 540,
          fuelLoadIndex: 0.48,
          version: "onboard.1",
        }),
      });
      setMsg("Seeded a demo pack.");
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  function ackHonesty() {
    try {
      localStorage.setItem("tfs-honesty", "1");
    } catch {
      /* ignore */
    }
    setHonestyAck(true);
  }

  return (
    <StudioShell
      title="Onboarding"
      subtitle="First-run checklist with visible progress for GIS leads."
    >
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm">
          <span>
            Progress {doneCount}/{checks.length}
          </span>
          <span>{pct}%</span>
        </div>
        <div className="h-3 rounded-full bg-stone-200">
          <div
            className="h-3 rounded-full bg-[var(--studio-ember)] transition-all"
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
            <span>
              {c.done ? "✓" : "○"} {c.label}
            </span>
            <Button asChild variant="outline" size="sm">
              <Link href={c.href}>Open</Link>
            </Button>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button onClick={seedPack}>Seed demo pack</Button>
        <Button variant="outline" onClick={ackHonesty}>
          Acknowledge honesty
        </Button>
        <Button
          variant="outline"
          onClick={() => refresh().catch((e) => setError(String(e)))}
        >
          Refresh checklist
        </Button>
      </div>
      {msg ? <p className="mt-3 text-sm text-[var(--studio-ridge)]">{msg}</p> : null}
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
    </StudioShell>
  );
}
