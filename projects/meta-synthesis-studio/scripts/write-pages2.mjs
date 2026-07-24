import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function w(rel, content) {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content, "utf8");
  console.log("wrote", rel);
}

w(
  "src/app/effects/page.tsx",
  `"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { EffectRecord, ReviewQuestion } from "@/store";

export default function EffectsPage() {
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [items, setItems] = useState<EffectRecord[]>([]);
  const [questionId, setQuestionId] = useState("");
  const [studyLabel, setStudyLabel] = useState("");
  const [effectSize, setEffectSize] = useState("-20");
  const [se, setSe] = useState("3");
  const [n, setN] = useState("200");
  const [outcome, setOutcome] = useState("");
  const [exportText, setExportText] = useState("");
  const [pending, start] = useTransition();

  function refresh(qid?: string) {
    start(async () => {
      const qs = await api<{ items: ReviewQuestion[] }>("/api/questions?page=1&pageSize=50");
      setQuestions(qs.items);
      const id = qid || questionId || qs.items[0]?.id || "";
      if (!questionId && id) setQuestionId(id);
      const res = await api<{ items: EffectRecord[] }>(
        \`/api/effects?questionId=\${encodeURIComponent(id)}\`,
      );
      setItems(res.items);
    });
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      await api("/api/effects", {
        method: "POST",
        body: JSON.stringify({
          questionId,
          studyLabel,
          effectSize: Number(effectSize),
          se: Number(se),
          n: Number(n),
          outcome,
        }),
      });
      setStudyLabel("");
      refresh(questionId);
    });
  }

  function doExport() {
    start(async () => {
      const text = await api<string>(
        \`/api/effects?questionId=\${encodeURIComponent(questionId)}&export=json\`,
      );
      setExportText(text);
    });
  }

  return (
    <StudioShell
      title="Effect ledger"
      subtitle="Extract study-level effects before pooling."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-stone-900">Add effect</p>
          <div>
            <Label>Question</Label>
            <select
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={questionId}
              onChange={(e) => {
                setQuestionId(e.target.value);
                refresh(e.target.value);
              }}
            >
              {questions.map((q) => (
                <option key={q.id} value={q.id}>{q.title}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Study</Label>
            <Input value={studyLabel} onChange={(e) => setStudyLabel(e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label>Effect</Label>
              <Input value={effectSize} onChange={(e) => setEffectSize(e.target.value)} />
            </div>
            <div>
              <Label>SE</Label>
              <Input value={se} onChange={(e) => setSe(e.target.value)} />
            </div>
            <div>
              <Label>N</Label>
              <Input value={n} onChange={(e) => setN(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Outcome</Label>
            <Input value={outcome} onChange={(e) => setOutcome(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button disabled={pending || !studyLabel.trim() || !questionId} onClick={create}>
              Add effect
            </Button>
            <Button variant="outline" disabled={pending} onClick={doExport}>
              Export JSON
            </Button>
          </div>
          {exportText ? (
            <pre className="max-h-40 overflow-auto rounded bg-stone-50 p-2 text-xs">{exportText}</pre>
          ) : null}
        </div>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
              <p className="font-medium text-stone-900">{item.studyLabel}</p>
              <p className="mt-1 text-sm text-stone-500">
                effect {item.effectSize} · SE {item.se} · n={item.n} · {item.outcome}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
`,
);

