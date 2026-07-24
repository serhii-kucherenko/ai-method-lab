"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { Member, MemberRole, OrgSettings } from "@/store";

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("reader");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    const [o, m] = await Promise.all([
      api<OrgSettings>("/api/settings"),
      api<{ items: Member[] }>("/api/members"),
    ]);
    setOrg(o);
    setMembers(m.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!org) return;
    setError("");
    setMsg("");
    try {
      const updated = await api<OrgSettings>("/api/settings", {
        method: "PATCH",
        body: JSON.stringify({
          name: org.name,
          webhookUrl: org.webhookUrl,
          webhookSecret: org.webhookSecret,
          rateLimitPerMinute: org.rateLimitPerMinute,
        }),
      });
      setOrg(updated);
      setMsg("Settings saved");
    } catch (err) {
      setError(String(err));
    }
  }

  async function onInvite(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/members", {
        method: "POST",
        body: JSON.stringify({ email, role }),
      });
      setEmail("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Org name, webhook, rate limit, and member invites."
    >
      {org ? (
        <form
          onSubmit={onSave}
          className="mb-8 grid max-w-xl gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
        >
          <label className="text-sm text-slate-600">
            Org name
            <Input
              className="mt-1"
              value={org.name}
              onChange={(e) => setOrg({ ...org, name: e.target.value })}
            />
          </label>
          <label className="text-sm text-slate-600">
            Webhook URL
            <Input
              className="mt-1"
              value={org.webhookUrl}
              onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
            />
          </label>
          <label className="text-sm text-slate-600">
            Webhook secret
            <Input
              className="mt-1"
              value={org.webhookSecret}
              onChange={(e) =>
                setOrg({ ...org, webhookSecret: e.target.value })
              }
            />
          </label>
          <label className="text-sm text-slate-600">
            Rate limit / minute
            <Input
              className="mt-1"
              type="number"
              value={org.rateLimitPerMinute}
              onChange={(e) =>
                setOrg({
                  ...org,
                  rateLimitPerMinute: Number(e.target.value),
                })
              }
            />
          </label>
          <Button type="submit" className="w-fit">
            Save settings
          </Button>
        </form>
      ) : null}

      <form
        onSubmit={onInvite}
        className="mb-6 flex flex-wrap gap-2 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
      >
        <Input
          placeholder="member@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="max-w-xs"
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={role}
          onChange={(e) => setRole(e.target.value as MemberRole)}
        >
          <option value="owner">owner</option>
          <option value="reader">reader</option>
          <option value="viewer">viewer</option>
        </select>
        <Button type="submit">Invite member</Button>
      </form>

      <div className="mb-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={async () => {
            const csv = await api<string>("/api/export/audits");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "audits.csv";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Export audits CSV
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={async () => {
            const text = await api<string>("/api/export/briefs");
            const blob = new Blob(
              [typeof text === "string" ? text : JSON.stringify(text)],
              { type: "application/json" },
            );
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "briefs.json";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Export briefs JSON
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={async () => {
            const text = await api<string>("/api/export/stacks");
            const blob = new Blob(
              [typeof text === "string" ? text : JSON.stringify(text)],
              { type: "application/json" },
            );
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "stacks.json";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Export stacks JSON
        </Button>
      </div>

      {msg ? <p className="mb-2 text-sm text-[var(--studio-cyan)]">{msg}</p> : null}
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-2">
        {members.map((m) => (
          <li
            key={m.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-2 text-sm"
          >
            {m.email} · {m.role}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
