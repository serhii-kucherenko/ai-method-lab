"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { CompareResult, TravelerProfile } from "@/store";

export default function ComparePage() {
  const [profiles, setProfiles] = useState<TravelerProfile[]>([]);
  const [compares, setCompares] = useState<CompareResult[]>([]);
  const [profileId, setProfileId] = useState("");
  const [name, setName] = useState("Rules+prefs vs prefs-only");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const [p, c] = await Promise.all([
        api<{ items: TravelerProfile[] }>("/api/profiles"),
        api<{ items: CompareResult[] }>("/api/compare"),
      ]);
      setProfiles(p.items);
      setCompares(c.items);
      if (!profileId && p.items[0]) setProfileId(p.items[0].id);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function run() {
    start(async () => {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ profileId, name }),
      });
      load();
    });
  }

  return (
    <StudioShell
      title="Compare"
      subtitle="Rules+prefs plan quality versus a prefs-only baseline that breaks rules."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-2">
        <div>
          <Label>Profile</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            value={profileId}
            onChange={(e) => setProfileId(e.target.value)}
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Compare name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Button onClick={run} disabled={pending || !profileId}>
            Run dual compare
          </Button>
        </div>
      </div>

      <ul className="space-y-4">
        {compares.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white p-4"
          >
            <p className="font-medium text-slate-900">{c.name}</p>
            <p className="mt-1 text-sm text-slate-500">Winner: {c.winner}</p>
            <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
              <div>
                <p className="font-medium text-[var(--studio-navy)]">
                  A · rules+prefs
                </p>
                <p>Overall {c.rulesPrefs.overall}</p>
                <p>Rules {c.rulesPrefs.ruleCompliance}</p>
                <p>Prefs {c.rulesPrefs.preferenceFit}</p>
                <p>Safety {c.rulesPrefs.safetyMargin}</p>
              </div>
              <div>
                <p className="font-medium text-slate-600">B · prefs-only</p>
                <p>Overall {c.prefsOnly.overall}</p>
                <p>Rules {c.prefsOnly.ruleCompliance}</p>
                <p>Prefs {c.prefsOnly.preferenceFit}</p>
                <p>Safety {c.prefsOnly.safetyMargin}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
