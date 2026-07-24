"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { DeployMode, Member, MemberRole, OrgSettings } from "@/store";
import type { MonitorProfile } from "@/domain/types";

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("operator");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const o = await api<OrgSettings>("/api/settings");
      setOrg(o);
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
      try {
        const next = await api<OrgSettings>("/api/settings", {
          method: "PATCH",
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

  if (!org) {
    return (
      <StudioShell title="Settings" subtitle="Loading org settings…">
        <p className="text-stone-500">Loading…</p>
      </StudioShell>
    );
  }

  return (
    <StudioShell
      title="Org settings"
      subtitle="Organization name, members, webhook secret, and rate limits."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-stone-900">Organization</p>
          <div>
            <Label htmlFor="org-name">Name</Label>
            <Input
              id="org-name"
              value={org.name}
              onChange={(e) => setOrg({ ...org, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="org-webhook">Webhook URL</Label>
            <Input
              id="org-webhook"
              value={org.webhookUrl}
              onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="org-secret">Webhook secret</Label>
            <Input
              id="org-secret"
              value={org.webhookSecret}
              onChange={(e) =>
                setOrg({ ...org, webhookSecret: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="org-token">Bearer token</Label>
            <Input
              id="org-token"
              value={org.bearerToken}
              onChange={(e) => setOrg({ ...org, bearerToken: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="org-profile">Default profile</Label>
              <select
                id="org-profile"
                className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                value={org.defaultProfile}
                onChange={(e) =>
                  setOrg({
                    ...org,
                    defaultProfile: e.target.value as MonitorProfile,
                  })
                }
              >
                <option value="balanced">balanced</option>
                <option value="strict">strict</option>
              </select>
            </div>
            <div>
              <Label htmlFor="org-mode">Default deploy mode</Label>
              <select
                id="org-mode"
                className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                value={org.defaultDeployMode}
                onChange={(e) =>
                  setOrg({
                    ...org,
                    defaultDeployMode: e.target.value as DeployMode,
                  })
                }
              >
                <option value="sync">sync</option>
                <option value="async">async</option>
              </select>
            </div>
          </div>
          <div>
            <Label htmlFor="org-rate">Rate limit / min</Label>
            <Input
              id="org-rate"
              value={String(org.rateLimitPerMinute)}
              onChange={(e) =>
                setOrg({
                  ...org,
                  rateLimitPerMinute: Number(e.target.value) || 1,
                })
              }
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending} onClick={save}>
            Save settings
          </Button>
        </div>

        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-stone-900">Members</p>
          <ul className="space-y-2 text-sm">
            {members.map((m) => (
              <li key={m.id} className="flex justify-between gap-2">
                <span>{m.email}</span>
                <span className="text-stone-500">{m.role}</span>
              </li>
            ))}
          </ul>
          <div>
            <Label htmlFor="inv-email">Invite email</Label>
            <Input
              id="inv-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="inv-role">Role</Label>
            <select
              id="inv-role"
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
            Invite member
          </Button>
        </div>
      </div>
    </StudioShell>
  );
}
