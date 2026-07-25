"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { AuditEntry, Member, OrgSettings } from "@/store";

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [audits, setAudits] = useState<AuditEntry[]>([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [exportMsg, setExportMsg] = useState("");

  async function load() {
    const [o, m, a] = await Promise.all([
      api<OrgSettings>("/api/settings"),
      api<{ items: Member[] }>("/api/members"),
      api<{ items: AuditEntry[] }>("/api/audits"),
    ]);
    setOrg(o);
    setMembers(m.items);
    setAudits(a.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!org) return;
    setError("");
    try {
      const next = await api<OrgSettings>("/api/settings", {
        method: "PATCH",
        body: JSON.stringify({
          name: org.name,
          webhookUrl: org.webhookUrl,
          rateLimitPerMinute: org.rateLimitPerMinute,
        }),
      });
      setOrg(next);
      await load();
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
        body: JSON.stringify({ email, role: "reader" }),
      });
      setEmail("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  async function onExport(kind: string) {
    setExportMsg("");
    try {
      const text = await api<string>(`/api/export?kind=${kind}`);
      setExportMsg(`Exported ${kind} (${String(text).length} chars)`);
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, members, webhook, exports, and audit trail."
    >
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      {org ? (
        <form
          onSubmit={onSave}
          className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
        >
          <Input
            value={org.name}
            onChange={(e) => setOrg({ ...org, name: e.target.value })}
            placeholder="Org name"
          />
          <Input
            value={org.webhookUrl}
            onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
            placeholder="Webhook URL"
          />
          <Input
            type="number"
            value={org.rateLimitPerMinute}
            onChange={(e) =>
              setOrg({ ...org, rateLimitPerMinute: Number(e.target.value) })
            }
            placeholder="Rate limit / min"
          />
          <Button type="submit">Save org</Button>
        </form>
      ) : null}

      <form onSubmit={onInvite} className="mb-8 flex flex-wrap gap-2">
        <Input
          placeholder="Invite email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" variant="secondary">
          Invite member
        </Button>
      </form>

      <ul className="mb-8 space-y-2 text-sm">
        {members.map((m) => (
          <li key={m.id}>
            {m.email} · {m.role}
          </li>
        ))}
      </ul>

      <div className="mb-8 flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => onExport("packs")}>
          Export packs JSON
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onExport("retrieves")}
        >
          Export retrieves CSV
        </Button>
      </div>
      {exportMsg ? <p className="mb-4 text-sm text-slate-600">{exportMsg}</p> : null}

      <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl">
        Audit trail
      </h2>
      <ul className="space-y-2 text-sm text-slate-600">
        {audits.slice(0, 12).map((a) => (
          <li key={a.id}>
            {a.at} · {a.actor} · {a.action} — {a.detail}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
