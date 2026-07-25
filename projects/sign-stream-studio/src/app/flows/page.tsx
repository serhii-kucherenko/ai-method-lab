import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

export type NamedFlow = {
  id: string;
  name: string;
  actor: string;
  job: string;
  steps: string[];
  success: string;
  emptyError: string;
  href: string;
  cta: string;
};

export const NAMED_FLOWS: NamedFlow[] = [
  {
    id: "first-run",
    name: "First-run onboarding",
    actor: "Language-access product lead",
    job: "Stand up the studio before the first real stream review.",
    steps: [
      "/onboarding — open checklist",
      "/settings — confirm org name",
      "Seed demo stream (or /streams)",
      "/honesty — acknowledge soft-sim fence",
    ],
    success: "Checklist ≥4/5 with honesty checked; seeded stream visible.",
    emptyError: "Seed fails if API unauthorized — use bearer sss-dev-token.",
    href: "/onboarding",
    cta: "Start onboarding",
  },
  {
    id: "stream-segment",
    name: "Create stream → segment → score inputs",
    actor: "Localization engineer",
    job: "Register a live sign stream and cut a sentence segment ready to score.",
    steps: [
      "/streams — create language-pair stream",
      "/sentences — add gloss segment + boundary confidence",
      "/latency — attach budget (optional same session)",
      "/compare — ready when budget exists",
    ],
    success: "Stream + active segment listed; ready for dual compare.",
    emptyError: "Sentences page empty-state if no streams — create on /streams first.",
    href: "/streams",
    cta: "Open streams",
  },
  {
    id: "dual-compare",
    name: "Real-time vs offline-batch compare",
    actor: "A11y program reviewer",
    job: "Falsify whether streaming beats waiting for the full batch gloss.",
    steps: [
      "/streams — pick seeded or new stream",
      "/sentences + /latency — ensure segment + budget",
      "/compare — run A vs B",
      "Read winner + score bars",
    ],
    success: "Compare row with winner realtime_stream | offline_batch | tie.",
    emptyError: "Need stream + segment + budget — empty prompt links back.",
    href: "/compare",
    cta: "Run compare",
  },
  {
    id: "glossary-curator",
    name: "Glossary curator path",
    actor: "Glossary / terminology curator",
    job: "Raise vocabulary coverage for terms that break sentence streams.",
    steps: [
      "/streams — select target stream",
      "/glossary — add core/domain terms + coverage",
      "/compare — re-run to see glossaryScore influence",
    ],
    success: "Glossary terms listed with coverage; compare uses avg coverage.",
    emptyError: "No entries until a stream is selected and a term is posted.",
    href: "/glossary",
    cta: "Curate glossary",
  },
  {
    id: "latency-sla",
    name: "Latency / SLA budget review",
    actor: "Ops / SLA owner",
    job: "Set flush policy and budget ms so stream quality stays honest under jitter.",
    steps: [
      "/streams — choose live stream",
      "/latency — set budgetMs, jitter, flush policy",
      "/compare — see latencyScore vs offline baseline",
      "/honesty — confirm soft-sim limits",
    ],
    success: "Active budget on stream; compare reflects latency pressure.",
    emptyError: "Budgets empty until stream exists — create stream first.",
    href: "/latency",
    cta: "Review latency",
  },
  {
    id: "audit-export",
    name: "Audit + export for reviewer",
    actor: "Compliance / program reviewer",
    job: "Export streams JSON and compares CSV with audit trail evidence.",
    steps: [
      "/settings — open audits list",
      "Export streams JSON",
      "Export compares CSV",
      "/honesty — cite Sources in review notes",
    ],
    success: "Download files; audits show compare.create / export actions.",
    emptyError: "CSV may be header-only if no compares yet — run /compare first.",
    href: "/settings",
    cta: "Open settings / export",
  },
  {
    id: "org-invite",
    name: "Invite / org settings",
    actor: "Org owner",
    job: "Invite a reader and confirm bearer / rate-limit packaging for the team.",
    steps: [
      "/settings — save org name",
      "Invite member (reader role)",
      "Confirm bearer token shown for API clients",
      "/flows — hand off next journey",
    ],
    success: "Member appears in list; org name persisted.",
    emptyError: "Invite fails on empty email — form requires email.",
    href: "/settings",
    cta: "Manage org",
  },
  {
    id: "pricing-select",
    name: "Pricing-tier selection",
    actor: "Buyer / procurement partner",
    job: "Pick Pilot vs Institution vs Site license packaging (method-lab honesty).",
    steps: [
      "/pricing — read tiers + money hook",
      "Note seats + stream minutes",
      "/onboarding or /demo — continue evaluation",
      "/honesty — acknowledge no live checkout",
    ],
    success: "Buyer can articulate which tier matches seats/minutes need.",
    emptyError: "No checkout — honesty copy if they expect payment capture.",
    href: "/pricing",
    cta: "View pricing",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Eight named journeys for Sign Stream Studio — not a single happy path. Each flow lists actor, job, steps, success, and empty/error."
    >
      <p className="mb-8 max-w-2xl text-sm text-slate-600">
        Category: <strong>a11y / language-access</strong>. Use this index to
        enter any journey. The guided{" "}
        <Link href="/demo" className="underline">
          /demo
        </Link>{" "}
        showcases one path only; it does not replace these flows.
      </p>

      <ol className="space-y-5">
        {NAMED_FLOWS.map((flow, i) => (
          <li
            key={flow.id}
            id={flow.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="max-w-2xl">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--studio-lime)]">
                  Flow {i + 1} · {flow.id}
                </p>
                <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl text-slate-900">
                  {flow.name}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  <span className="font-medium text-slate-800">Actor:</span>{" "}
                  {flow.actor}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  <span className="font-medium text-slate-800">Job:</span>{" "}
                  {flow.job}
                </p>
                <p className="mt-3 text-xs font-medium uppercase text-slate-500">
                  Steps
                </p>
                <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-slate-600">
                  {flow.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
                <p className="mt-3 text-sm text-slate-600">
                  <span className="font-medium text-slate-800">Success:</span>{" "}
                  {flow.success}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  <span className="font-medium text-slate-700">
                    Empty / error:
                  </span>{" "}
                  {flow.emptyError}
                </p>
              </div>
              <Button asChild>
                <Link href={flow.href}>{flow.cta}</Link>
              </Button>
            </div>
          </li>
        ))}
      </ol>
    </StudioShell>
  );
}