w(
  "src/app/analyses/page.tsx",
  `"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { PooledAnalysis, ReviewQuestion, ScoreMode, SynthesisProfile } from "@/store";

export default function AnalysesPage() {
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [items, setItems] = useState<PooledAnalysis[]>([]);
  const [questionId, setQuestionId] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<ScoreMode>("agentic");
  const [profile, setProfile] = useState<SynthesisProfile>("balanced");
  const [pending, start] = useTransition();

  function refresh(qid?: string) {
    start(async () => {
      const qs = await api<{ items: ReviewQuestion[] }>("/api/questions?page=1&pageSize=50");
      setQuestions(qs.items);
      const id = qid || questionId || qs.items[0]?.id || "";
      if (!questionId && id) setQuestionId(id);
      const res = await api<{ items: PooledAnalysis[] }>(
        \`/api/analyses?questionId=\${encodeURIComponent(id)}\`,
      );
      setItems(res.items);
    });
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      await api("/api/analyses", {
        method: "POST",
        body: JSON.stringify({ questionId, name, mode, profile }),
      });
      setName("");
      refresh(questionId);
    });
  }

  return (
    <StudioShell
      title="Pooled analyses"
      subtitle="Pool effects with soft heterogeneity (I² / τ²) under an agentic or ad-hoc plan."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-stone-900">Run analysis</p>
          <div>
            <Label>Question</Label>
            <select
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={questionId}
              onChange={(e) => {
                setQuestionId(e.target.value);
                refresh(e.target.value);
              }}
            >
              {questions.map((q) => (
                <option key={q.id} value={q.id}>{q.title}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Random-effects pool" />
          </div>
          <div>
            <Label>Mode</Label>
            <select
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={mode}
              onChange={(e) => setMode(e.target.value as ScoreMode)}
            >
              <option value="agentic">agentic</option>
              <option value="adhoc">adhoc</option>
            </select>
          </div>
          <div>
            <Label>Profile</Label>
            <select
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={profile}
              onChange={(e) => setProfile(e.target.value as SynthesisProfile)}
            >
              <option value="balanced">balanced</option>
              <option value="rigorous">rigorous</option>
            </select>
          </div>
          <Button disabled={pending || !name.trim() || !questionId} onClick={create}>
            Run pool
          </Button>
        </div>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-stone-900">{item.name}</p>
                <Badge variant="outline">{item.mode}</Badge>
              </div>
              <p className="mt-2 text-sm text-stone-600">
                pooled {item.pooledEffect} · I² {item.iSquared}% · τ² {item.tauSquared}
              </p>
              {item.quality ? (
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs text-stone-500">
                    <span>Overall plan quality</span>
                    <span>{item.quality.overall}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded bg-stone-100">
                    <div
                      className="animate-forest-reveal h-full rounded bg-[var(--studio-forest)]"
                      style={{ width: \`\${Math.min(100, item.quality.overall)}%\` }}
                    />
                  </div>
                  <p className="text-xs text-stone-400">
                    screen {item.quality.screenCoverage} · hetero {item.quality.heterogeneityScore} · trail {item.quality.auditTrail}
                  </p>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
`,
);

w(
  "src/app/compare/page.tsx",
  `"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { CompareResult, ReviewQuestion } from "@/store";

export default function ComparePage() {
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [items, setItems] = useState<CompareResult[]>([]);
  const [questionId, setQuestionId] = useState("");
  const [name, setName] = useState("");
  const [pending, start] = useTransition();

  function refresh() {
    start(async () => {
      const qs = await api<{ items: ReviewQuestion[] }>("/api/questions?page=1&pageSize=50");
      setQuestions(qs.items);
      if (!questionId && qs.items[0]) setQuestionId(qs.items[0].id);
      const res = await api<{ items: CompareResult[] }>("/api/compare");
      setItems(res.items);
    });
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({ name: name || "Agentic vs ad-hoc", questionId }),
      });
      setName("");
      refresh();
    });
  }

  return (
    <StudioShell
      title="Compare"
      subtitle="Agentic pipeline plan quality versus an ad-hoc baseline that skips screen discipline and heterogeneity."
    >
      <div className="mb-6 space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <div>
          <Label>Question</Label>
          <select
            className="flex h-8 w-full max-w-xl rounded-lg border border-input bg-transparent px-2.5 text-sm"
            value={questionId}
            onChange={(e) => setQuestionId(e.target.value)}
          >
            {questions.map((q) => (
              <option key={q.id} value={q.id}>{q.title}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Label</Label>
          <Input className="max-w-xl" value={name} onChange={(e) => setName(e.target.value)} placeholder="Agentic vs ad-hoc" />
        </div>
        <Button disabled={pending || !questionId} onClick={create}>
          Run compare
        </Button>
      </div>

      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-stone-900">{item.name}</p>
              <Badge>winner: {item.winner}</Badge>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--studio-forest)]">Agentic</p>
                <p className="mt-1 text-2xl font-[family-name:var(--font-display)] text-stone-900">
                  {item.agentic.overall}
                </p>
                <p className="text-xs text-stone-500">
                  screen {item.agentic.screenCoverage} · hetero {item.agentic.heterogeneityScore}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-stone-400">Ad-hoc</p>
                <p className="mt-1 text-2xl font-[family-name:var(--font-display)] text-stone-900">
                  {item.adhoc.overall}
                </p>
                <p className="text-xs text-stone-500">
                  screen {item.adhoc.screenCoverage} · hetero {item.adhoc.heterogeneityScore}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
`,
);

