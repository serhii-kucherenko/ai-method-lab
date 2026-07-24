"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { Member, OrgSettings } from "@/store";

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("planner");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const [o, m, f] = await Promise.all([
        api<OrgSettings>("/api/settings"),
        api<{ items: Member[] }>("/api/members"),
        api<{ items: string[] }>("/api/features"),
      ]);
      setOrg(o);
      setMembers(m.items);
      setFeatures(f.items);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function save() {
    if (!org) return;
    start(async () => {
      try {
        const next = await api<OrgSettings>("/api/settings", {
          method: "PUT",
          body: JSON.stringify(org),
        });
        setOrg(next);
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  function invite() {
    start(async () => {
      try {
        await api("/api/members", {
          method: "POST",
          body: JSON.stringify({ email, role }),
        });
        setEmail("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Org name, webhook, members, and feature inventory."
    >
      {org ? (
        <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-2">
          <div>
            <Label>Org name</Label>
            <Input
              value={org.name}
              onChange={(e) => setOrg({ ...org, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Webhook URL</Label>
            <Input
              value={org.webhookUrl}
              onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
            />
          </div>
          <div>
            <Label>Webhook secret</Label>
            <Input
              value={org.webhookSecret}
              onChange={(e) =>
                setOrg({ ...org, webhookSecret: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Rate limit / min</Label>
            <Input
              value={String(org.rateLimitPerMinute)}
              onChange={(e) =>
                setOrg({
                  ...org,
                  rateLimitPerMinute: Number(e.target.value) || 120,
                })
              }
            />
          </div>
          <div className="md:col-span-2">
            <Button onClick={save} disabled={pending}>
              Save settings
            </Button>
          </div>
        </div>
      ) : null}

      <div className="mb-8 rounded-lg border border-[var(--studio-line)] bg-white p-4">
        <p className="font-medium text-slate-900">Invite member</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Input
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="max-w-xs"
          />
          <select
            className="flex h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="owner">owner</option>
            <option value="planner">planner</option>
            <option value="viewer">viewer</option>
          </select>
          <Button onClick={invite} disabled={pending || !email}>
            Invite
          </Button>
        </div>
        <ul className="mt-4 space-y-1 text-sm text-slate-600">
          {members.map((m) => (
            <li key={m.id}>
              {m.email} · {m.role}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8 rounded-lg border border-[var(--studio-line)] bg-white p-4">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => {
              start(async () => {
                const text = await api<string>("/api/export/audits");
                const blob = new Blob([text], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "audits.csv";
                a.click();
                URL.revokeObjectURL(url);
              });
            }}
          >
            Export audits CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              start(async () => {
                await api("/api/audits");
              });
            }}
          >
            Refresh audits
          </Button>
        </div>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      </div>

      <div className="rounded-lg border border-[var(--studio-line)] bg-white p-4">
        <p className="font-medium text-slate-900">
          Features ({features.length})
        </p>
        <ul className="mt-3 grid gap-1 text-sm text-slate-600 md:grid-cols-2">
          {features.map((f) => (
            <li key={f}>· {f}</li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
