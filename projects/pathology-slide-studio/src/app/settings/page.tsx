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
  const [role, setRole] = useState<MemberRole>("analyst");
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
              className="mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="wh-url">Webhook URL</Label>
            <Input
              id="wh-url"
              className="mt-1"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://example.com/hooks/pathology"
            />
          </div>
          {org ? (
            <p className="text-xs text-stone-500">
              Bearer token: {org.bearerToken} · Webhook secret:{" "}
              {org.webhookSecret} · Rate limit {org.rateLimitPerMinute}/min
            </p>
          ) : null}
          <Button onClick={saveSettings} disabled={pending}>
            Save settings
          </Button>
        </div>

        <div className="space-y-4 rounded-lg border border-[var(--studio-line)] bg-white p-4">
          <p className="font-medium">Invite member</p>
          <div>
            <Label htmlFor="m-email">Email</Label>
            <Input
              id="m-email"
              className="mt-1"
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
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="analyst">Analyst</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={invite} disabled={pending || !email.trim()}>
            Invite member
          </Button>
          <ul className="space-y-1 text-sm text-stone-700">
            {members.map((m) => (
              <li key={m.id}>
                {m.email} · {m.role}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      <p className="mt-6 text-sm text-stone-500">
        Inbound webhook: POST /api/webhook with HMAC-SHA256 signature header
        x-signature and idempotency key x-idempotency-key.
      </p>
    </StudioShell>
  );
}
