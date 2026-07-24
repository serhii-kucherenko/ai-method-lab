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
  ScanProfile,
  ScoreMode,
} from "@/store";

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [audits, setAudits] = useState<AuditEntry[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("operator");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const [o, m, a] = await Promise.all([
        api<OrgSettings>("/api/settings"),
        api<{ items: Member[] }>("/api/members"),
        api<{ items: AuditEntry[] }>("/api/audits?page=1&pageSize=20"),
      ]);
      setOrg(o);
      setMembers(m.items);
      setAudits(a.items);
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
        const updated = await api<OrgSettings>("/api/settings", {
          method: "PATCH",
          body: JSON.stringify(org),
        });
        setOrg(updated);
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

  async function exportCsv() {
    const text = await api<string>("/api/audits?export=csv");
    const blob = new Blob([text], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audits.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!org) {
    return (
      <StudioShell title="Settings" subtitle="Loading org…">
        <p className="text-slate-500">Loading…</p>
      </StudioShell>
    );
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Org name, members, webhook secret, bearer token, and audit export."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Organization</p>
          <div>
            <Label htmlFor="o-name">Name</Label>
            <Input
              id="o-name"
              value={org.name}
              onChange={(e) => setOrg({ ...org, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="o-url">Webhook URL</Label>
            <Input
              id="o-url"
              value={org.webhookUrl}
              onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="o-secret">Webhook secret</Label>
            <Input
              id="o-secret"
              value={org.webhookSecret}
              onChange={(e) =>
                setOrg({ ...org, webhookSecret: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="o-token">Bearer token</Label>
            <Input
              id="o-token"
              value={org.bearerToken}
              onChange={(e) => setOrg({ ...org, bearerToken: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="o-profile">Default profile</Label>
              <select
                id="o-profile"
                className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                value={org.defaultProfile}
                onChange={(e) =>
                  setOrg({
                    ...org,
                    defaultProfile: e.target.value as ScanProfile,
                  })
                }
              >
                <option value="balanced">balanced</option>
                <option value="strict">strict</option>
              </select>
            </div>
            <div>
              <Label htmlFor="o-mode">Default mode</Label>
              <select
                id="o-mode"
                className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                value={org.defaultMode}
                onChange={(e) =>
                  setOrg({ ...org, defaultMode: e.target.value as ScoreMode })
                }
              >
                <option value="fb-aware">fb-aware</option>
                <option value="dropped-fb">dropped-fb</option>
              </select>
            </div>
          </div>
          <div>
            <Label htmlFor="o-rate">Rate limit / min</Label>
            <Input
              id="o-rate"
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
          <Button disabled={pending} onClick={save}>
            Save settings
          </Button>
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
            <ul className="space-y-1 text-sm text-slate-500">
              {members.map((m) => (
                <li key={m.id} className="flex items-center gap-2">
                  {m.email} <Badge variant="secondary">{m.role}</Badge>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-slate-900">Audit log</p>
              <Button variant="outline" size="sm" onClick={exportCsv}>
                Export CSV
              </Button>
            </div>
            <ul className="max-h-64 space-y-2 overflow-auto text-sm text-slate-500">
              {audits.map((a) => (
                <li key={a.id}>
                  <span className="text-slate-700">{a.action}</span> · {a.actor}{" "}
                  · {a.detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </StudioShell>
  );
}
