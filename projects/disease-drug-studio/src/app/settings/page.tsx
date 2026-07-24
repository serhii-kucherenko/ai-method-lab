"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/client-api";
import type { Member, MemberRole, OrgSettings } from "@/store";
import type { TrainingProfile } from "@/domain/types";

type MembersPage = { items: Member[] };

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("chemist");
  const [goldenCount, setGoldenCount] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      try {
        const [o, m, g] = await Promise.all([
          api<OrgSettings>("/api/settings"),
          api<MembersPage>("/api/members"),
          api<{ count: number }>("/api/goldens"),
        ]);
        setOrg(o);
        setMembers(m.items);
        setGoldenCount(g.count);
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "load_failed");
      }
    });
  }

  useEffect(() => {
    load();
  }, []);

  function saveOrg() {
    if (!org) return;
    start(async () => {
      try {
        const updated = await api<OrgSettings>("/api/settings", {
          method: "PATCH",
          body: JSON.stringify({
            name: org.name,
            webhookUrl: org.webhookUrl,
            webhookSecret: org.webhookSecret,
            defaultProfile: org.defaultProfile,
            rateLimitPerMinute: org.rateLimitPerMinute,
          }),
        });
        setOrg(updated);
      } catch (e) {
        setError(e instanceof Error ? e.message : "save_failed");
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
        setError(e instanceof Error ? e.message : "invite_failed");
      }
    });
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Org name, members, webhook HMAC secret, and dual-impl golden count."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      {org ? (
        <div className="mb-10 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-2">
          <div>
            <Label>Organization</Label>
            <Input
              value={org.name}
              onChange={(e) => setOrg({ ...org, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Default profile</Label>
            <Select
              value={org.defaultProfile}
              onValueChange={(v) =>
                setOrg({ ...org, defaultProfile: v as TrainingProfile })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sft">SFT</SelectItem>
                <SelectItem value="grpo">GRPO</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Webhook URL</Label>
            <Input
              value={org.webhookUrl}
              onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
            />
          </div>
          <div>
            <Label>Webhook secret</Label>
            <Input
              value={org.webhookSecret}
              onChange={(e) =>
                setOrg({ ...org, webhookSecret: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Rate limit / minute</Label>
            <Input
              type="number"
              value={org.rateLimitPerMinute}
              onChange={(e) =>
                setOrg({
                  ...org,
                  rateLimitPerMinute: Number(e.target.value) || 1,
                })
              }
            />
          </div>
          <div className="flex items-end">
            <Button onClick={saveOrg} disabled={pending}>
              Save settings
            </Button>
          </div>
        </div>
      ) : null}

      <div className="mb-10">
        <h2 className="mb-3 font-medium">Members</h2>
        <div className="mb-4 flex flex-wrap gap-2">
          <Input
            placeholder="email@lab.local"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="max-w-xs"
          />
          <Select
            value={role}
            onValueChange={(v) => setRole(v as MemberRole)}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owner">owner</SelectItem>
              <SelectItem value="chemist">chemist</SelectItem>
              <SelectItem value="analyst">analyst</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={invite} disabled={pending}>
            Invite member
          </Button>
        </div>
        <ul className="space-y-2">
          {members.map((m) => (
            <li
              key={m.id}
              className="flex items-center gap-2 text-sm text-slate-700"
            >
              {m.email} <Badge variant="outline">{m.role}</Badge>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm text-slate-600">
        Dual-impl goldens loaded:{" "}
        <strong>{goldenCount ?? "…"}</strong> (API sample only — not a primary
        IA page). Bearer token for API:{" "}
        <code className="rounded bg-slate-100 px-1">{org?.bearerToken}</code>
      </p>
      <p className="mt-2 text-sm">
        <Link href="/honesty" className="underline underline-offset-4">
          Read honesty fence
        </Link>
      </p>
    </StudioShell>
  );
}
