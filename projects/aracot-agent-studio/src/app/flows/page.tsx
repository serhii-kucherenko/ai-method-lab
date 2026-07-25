import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const NAMED_FLOWS = [
  {
    id: "create-agent-pack",
    actor: "Multilingual agent product lead",
    job: "Version an agent pack before scoring",
    steps: ["/agents → create pack → version + cohort target"],
    success: "Active agent pack listed with trace budget",
    emptyError: "Missing label/version blocks create",
    href: "/agents",
  },
  {
    id: "capture-arabic-cot-traces",
    actor: "Arabic NLP engineer",
    job: "Make Arabic CoT step quality and fluency spans explicit",
    steps: ["/traces → select pack → sequence cues → create"],
    success: "Trace set linked to pack",
    emptyError: "Invalid pack id returns error",
    href: "/traces",
  },
  {
    id: "run-distillation",
    actor: "Distill engineer",
    job: "Capture distill configs and soft-sim runs",
    steps: ["/distills → create → /runs → CoT / fluency scores"],
    success: "Distill marked scored with an active run",
    emptyError: "Missing distill/trace refs fail run create",
    href: "/distills",
  },
  {
    id: "ab-compare",
    actor: "Evaluator",
    job: "Compare Arabic CoT distilled agent vs non-distilled multilingual baseline",
    steps: ["/compare → select refs → run A/B → /scoreboard"],
    success: "Winner + gap recorded; scoreboard updates",
    emptyError: "Empty refs show invalid_refs",
    href: "/compare",
  },
  {
    id: "export-webhook",
    actor: "Org owner",
    job: "Export packs and wire HMAC webhook for scored events",
    steps: ["/settings → export JSON/CSV → webhook secret → invite member"],
    success: "Export bytes returned; member invited; audit logged",
    emptyError: "Bad bearer or HMAC rejected",
    href: "/settings",
  },
] as const;

export default function FlowsPage() {
  return (
    <StudioShell
      title="Flows"
      subtitle="Five sophisticated journeys for Arabic CoT agent soft-sim — not a single happy path."
    >
      <div className="space-y-4">
        {NAMED_FLOWS.map((f) => (
          <article
            key={f.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <h2 className="font-[family-name:var(--font-display)] text-xl">
              {f.job}
            </h2>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Actor: {f.actor}
            </p>
            <p className="mt-2 text-sm">
              <strong>Steps:</strong> {f.steps.join(" ")}
            </p>
            <p className="mt-1 text-sm">
              <strong>Success:</strong> {f.success}
            </p>
            <p className="mt-1 text-sm">
              <strong>Empty / error:</strong> {f.emptyError}
            </p>
            <Link
              href={f.href}
              className="mt-3 inline-block text-sm text-[var(--aa-green)] underline"
            >
              Enter flow → {f.href}
            </Link>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}
