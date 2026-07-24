"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { HardRule, TravelerProfile } from "@/store";

export default function RulesPage() {
  const [profiles, setProfiles] = useState<TravelerProfile[]>([]);
  const [rules, setRules] = useState<HardRule[]>([]);
  const [profileId, setProfileId] = useState("");
  const [name, setName] = useState("");
  const [kind, setKind] = useState("safety");
  const [constraint, setConstraint] = useState("");
  const [severity, setSeverity] = useState("0.8");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const [p, r] = await Promise.all([
        api<{ items: TravelerProfile[] }>("/api/profiles"),
        api<{ items: HardRule[] }>("/api/rules"),
      ]);
      setProfiles(p.items);
      setRules(r.items);
      if (!profileId && p.items[0]) setProfileId(p.items[0].id);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      await api("/api/rules", {
        method: "POST",
        body: JSON.stringify({
          profileId,
          name,
          kind,
          constraint,
          severity: Number(severity),
        }),
      });
      setName("");
      setConstraint("");
      load();
    });
  }

  return (
    <StudioShell
      title="Hard rules"
      subtitle="Safety, luggage limits, and dependency constraints that must hold."
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
          <Label>Kind</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            <option value="safety">safety</option>
            <option value="luggage">luggage</option>
            <option value="dependency">dependency</option>
            <option value="policy">policy</option>
          </select>
        </div>
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Constraint</Label>
          <Input
            value={constraint}
            onChange={(e) => setConstraint(e.target.value)}
            placeholder="e.g. liquids_max_100ml_cabin"
          />
        </div>
        <div>
          <Label>Severity (0–1)</Label>
          <Input
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button
            onClick={create}
            disabled={pending || !name || !constraint || !profileId}
          >
            Add hard rule
          </Button>
        </div>
      </div>

      <ul className="space-y-3">
        {rules.map((r) => (
          <li
            key={r.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white px-4 py-3"
          >
            <p className="font-medium text-slate-900">{r.name}</p>
            <p className="text-sm text-slate-500">
              {r.kind} · severity {r.severity} · {r.constraint}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
