"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { Member, OrgSettings } from "@/store";

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const o = await api<OrgSettings>("/api/settings");
      setOrg(o);
      const m = await api<{ items: Member[] }>("/api/members");
      setMembers(m.items);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function save() {
    if (!org) return;
    start(async () => {
      try {
        const updated = await api<OrgSettings>("/api/settings", {
          method: "PATCH",
          body: JSON.stringify({
            name: org.name,
            webhookUrl: org.webhookUrl,
            rateLimitPerMinute: org.rateLimitPerMinute,
            defaultPlanner: org.defaultPlanner,
            defaultMode: org.defaultMode,
          }),
        });
        setOrg(updated);
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  function invite() {
    start(async () => {
      try {
        await api("/api/members", {
          method: "POST",
          body: JSON.stringify({ email, role }),
        });
        setEmail("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Org settings"
      subtitle="Organization name, webhook, rate limits, members, and default scoring mode."
    >
      {org ? (
        <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-2">
          <div>
            <Label>Org name</Label>
            <Input
              value={org.name}
              onChange={(e) => setOrg({ ...org, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Webhook URL</Label>
            <Input
              value={org.webhookUrl}
              onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
            />
          </div>
          <div>
            <Label>Rate limit / min</Label>
            <Input
              value={String(org.rateLimitPerMinute)}
              onChange={(e) =>
                setOrg({
                  ...org,
                  rateLimitPerMinute: Number(e.target.value) || 60,
                })
              }
            />
          </div>
          <div>
            <Label>Default planner</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              value={org.defaultPlanner}
              onChange={(e) =>
                setOrg({
                  ...org,
                  defaultPlanner: e.target.value as OrgSettings["defaultPlanner"],
                })
              }
            >
              <option value="grounded">grounded</option>
              <option value="ungrounded_llm">ungrounded_llm</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <Button onClick={save} disabled={pending}>
              Save settings
            </Button>
          </div>
        </div>
      ) : null}

      <div className="mb-6 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-2">
        <div>
          <Label>Invite email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label>Role</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="owner">owner</option>
            <option value="clinician">clinician</option>
            <option value="viewer">viewer</option>
          </select>
        </div>
        <div>
          <Button onClick={invite} disabled={pending || !email}>
            Invite member
          </Button>
        </div>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="mb-8 space-y-2">
        {members.map((m) => (
          <li
            key={m.id}
            className="rounded border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
          >
            {m.email} · {m.role}
          </li>
        ))}
      </ul>

      <p className="text-sm text-slate-500">
        <a className="underline" href="/api/export/audits">
          Export audit CSV
        </a>
        {" · "}
        <a
          className="underline"
          href="https://github.com/serhii-kucherenko/ai-method-lab/blob/main/docs/guides/52-msk-care-studio-lessons.md"
        >
          Tutor guide
        </a>
      </p>
    </StudioShell>
  );
}
