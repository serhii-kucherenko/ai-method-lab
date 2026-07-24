"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { Member, OrgSettings, PlanKind } from "@/store";

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [o, m] = await Promise.all([
      api<{ org: OrgSettings }>("/api/settings"),
      api<{ items: Member[] }>("/api/members"),
    ]);
    setOrg(o.org);
    setMembers(m.items);
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
          defaultPlan: org.defaultPlan,
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

  async function downloadExport(path: string, filename: string) {
    setError("");
    try {
      const text = await api<string>(path);
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(String(err));
    }
  }

  if (!org) {
    return (
      <StudioShell title="Settings" subtitle="Org, members, webhook.">
        <p className="text-sm text-stone-500">Loading…</p>
      </StudioShell>
    );
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Organization, member invites, and webhook configuration."
    >
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
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={org.defaultPlan}
          onChange={(e) =>
            setOrg({ ...org, defaultPlan: e.target.value as PlanKind })
          }
        >
          <option value="multi_agent">multi_agent</option>
          <option value="single_agent">single_agent</option>
        </select>
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
        <Button type="submit">Save settings</Button>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => downloadExport("/api/export/audits", "audits.csv")}
          >
            Export audits CSV
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => downloadExport("/api/export/rules", "rules.json")}
          >
            Export rules JSON
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              downloadExport("/api/export/debates", "debates.json")
            }
          >
            Export debates JSON
          </Button>
        </div>
      </form>

      <form
        onSubmit={onInvite}
        className="mb-8 flex flex-wrap gap-2 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
      >
        <Input
          className="max-w-sm"
          placeholder="Invite email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit">Invite member</Button>
      </form>

      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      <ul className="space-y-2">
        {members.map((m) => (
          <li
            key={m.id}
            className="rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
          >
            {m.email} · {m.role}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
