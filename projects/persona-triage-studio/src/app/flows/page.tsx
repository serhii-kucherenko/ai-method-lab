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
    id: "pack-persona",
    name: "Create persona pack + first persona",
    actor: "Eval lead",
    job: "Stand up a versioned pack and register the first communication persona.",
    steps: [
      "/settings — confirm org",
      "/personae — create persona on seed pack (or POST /api/packs)",
      "Tag emotional + strategy axes",
    ],
    success: "Persona listed under /personae with pack link.",
    emptyError: "Empty registry — create first persona on /personae.",
    href: "/personae",
    cta: "Open personae",
  },
  {
    id: "conversation-gold",
    name: "Add conversation case with gold urgency",
    actor: "Eval engineer",
    job: "Author a clinical utterance with a gold urgency label.",
    steps: [
      "/conversations — add case",
      "Set gold urgency (self_care → emergency)",
      "Attach specialty filter",
    ],
    success: "Case visible with gold urgency and searchable content.",
    emptyError: "Need pack selected — seed pack-demo is available.",
    href: "/conversations",
    cta: "Open conversations",
  },
  {
    id: "tune-styles",
    name: "Tune style axes and re-score",
    actor: "Style taxonomist",
    job: "Define hedging/verbosity poles and weights before urgency runs.",
    steps: [
      "/styles — add axis",
      "Set low/high poles + weight",
      "/urgency — create run with updated diversity coverage",
    ],
    success: "Active style axes; urgency run reflects diversity coverage.",
    emptyError: "No axes defined — add one on /styles.",
    href: "/styles",
    cta: "Tune styles",
  },
  {
    id: "ab-scoreboard",
    name: "Run A/B compare and read scoreboard",
    actor: "Release reviewer",
    job: "Falsify style-aware triage vs idealized-patient baseline.",
    steps: [
      "/urgency — ensure a run exists",
      "/compare — run A vs B",
      "/scoreboard — read disparity winners",
    ],
    success: "Compare with winner style_aware | idealized_patient | tie + gap.",
    emptyError: "Need case + persona + urgency run — empty prompt links back.",
    href: "/compare",
    cta: "Run compare",
  },
  {
    id: "export-webhook",
    name: "Export pack + configure webhook",
    actor: "Org admin",
    job: "Export pack JSON and wire HMAC webhook for compare events.",
    steps: [
      "/settings — set webhook secret/URL",
      "Invite a member",
      "Export packs JSON / compares CSV",
    ],
    success: "Export downloads; webhook accepts signed idempotent POSTs.",
    emptyError: "Auth fail without bearer pts-dev-token.",
    href: "/settings",
    cta: "Open settings",
  },
  {
    id: "guided-demo",
    name: "Guided demo walkthrough",
    actor: "New evaluator",
    job: "Walk the soft-sim path in numbered steps.",
    steps: [
      "/demo — complete steps in order",
      "Acknowledge honesty fence",
      "Land on scoreboard",
    ],
    success: "Demo steps completed; compare recorded.",
    emptyError: "Steps blocked until prior done.",
    href: "/demo",
    cta: "Start demo",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="Flows"
      subtitle="Named journeys for clinical AI eval under communication diversity."
    >
      <div className="space-y-6">
        {NAMED_FLOWS.map((f) => (
          <article
            key={f.id}
            className="rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5"
          >
            <h2 className="font-[family-name:var(--font-display)] text-xl text-slate-900">
              {f.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Actor: {f.actor} · Job: {f.job}
            </p>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-slate-600">
              {f.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <p className="mt-3 text-sm text-[var(--studio-mint)]">
              Success: {f.success}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Empty/error: {f.emptyError}
            </p>
            <Button asChild className="mt-4">
              <Link href={f.href}>{f.cta}</Link>
            </Button>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}
