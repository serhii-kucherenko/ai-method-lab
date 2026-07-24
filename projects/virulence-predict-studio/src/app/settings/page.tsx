"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/client-api";
import type { Member, MemberRole, OrgSettings } from "@/store";

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("analyst");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      try {
        const [o, m] = await Promise.all([
          api<OrgSettings>("/api/settings"),
          api<Member[]>("/api/members"),
        ]);
        setOrg(o);
        setMembers(m);
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "load_failed");
      }
    });
  }

  useEffect(() => {
    load();
  }, []);

  function saveOrg() {
    if (!org) return;
    start(async () => {
      try {
        const updated = await api<OrgSettings>("/api/settings", {
          method: "PATCH",
          body: JSON.stringify({
            name: org.name,
            webhookUrl: org.webhookUrl,
            webhookSecret: org.webhookSecret,
            defaultProfile: org.defaultProfile,
            rateLimitPerMinute: org.rateLimitPerMinute,
          }),
        });
        setOrg(updated);
      } catch (e) {
        setError(e instanceof Error ? e.message : "save_failed");
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
        setError(e instanceof Error ? e.message : "invite_failed");
      }
    });
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Organization name, webhook HMAC secret, member invite, and default prediction profile."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      {org ? (
        <div className="mb-10 grid gap-4 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-2">
          <div>
            <Label htmlFor="org">Organization</Label>
            <Input
              id="org"
              value={org.name}
              onChange={(e) => setOrg({ ...org, name: e.target.value })}
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
                  rateLimitPerMinute: Number(e.target.value) || 60,
                })
              }
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="wh">Webhook URL</Label>
            <Input
              id="wh"
              value={org.webhookUrl}
              onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="secret">Webhook secret (HMAC)</Label>
            <Input
              id="secret"
              value={org.webhookSecret}
              onChange={(e) =>
                setOrg({ ...org, webhookSecret: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="prof">Default profile</Label>
            <select
              id="prof"
              className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
              value={org.defaultProfile}
              onChange={(e) =>
                setOrg({
                  ...org,
                  defaultProfile: e.target.value as OrgSettings["defaultProfile"],
                })
              }
            >
              <option value="full">Full</option>
              <option value="fast">Fast</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button onClick={saveOrg} disabled={pending}>
              Save settings
            </Button>
          </div>
        </div>
      ) : null}

      <h2 className="mb-3 font-medium text-slate-900">Members</h2>
      <div className="mb-4 flex flex-wrap gap-3">
        <Input
          placeholder="email@lab.local"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="max-w-xs"
        />
        <select
          className="rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
          value={role}
          onChange={(e) => setRole(e.target.value as MemberRole)}
        >
          <option value="owner">owner</option>
          <option value="analyst">analyst</option>
          <option value="viewer">viewer</option>
        </select>
        <Button onClick={invite} disabled={pending}>
          Invite member
        </Button>
      </div>
      <ul className="space-y-2">
        {members.map((m) => (
          <li
            key={m.id}
            className="flex items-center justify-between rounded-lg border border-[var(--studio-line)] bg-white px-4 py-3 text-sm"
          >
            <span>{m.email}</span>
            <Badge variant="outline">{m.role}</Badge>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
