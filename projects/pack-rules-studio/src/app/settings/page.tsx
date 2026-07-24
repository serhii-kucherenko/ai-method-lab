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
      <StudioShell title="Settings" subtitle="Loading…">
        <p className="text-slate-500">Loading org settings…</p>
      </StudioShell>
    );
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, members, webhook URL, and audit export."
    >
      <div className="mb-8 grid max-w-xl gap-3 rounded-lg border border-[var(--studio-line)] bg-white p-4">
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
        <Button onClick={save} disabled={pending}>
          Save settings
        </Button>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>

      <div className="mb-8 max-w-xl rounded-lg border border-[var(--studio-line)] bg-white p-4">
        <p className="mb-3 font-medium text-slate-900">Invite member</p>
        <div className="flex flex-wrap gap-2">
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
            <option value="viewer">viewer</option>
            <option value="planner">planner</option>
            <option value="owner">owner</option>
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

      <div className="max-w-xl">
        <Button variant="outline" onClick={exportAudits}>
          Export audits CSV
        </Button>
        {auditsCsv ? (
          <pre className="mt-3 max-h-48 overflow-auto rounded-lg border bg-slate-50 p-3 text-xs">
            {auditsCsv}
          </pre>
        ) : null}
      </div>
    </StudioShell>
  );
}
