"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { Member, MemberRole, OrgSettings } from "@/store";
import type { TutorProfile } from "@/domain/types";

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("instructor");
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
            <Label htmlFor="org-profile">Default profile</Label>
            <select
              id="org-profile"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={org.defaultProfile}
              onChange={(e) =>
                setOrg({
                  ...org,
                  defaultProfile: e.target.value as TutorProfile,
                })
              }
            >
              <option value="guided">Guided</option>
              <option value="strict">Strict</option>
            </select>
          </div>
          <div>
            <Label htmlFor="org-rate">Rate limit / minute</Label>
            <Input
              id="org-rate"
              value={String(org.rateLimitPerMinute)}
              onChange={(e) =>
                setOrg({
                  ...org,
                  rateLimitPerMinute: Number(e.target.value),
                })
              }
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button onClick={save} disabled={pending}>
            Save settings
          </Button>
        </div>

        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-stone-900">Members</p>
          <div className="flex flex-wrap gap-2">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@org.local"
            />
            <select
              className="flex h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={role}
              onChange={(e) => setRole(e.target.value as MemberRole)}
            >
              <option value="owner">owner</option>
              <option value="instructor">instructor</option>
              <option value="viewer">viewer</option>
            </select>
            <Button onClick={invite} disabled={pending || !email.trim()}>
              Invite
            </Button>
          </div>
          <ul className="space-y-2">
            {members.map((m) => (
              <li
                key={m.id}
                className="flex justify-between text-sm text-stone-600"
              >
                <span>{m.email}</span>
                <span>{m.role}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
