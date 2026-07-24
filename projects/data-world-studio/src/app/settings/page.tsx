"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type {
  AuditEntry,
  Member,
  MemberRole,
  OrgSettings,
  PlanProfile,
  ScoreMode,
} from "@/store";

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [audits, setAudits] = useState<AuditEntry[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("operator");
  const [features, setFeatures] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const [settings, mem, aud, feat] = await Promise.all([
        api<OrgSettings>("/api/settings"),
        api<{ items: Member[] }>("/api/members"),
        api<{ items: AuditEntry[] }>("/api/audits?page=1&pageSize=20"),
        api<{ items: string[] }>("/api/features"),
      ]);
      setOrg(settings);
      setMembers(mem.items);
      setAudits(aud.items);
      setFeatures(feat.items);
    });
  }

  useEffect(() => {
    load();
  }, []);

  function saveOrg() {
    if (!org) return;
    start(async () => {
      try {
        const next = await api<OrgSettings>("/api/settings", {
          method: "PUT",
          body: JSON.stringify(org),
        });
        setOrg(next);
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  function invite() {
    start(async () => {
      try {
        await api<Member>("/api/members", {
          method: "POST",
          body: JSON.stringify({ email, role }),
        });
        setEmail("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  async function exportCsv() {
    const csv = await api<string>("/api/audits?format=csv");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audits.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function exportForecasts() {
    const json = await api<string>("/api/forecasts?format=json");
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "forecasts.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!org) {
    return (
      <StudioShell title="Settings" subtitle="Loading org settings…">
        <p className="text-slate-500">Loading…</p>
      </StudioShell>
    );
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Org name, default forecast mode, webhook secret, members, and exports."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Organization</p>
          <div>
            <Label htmlFor="s-name">Name</Label>
            <Input
              id="s-name"
              value={org.name}
              onChange={(e) => setOrg({ ...org, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="s-mode">Default mode</Label>
            <select
              id="s-mode"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={org.defaultMode}
              onChange={(e) =>
                setOrg({ ...org, defaultMode: e.target.value as ScoreMode })
              }
            >
              <option value="world-model">world-model</option>
              <option value="trial-error">trial-error</option>
            </select>
          </div>
          <div>
            <Label htmlFor="s-profile">Default profile</Label>
            <select
              id="s-profile"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={org.defaultProfile}
              onChange={(e) =>
                setOrg({
                  ...org,
                  defaultProfile: e.target.value as PlanProfile,
                })
              }
            >
              <option value="balanced">balanced</option>
              <option value="aggressive">aggressive</option>
            </select>
          </div>
          <div>
            <Label htmlFor="s-url">Webhook URL</Label>
            <Input
              id="s-url"
              value={org.webhookUrl}
              onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="s-secret">Webhook secret</Label>
            <Input
              id="s-secret"
              value={org.webhookSecret}
              onChange={(e) =>
                setOrg({ ...org, webhookSecret: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="s-rl">Rate limit / min</Label>
            <Input
              id="s-rl"
              value={String(org.rateLimitPerMinute)}
              onChange={(e) =>
                setOrg({
                  ...org,
                  rateLimitPerMinute: Number(e.target.value) || 60,
                })
              }
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending} onClick={saveOrg}>
            Save settings
          </Button>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button variant="outline" onClick={exportCsv}>
              Export audits CSV
            </Button>
            <Button variant="outline" onClick={exportForecasts}>
              Export forecasts JSON
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
            <p className="font-medium text-slate-900">Invite member</p>
            <div>
              <Label htmlFor="m-email">Email</Label>
              <Input
                id="m-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="m-role">Role</Label>
              <select
                id="m-role"
                className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                value={role}
                onChange={(e) => setRole(e.target.value as MemberRole)}
              >
                <option value="owner">owner</option>
                <option value="operator">operator</option>
                <option value="viewer">viewer</option>
              </select>
            </div>
            <Button disabled={pending || !email.trim()} onClick={invite}>
              Invite
            </Button>
            <ul className="space-y-1 pt-2">
              {members.map((m) => (
                <li key={m.id} className="flex items-center gap-2 text-sm">
                  <span>{m.email}</span>
                  <Badge variant="secondary">{m.role}</Badge>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
            <p className="font-medium text-slate-900">
              Features ({features.length})
            </p>
            <ul className="mt-2 max-h-40 list-disc space-y-1 overflow-auto pl-5 text-xs text-slate-500">
              {features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
            <p className="font-medium text-slate-900">Recent audits</p>
            <ul className="mt-2 max-h-48 space-y-2 overflow-auto text-xs text-slate-500">
              {audits.map((a) => (
                <li key={a.id}>
                  <span className="text-slate-700">{a.action}</span> · {a.detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </StudioShell>
  );
}