w(
  "src/app/settings/page.tsx",
  `"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { Member, MemberRole, OrgSettings } from "@/store";

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("analyst");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [name, setName] = useState("");
  const [csv, setCsv] = useState("");
  const [pending, start] = useTransition();

  function refresh() {
    start(async () => {
      const [s, m, f] = await Promise.all([
        api<OrgSettings>("/api/settings"),
        api<{ items: Member[] }>("/api/members"),
        api<{ items: string[] }>("/api/features"),
      ]);
      setOrg(s);
      setName(s.name);
      setWebhookUrl(s.webhookUrl);
      setMembers(m.items);
      setFeatures(f.items);
    });
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function save() {
    start(async () => {
      await api("/api/settings", {
        method: "POST",
        body: JSON.stringify({ name, webhookUrl }),
      });
      refresh();
    });
  }

  function invite() {
    start(async () => {
      await api("/api/members", {
        method: "POST",
        body: JSON.stringify({ email, role }),
      });
      setEmail("");
      refresh();
    });
  }

  function exportAudits() {
    start(async () => {
      const text = await api<string>("/api/audits?export=csv");
      setCsv(text);
    });
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, members, webhook HMAC, and feature catalog for Meta Synthesis Studio."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-stone-900">Organization</p>
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Webhook URL</Label>
            <Input value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://…" />
          </div>
          {org ? (
            <p className="text-xs text-stone-500">
              Bearer token: <code>{org.bearerToken}</code> · default {org.defaultMode} / {org.defaultProfile} · rate {org.rateLimitPerMinute}/min
            </p>
          ) : null}
          <Button disabled={pending} onClick={save}>Save settings</Button>
          <Button variant="outline" disabled={pending} onClick={exportAudits}>Export audits CSV</Button>
          {csv ? <pre className="max-h-40 overflow-auto rounded bg-stone-50 p-2 text-xs">{csv}</pre> : null}
        </div>

        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-stone-900">Invite member</p>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="analyst@org.org" />
          <select
            className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value as MemberRole)}
          >
            <option value="owner">owner</option>
            <option value="analyst">analyst</option>
            <option value="viewer">viewer</option>
          </select>
          <Button disabled={pending || !email.trim()} onClick={invite}>Invite</Button>
          <ul className="space-y-1 pt-2">
            {members.map((m) => (
              <li key={m.id} className="flex items-center gap-2 text-sm">
                <span>{m.email}</span>
                <Badge variant="outline">{m.role}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <p className="font-medium text-stone-900">Features ({features.length})</p>
        <ul className="mt-3 grid gap-1 text-sm text-stone-600 md:grid-cols-2">
          {features.map((f) => (
            <li key={f}>· {f}</li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
`,
);

w(
  "src/app/honesty/page.tsx",
  `import Link from "next/link";
import {
  AUTHORS_CODE_URL,
  CLAIM,
  DISPLAY_NAME,
  GUIDE_PATH,
  PAPER_URL,
} from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="What this Method Lab studio is — and is not."
    >
      <div className="max-w-3xl space-y-6 text-stone-600">
        <p>
          <strong className="text-stone-900">{DISPLAY_NAME}</strong> is a
          method-lab product inspired by agentic meta-analysis research.
          It soft-simulates review pipelines, screen discipline, pooled effects,
          and heterogeneity readiness. It is <em>not</em> a live PubMed client or
          a publication-ready statistics package, and it is not branded as
          AutoSynthesis.
        </p>
        <p>
          <strong className="text-stone-900">Claim:</strong> {CLAIM}
        </p>
        <p>
          Dual score: <strong>A</strong> agentic synthesis plan (search → screen →
          extract → pool + heterogeneity) vs <strong>B</strong> ad-hoc single-pass
          baseline that skips screen discipline and heterogeneity checks.
        </p>
        <div>
          <p className="font-medium text-stone-900">Sources</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            <li>
              Paper:{" "}
              <a className="underline" href={PAPER_URL}>
                {PAPER_URL}
              </a>
            </li>
            <li>
              Authors&apos; code:{" "}
              {AUTHORS_CODE_URL ? (
                <a className="underline" href={AUTHORS_CODE_URL}>
                  {AUTHORS_CODE_URL}
                </a>
              ) : (
                "none published with the digest"
              )}
            </li>
            <li>
              Tutor guide:{" "}
              <span className="font-mono text-xs">{GUIDE_PATH}</span>
              {" · "}
              <Link className="underline" href="/questions">
                open studio
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
`,
);

console.log("pages batch 2 done");
