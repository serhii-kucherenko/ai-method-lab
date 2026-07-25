"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { Member, OrgSettings } from "@/store";

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [audits, setAudits] = useState<{ action: string; detail: string }[]>(
    [],
  );
  const [error, setError] = useState("");

  async function load() {
    const [orgRes, memRes, featRes, auditRes] = await Promise.all([
      api<{ org: OrgSettings }>("/api/settings"),
      api<{ items: Member[] }>("/api/members"),
      api<{ items: string[] }>("/api/features"),
      api<{ items: { action: string; detail: string }[] }>("/api/audits"),
    ]);
    setOrg(orgRes.org);
    setMembers(memRes.items);
    setFeatures(featRes.items);
    setAudits(auditRes.items.slice(0, 8));
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!org) return;
    setError("");
    try {
      const res = await api<{ org: OrgSettings }>("/api/settings", {
        method: "PATCH",
        body: JSON.stringify({
          name: org.name,
          webhookUrl: org.webhookUrl,
          rateLimitPerMinute: org.rateLimitPerMinute,
        }),
      });
      setOrg(res.org);
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

  return (
    <StudioShell
      title="Org settings"
      subtitle="Bearer auth, webhook secret, member invites, audits, and feature inventory."
    >
      {org ? (
        <form
          onSubmit={onSave}
          className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
        >
          <Input
            value={org.name}
            onChange={(e) => setOrg({ ...org, name: e.target.value })}
          />
          <Input
            placeholder="Webhook URL"
            value={org.webhookUrl}
            onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
          />
          <Input
            type="number"
            value={org.rateLimitPerMinute}
            onChange={(e) =>
              setOrg({
                ...org,
                rateLimitPerMinute: Number(e.target.value) || 60,
              })
            }
          />
          <Button type="submit">Save settings</Button>
        </form>
      ) : null}

      <form
        onSubmit={onInvite}
        className="mb-8 flex flex-wrap gap-2 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
      >
        <Input
          placeholder="invite@edge-quant.local"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit">Invite member</Button>
      </form>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

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
        Recent audits
      </h2>
      <ul className="mb-8 space-y-1 text-sm text-slate-600">
        {audits.map((a, i) => (
          <li key={`${a.action}-${i}`}>
            {a.action}: {a.detail}
          </li>
        ))}
      </ul>

      <h2 className="mb-2 font-[family-name:var(--font-display)] text-xl">
        Features ({features.length})
      </h2>
      <p className="text-sm text-slate-600">{features.join(", ")}</p>
    </StudioShell>
  );
}
