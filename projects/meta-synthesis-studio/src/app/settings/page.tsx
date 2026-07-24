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
  const [features, setFeatures] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("analyst");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [name, setName] = useState("");
  const [csv, setCsv] = useState("");
  const [pending, start] = useTransition();

  function refresh() {
    start(async () => {
      const [s, m, f] = await Promise.all([
        api<OrgSettings>("/api/settings"),
        api<{ items: Member[] }>("/api/members"),
        api<{ items: string[] }>("/api/features"),
      ]);
      setOrg(s);
      setName(s.name);
      setWebhookUrl(s.webhookUrl);
      setMembers(m.items);
      setFeatures(f.items);
    });
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function save() {
    start(async () => {
      await api("/api/settings", {
        method: "POST",
        body: JSON.stringify({ name, webhookUrl }),
      });
      refresh();
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

  function exportAudits() {
    start(async () => {
      const text = await api<string>("/api/audits?export=csv");
      setCsv(text);
    });
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, members, webhook HMAC, and feature catalog for Meta Synthesis Studio."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-stone-900">Organization</p>
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Webhook URL</Label>
            <Input value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://…" />
          </div>
          {org ? (
            <p className="text-xs text-stone-500">
              Bearer token: <code>{org.bearerToken}</code> · default {org.defaultMode} / {org.defaultProfile} · rate {org.rateLimitPerMinute}/min
            </p>
          ) : null}
          <Button disabled={pending} onClick={save}>Save settings</Button>
          <Button variant="outline" disabled={pending} onClick={exportAudits}>Export audits CSV</Button>
          {csv ? <pre className="max-h-40 overflow-auto rounded bg-stone-50 p-2 text-xs">{csv}</pre> : null}
        </div>

        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-stone-900">Invite member</p>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="analyst@org.org" />
          <select
            className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value as MemberRole)}
          >
            <option value="owner">owner</option>
            <option value="analyst">analyst</option>
            <option value="viewer">viewer</option>
          </select>
          <Button disabled={pending || !email.trim()} onClick={invite}>Invite</Button>
          <ul className="space-y-1 pt-2">
            {members.map((m) => (
              <li key={m.id} className="flex items-center gap-2 text-sm">
                <span>{m.email}</span>
                <Badge variant="outline">{m.role}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <p className="font-medium text-stone-900">Features ({features.length})</p>
        <ul className="mt-3 grid gap-1 text-sm text-stone-600 md:grid-cols-2">
          {features.map((f) => (
            <li key={f}>· {f}</li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
