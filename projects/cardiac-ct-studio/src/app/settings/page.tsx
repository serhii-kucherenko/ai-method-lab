"use client";

import { FormEvent, useEffect, useState } from "react";
import { GUIDE_PATH } from "@/claim";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { AuditEntry, Member, MemberRole, OrgSettings } from "@/store";

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [audits, setAudits] = useState<AuditEntry[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("annotator");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    const [o, m, a, f] = await Promise.all([
      api<OrgSettings>("/api/settings"),
      api<{ items: Member[] }>("/api/members"),
      api<{ items: AuditEntry[] }>("/api/audits?limit=20"),
      api<{ items: string[] }>("/api/features"),
    ]);
    setOrg(o);
    setMembers(m.items);
    setAudits(a.items);
    setFeatures(f.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function onSaveOrg(e: FormEvent) {
    e.preventDefault();
    if (!org) return;
    setError("");
    setMsg("");
    try {
      const next = await api<OrgSettings>("/api/settings", {
        method: "PATCH",
        body: JSON.stringify({
          name: org.name,
          webhookUrl: org.webhookUrl,
          webhookSecret: org.webhookSecret,
          rateLimitPerMinute: org.rateLimitPerMinute,
          defaultPlan: org.defaultPlan,
        }),
      });
      setOrg(next);
      setMsg("Settings saved");
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
      subtitle="Org, members, webhook, audits, exports, and feature inventory."
    >
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      {msg ? (
        <p className="mb-4 text-sm text-[var(--studio-crimson)]">{msg}</p>
      ) : null}

      {org ? (
        <form
          onSubmit={onSaveOrg}
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
            value={org.webhookSecret}
            onChange={(e) => setOrg({ ...org, webhookSecret: e.target.value })}
            placeholder="Webhook secret"
          />
          <Input
            type="number"
            value={org.rateLimitPerMinute}
            onChange={(e) =>
              setOrg({ ...org, rateLimitPerMinute: Number(e.target.value) })
            }
            placeholder="Rate limit / min"
          />
          <select
            className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
            value={org.defaultPlan}
            onChange={(e) =>
              setOrg({
                ...org,
                defaultPlan: e.target.value as OrgSettings["defaultPlan"],
              })
            }
          >
            <option value="hitl_foundation">default: hitl_foundation</option>
            <option value="auto_only">default: auto_only</option>
          </select>
          <Button type="submit">Save settings</Button>
        </form>
      ) : null}

      <form
        onSubmit={onInvite}
        className="mb-8 flex flex-wrap gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
      >
        <Input
          placeholder="Invite email"
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
          <option value="annotator">annotator</option>
          <option value="viewer">viewer</option>
        </select>
        <Button type="submit">Invite member</Button>
      </form>

      <div className="mb-8 flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={async () => {
            try {
              const csv = await api<string>("/api/export/audits");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "audits.csv";
              a.click();
              URL.revokeObjectURL(url);
            } catch (err) {
              setError(String(err));
            }
          }}
        >
          Export audits CSV
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={async () => {
            try {
              const json = await api<string>("/api/export/studies");
              const blob = new Blob([json], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "studies.json";
              a.click();
              URL.revokeObjectURL(url);
            } catch (err) {
              setError(String(err));
            }
          }}
        >
          Export studies JSON
        </Button>
        <p className="self-center text-sm text-slate-500">
          Guide: <code>{GUIDE_PATH}</code>
        </p>
      </div>

      <h2 className="mb-2 font-[family-name:var(--font-display)] text-xl">
        Members
      </h2>
      <ul className="mb-8 space-y-1 text-sm text-slate-600">
        {members.map((m) => (
          <li key={m.id}>
            {m.email} · {m.role}
          </li>
        ))}
      </ul>

      <h2 className="mb-2 font-[family-name:var(--font-display)] text-xl">
        Features ({features.length})
      </h2>
      <ul className="mb-8 columns-1 gap-4 text-sm text-slate-600 md:columns-2">
        {features.map((f) => (
          <li key={f} className="mb-1">
            {f}
          </li>
        ))}
      </ul>

      <h2 className="mb-2 font-[family-name:var(--font-display)] text-xl">
        Recent audits
      </h2>
      <ul className="space-y-1 text-sm text-slate-600">
        {audits.map((a) => (
          <li key={a.id}>
            {a.at.slice(0, 19)} · {a.actor} · {a.action}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
