"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GUIDE_PATH } from "@/claim";
import { api } from "@/lib/client-api";
import type { Member, MemberRole, OrgSettings } from "@/store";

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("engineer");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  async function load() {
    const [o, m, f] = await Promise.all([
      api<OrgSettings>("/api/settings"),
      api<{ items: Member[] }>("/api/members"),
      api<{ items: string[]; count: number }>("/api/features"),
    ]);
    setOrg(o);
    setMembers(m.items);
    setFeatures(f.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!org) return;
    try {
      const next = await api<OrgSettings>("/api/settings", {
        method: "PATCH",
        body: JSON.stringify({
          name: org.name,
          webhookUrl: org.webhookUrl,
          webhookSecret: org.webhookSecret,
          rateLimitPerMinute: org.rateLimitPerMinute,
        }),
      });
      setOrg(next);
      setSaved("Saved");
    } catch (err) {
      setError(String(err));
    }
  }

  async function onInvite(e: FormEvent) {
    e.preventDefault();
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
      subtitle="Org, webhook, members, and feature inventory."
    >
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      {saved ? <p className="mb-4 text-sm text-[var(--studio-signal)]">{saved}</p> : null}

      {org ? (
        <form
          onSubmit={onSave}
          className="mb-8 space-y-3 rounded-lg border border-[var(--studio-line)] bg-white p-4"
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
              setOrg({
                ...org,
                rateLimitPerMinute: Number(e.target.value),
              })
            }
            placeholder="Rate limit / min"
          />
          <p className="text-xs text-slate-500">
            Bearer token (dev): {org.bearerToken}
          </p>
          <Button type="submit">Save org</Button>
        </form>
      ) : null}

      <form
        onSubmit={onInvite}
        className="mb-8 flex flex-wrap gap-2 rounded-lg border border-[var(--studio-line)] bg-white p-4"
      >
        <Input
          placeholder="Invite email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={role}
          onChange={(e) => setRole(e.target.value as MemberRole)}
        >
          <option value="owner">owner</option>
          <option value="engineer">engineer</option>
          <option value="viewer">viewer</option>
        </select>
        <Button type="submit">Invite</Button>
      </form>

      <ul className="mb-8 space-y-2">
        {members.map((m) => (
          <li key={m.id} className="text-sm text-slate-600">
            {m.email} · {m.role}
          </li>
        ))}
      </ul>

      <div className="mb-6 flex flex-wrap gap-4 text-sm">
        <a
          className="text-[var(--studio-signal)] underline-offset-2 hover:underline"
          href="/api/export/audits"
        >
          Export audits CSV
        </a>
        <Link
          className="text-[var(--studio-signal)] underline-offset-2 hover:underline"
          href={GUIDE_PATH}
        >
          Tutor guide
        </Link>
      </div>

      <h2 className="font-[family-name:var(--font-display)] text-xl">
        Features ({features.length})
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
        {features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </StudioShell>
  );
}
