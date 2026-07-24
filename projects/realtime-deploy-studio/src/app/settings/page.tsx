"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/client-api";
import type { Member, OrgSettings } from "@/store";

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"owner" | "engineer" | "viewer">("engineer");
  const [pending, start] = useTransition();

  function refresh() {
    start(async () => {
      const o = await api<OrgSettings>("/api/settings");
      setOrg(o);
      const m = await api<{ items: Member[] }>("/api/members");
      setMembers(m.items);
    });
  }

  useEffect(() => {
    refresh();
  }, []);

  function save() {
    if (!org) return;
    start(async () => {
      const next = await api<OrgSettings>("/api/settings", {
        method: "PUT",
        body: JSON.stringify(org),
      });
      setOrg(next);
    });
  }

  function invite() {
    start(async () => {
      await api("/api/members", {
        method: "POST",
        body: JSON.stringify({ email, role }),
      });
      setEmail("");
      refresh();
    });
  }

  if (!org) {
    return (
      <StudioShell title="Settings" subtitle="Loading…">
        <p className="text-slate-500">Loading org…</p>
      </StudioShell>
    );
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Org name, bearer token, webhook HMAC, and member invites."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-100">Organization</p>
          <div>
            <Label htmlFor="on">Name</Label>
            <Input
              id="on"
              value={org.name}
              onChange={(e) => setOrg({ ...org, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="tok">Bearer token</Label>
            <Input
              id="tok"
              value={org.bearerToken}
              onChange={(e) =>
                setOrg({ ...org, bearerToken: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="wu">Webhook URL</Label>
            <Input
              id="wu"
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
            <Label>Default profile</Label>
            <Select
              value={org.defaultProfile}
              onValueChange={(v) =>
                setOrg({
                  ...org,
                  defaultProfile: v as "full" | "fast",
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">full</SelectItem>
                <SelectItem value="fast">fast</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button disabled={pending} onClick={save}>
            Save settings
          </Button>
        </div>

        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-100">Invite member</p>
          <div>
            <Label htmlFor="em">Email</Label>
            <Input
              id="em"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label>Role</Label>
            <Select
              value={role}
              onValueChange={(v) =>
                setRole(v as "owner" | "engineer" | "viewer")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">owner</SelectItem>
                <SelectItem value="engineer">engineer</SelectItem>
                <SelectItem value="viewer">viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button disabled={pending || !email.trim()} onClick={invite}>
            Invite member
          </Button>
          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            {members.map((m) => (
              <li key={m.id}>
                {m.email} · {m.role}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
