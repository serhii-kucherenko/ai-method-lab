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
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [auditsCsv, setAuditsCsv] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const [o, m] = await Promise.all([
        api<OrgSettings>("/api/settings"),
        api<{ items: Member[] }>("/api/members"),
      ]);
      setOrg(o);
      setMembers(m.items);
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
          method: "PATCH",
          body: JSON.stringify({
            name: org.name,
            webhookUrl: org.webhookUrl,
            rateLimitPerMinute: org.rateLimitPerMinute,
            defaultProfile: org.defaultProfile,
            defaultMode: org.defaultMode,
          }),
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

  function exportAudits() {
    start(async () => {
      const csv = await api<string>("/api/audits?format=csv");
      setAuditsCsv(csv);
    });
  }

  if (!org) {
    return (
      <StudioShell title="Settings" subtitle="Org, members, webhook.">
        <p className="text-slate-500">Loading…</p>
      </StudioShell>
    );
  }

  return (
    <StudioShell title="Settings" subtitle="Org, members, webhook, and exports.">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Organization</p>
          <div>
            <Label>Name</Label>
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
            <Label>Rate limit / minute</Label>
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
          <div>
            <Label>Default profile</Label>
            <Input
              value={org.defaultProfile}
              onChange={(e) =>
                setOrg({
                  ...org,
                  defaultProfile: e.target.value as OrgSettings["defaultProfile"],
                })
              }
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending} onClick={save}>
            Save settings
          </Button>
          <Button variant="outline" disabled={pending} onClick={exportAudits}>
            Export audits CSV
          </Button>
          {auditsCsv ? (
            <pre className="max-h-40 overflow-auto rounded bg-slate-50 p-2 text-xs">
              {auditsCsv}
            </pre>
          ) : null}
        </div>
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Members</p>
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label>Role</Label>
            <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="owner | designer | viewer" />
          </div>
          <Button disabled={pending || !email.trim()} onClick={invite}>
            Invite member
          </Button>
          <ul className="space-y-2 pt-2">
            {members.map((m) => (
              <li key={m.id} className="text-sm text-slate-600">
                {m.email} · {m.role}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
