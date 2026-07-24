"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { GUIDE_PATH } from "@/claim";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { Member, OrgSettings, PlanKind } from "@/store";

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"owner" | "engineer" | "viewer">("engineer");
  const [error, setError] = useState("");
  const [features, setFeatures] = useState<string[]>([]);

  async function load() {
    const [o, m, f] = await Promise.all([
      api<OrgSettings>("/api/settings"),
      api<{ items: Member[] }>("/api/members"),
      api<{ items: string[] }>("/api/features"),
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
    setError("");
    try {
      const next = await api<OrgSettings>("/api/settings", {
        method: "PATCH",
        body: JSON.stringify({
          name: org.name,
          webhookUrl: org.webhookUrl,
          webhookSecret: org.webhookSecret,
          defaultPlan: org.defaultPlan,
          rateLimitPerMinute: org.rateLimitPerMinute,
        }),
      });
      setOrg(next);
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
      subtitle="Org, members, webhook, and feature inventory."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      {org ? (
        <form
          onSubmit={onSave}
          className="mb-10 space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
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
            placeholder="Webhook secret"
            value={org.webhookSecret}
            onChange={(e) => setOrg({ ...org, webhookSecret: e.target.value })}
          />
          <select
            className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
            value={org.defaultPlan}
            onChange={(e) =>
              setOrg({ ...org, defaultPlan: e.target.value as PlanKind })
            }
          >
            <option value="multi_skill">Default plan: multi_skill</option>
            <option value="single_gait">Default plan: single_gait</option>
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
          />
          <Button type="submit">Save settings</Button>
        </form>
      ) : null}

      <form
        onSubmit={onInvite}
        className="mb-10 flex flex-wrap gap-2 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
      >
        <Input
          className="max-w-xs"
          placeholder="Invite email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={role}
          onChange={(e) =>
            setRole(e.target.value as "owner" | "engineer" | "viewer")
          }
        >
          <option value="owner">owner</option>
          <option value="engineer">engineer</option>
          <option value="viewer">viewer</option>
        </select>
        <Button type="submit">Invite</Button>
      </form>

      <ul className="mb-8 space-y-2 text-sm text-stone-600">
        {members.map((m) => (
          <li key={m.id}>
            {m.email} · {m.role}
          </li>
        ))}
      </ul>

      <div className="mb-6 flex flex-wrap gap-3 text-sm">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            api<string>("/api/export/audits").then((csv) => {
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "audits.csv";
              a.click();
            })
          }
        >
          Export audits CSV
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            api<string>("/api/export/transitions").then((json) => {
              const blob = new Blob([json], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "transitions.json";
              a.click();
            })
          }
        >
          Export transitions JSON
        </Button>
        <Link
          href={GUIDE_PATH}
          className="inline-flex h-8 items-center text-[var(--studio-earth)] underline-offset-2 hover:underline"
        >
          Tutor guide
        </Link>
      </div>

      <h2 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
        Features ({features.length})
      </h2>
      <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-stone-600">
        {features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ol>
    </StudioShell>
  );
}
