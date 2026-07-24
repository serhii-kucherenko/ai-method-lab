"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/client-api";
import type { Member, OrgSettings } from "@/store";
import type { ConstructionProfile } from "@/domain/types";

type GoldenPanel = {
  count: number;
  agreeing: number;
};

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"engineer" | "analyst">("engineer");
  const [goldens, setGoldens] = useState<GoldenPanel | null>(null);
  const [webhookMsg, setWebhookMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function refresh() {
    start(async () => {
      try {
        setOrg(await api<OrgSettings>("/api/settings"));
        const m = await api<{ members: Member[] }>("/api/members");
        setMembers(m.members);
        setGoldens(await api<GoldenPanel>("/api/goldens"));
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "load failed");
      }
    });
  }

  useEffect(() => {
    refresh();
  }, []);

  function save() {
    if (!org) return;
    start(async () => {
      try {
        setOrg(
          await api<OrgSettings>("/api/settings", {
            method: "PATCH",
            body: JSON.stringify(org),
          }),
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : "save failed");
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
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "invite failed");
      }
    });
  }

  function testWebhook() {
    start(async () => {
      try {
        const body = JSON.stringify({ event: "ping", at: new Date().toISOString() });
        const secret = org?.webhookSecret ?? "grs-webhook-secret";
        const enc = new TextEncoder().encode(body);
        const key = await crypto.subtle.importKey(
          "raw",
          new TextEncoder().encode(secret),
          { name: "HMAC", hash: "SHA-256" },
          false,
          ["sign"],
        );
        const sigBuf = await crypto.subtle.sign("HMAC", key, enc);
        const signature = [...new Uint8Array(sigBuf)]
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        const res = await fetch("/api/webhook", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-grs-signature": signature,
          },
          body,
        });
        const data = await res.json();
        setWebhookMsg(res.ok ? "Webhook HMAC accepted" : JSON.stringify(data));
      } catch (e) {
        setWebhookMsg(e instanceof Error ? e.message : "webhook failed");
      }
    });
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Organization, members, webhook HMAC, construction profile defaults, and dual-impl goldens."
    >
      {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}

      {org ? (
        <div className="mb-8 grid gap-4 rounded-lg border border-[var(--studio-line)] bg-white p-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Org name</Label>
            <Input
              value={org.name}
              onChange={(e) => setOrg({ ...org, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Default profile</Label>
            <Select
              value={org.defaultProfile}
              onValueChange={(v) =>
                setOrg({ ...org, defaultProfile: v as ConstructionProfile })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">compact</SelectItem>
                <SelectItem value="heavy">heavy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <Input
              value={org.webhookUrl}
              onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Webhook secret</Label>
            <Input
              value={org.webhookSecret}
              onChange={(e) =>
                setOrg({ ...org, webhookSecret: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Rate limit / minute</Label>
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
          </div>
          <div className="flex items-end gap-2">
            <Button disabled={pending} onClick={save}>
              Save settings
            </Button>
            <Button variant="outline" disabled={pending} onClick={testWebhook}>
              Test webhook HMAC
            </Button>
          </div>
          {webhookMsg ? (
            <p className="md:col-span-2 text-sm text-teal-800">{webhookMsg}</p>
          ) : null}
        </div>
      ) : null}

      <div className="mb-8 rounded-lg border border-[var(--studio-line)] bg-white p-5">
        <h2 className="font-semibold">Members</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Input
            className="max-w-xs"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Select
            value={role}
            onValueChange={(v) => setRole(v as typeof role)}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="engineer">engineer</SelectItem>
              <SelectItem value="analyst">analyst</SelectItem>
            </SelectContent>
          </Select>
          <Button disabled={pending || !email} onClick={invite}>
            Invite
          </Button>
        </div>
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.email}</TableCell>
                <TableCell>{m.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-lg border border-[var(--studio-line)] bg-white p-5">
        <h2 className="font-semibold">Dual-impl goldens</h2>
        <p className="mt-2 text-sm text-slate-600">
          Independent multi-step and single-shot scorers must agree on fixtures.
        </p>
        {goldens ? (
          <p className="mt-3 text-lg">
            {goldens.agreeing} / {goldens.count} agreeing
          </p>
        ) : null}
        <p className="mt-4 text-sm">
          Guide:{" "}
          <Link
            className="text-teal-800 underline"
            href="https://github.com/serhii-kucherenko/ai-method-lab/blob/main/docs/guides/34-graph-rag-studio-lessons.md"
            target="_blank"
          >
            Graph RAG Studio lessons
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}
