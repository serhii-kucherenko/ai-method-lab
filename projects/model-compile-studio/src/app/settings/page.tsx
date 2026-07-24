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
import type { Member, MemberRole, OrgSettings } from "@/store";

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("engineer");
  const [name, setName] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  useEffect(() => {
    start(async () => {
      const s = await api<OrgSettings>("/api/settings");
      setOrg(s);
      setName(s.name);
      setWebhookUrl(s.webhookUrl);
      const m = await api<{ items: Member[] }>("/api/members");
      setMembers(m.items);
    });
  }, []);

  function saveSettings() {
    start(async () => {
      try {
        const s = await api<OrgSettings>("/api/settings", {
          method: "PATCH",
          body: JSON.stringify({ name, webhookUrl }),
        });
        setOrg(s);
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  function invite() {
    start(async () => {
      try {
        const m = await api<Member>("/api/members", {
          method: "POST",
          body: JSON.stringify({ email, role }),
        });
        setMembers((prev) => [...prev, m]);
        setEmail("");
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Organization name, members, and webhook configuration."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4 rounded-lg border border-[var(--studio-line)] bg-white p-4">
          <p className="font-medium">Org settings</p>
          <div>
            <Label htmlFor="org-name">Name</Label>
            <Input
              id="org-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="webhook">Webhook URL</Label>
            <Input
              id="webhook"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://…"
            />
          </div>
          {org ? (
            <p className="text-xs text-slate-500">
              Bearer token: <code>{org.bearerToken}</code> · webhook secret:{" "}
              <code>{org.webhookSecret}</code>
            </p>
          ) : null}
          <Button disabled={pending} onClick={saveSettings}>
            Save settings
          </Button>
        </div>

        <div className="space-y-4 rounded-lg border border-[var(--studio-line)] bg-white p-4">
          <p className="font-medium">Invite member</p>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label>Role</Label>
            <Select
              value={role}
              onValueChange={(v) => setRole(v as MemberRole)}
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
          <Button disabled={pending || !email} onClick={invite}>
            Invite member
          </Button>
          <ul className="space-y-1 text-sm text-slate-600">
            {members.map((m) => (
              <li key={m.id}>
                {m.email} · {m.role}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
    </StudioShell>
  );
}
