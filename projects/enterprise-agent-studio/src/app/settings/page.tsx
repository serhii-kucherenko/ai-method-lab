"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { Member, MemberRole, OrgSettings } from "@/store";

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("viewer");
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState("");

  function load() {
    start(async () => {
      setOrg(await api<OrgSettings>("/api/settings"));
      const m = await api<{ items: Member[] }>("/api/members");
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
      const updated = await api<OrgSettings>("/api/settings", {
        method: "PUT",
        body: JSON.stringify(org),
      });
      setOrg(updated);
      setMsg("Saved");
    });
  }

  function invite() {
    start(async () => {
      await api<Member>("/api/members", {
        method: "POST",
        body: JSON.stringify({ email, role }),
      });
      setEmail("");
      load();
    });
  }

  if (!org) {
    return (
      <StudioShell title="Settings" subtitle="Loading…">
        <p className="text-slate-500">Loading organization…</p>
      </StudioShell>
    );
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Organization, members, bearer token, and webhook secret."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Organization</p>
          <div>
            <Label htmlFor="on">Name</Label>
            <Input
              id="on"
              value={org.name}
              onChange={(e) => setOrg({ ...org, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="wh">Webhook URL</Label>
            <Input
              id="wh"
              value={org.webhookUrl}
              onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="ws">Webhook secret</Label>
            <Input
              id="ws"
              value={org.webhookSecret}
              onChange={(e) =>
                setOrg({ ...org, webhookSecret: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="bt">Bearer token</Label>
            <Input
              id="bt"
              value={org.bearerToken}
              onChange={(e) => setOrg({ ...org, bearerToken: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="rl">Rate limit / minute</Label>
            <Input
              id="rl"
              value={String(org.rateLimitPerMinute)}
              onChange={(e) =>
                setOrg({
                  ...org,
                  rateLimitPerMinute: Number(e.target.value) || 1,
                })
              }
            />
          </div>
          <Button disabled={pending} onClick={save}>
            Save settings
          </Button>
          {msg ? <p className="text-sm text-[var(--studio-emerald)]">{msg}</p> : null}
        </div>

        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Members</p>
          <div className="flex flex-wrap gap-2">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@org.local"
            />
            <select
              className="flex h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={role}
              onChange={(e) => setRole(e.target.value as MemberRole)}
            >
              <option value="owner">owner</option>
              <option value="planner">planner</option>
              <option value="viewer">viewer</option>
            </select>
            <Button disabled={pending || !email.trim()} onClick={invite}>
              Invite
            </Button>
          </div>
          <ul className="space-y-2">
            {members.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-slate-800">{m.email}</span>
                <Badge variant="secondary">{m.role}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
