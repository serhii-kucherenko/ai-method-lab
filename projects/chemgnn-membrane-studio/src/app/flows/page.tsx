import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const NAMED_FLOWS = [
  {
    id: "create-membrane-pack",
    actor: "Membrane / desalination ML lead",
    job: "Version a membrane pack before scoring",
    steps: ["/membranes → create pack → version + membrane focus"],
    success: "Active membrane pack listed with graph budget",
    emptyError: "Missing label/version blocks create",
    href: "/membranes",
  },
  {
    id: "encode-cnt-graph",
    actor: "Membrane-ML graph engineer",
    job: "Encode CNT graph geometry and channel fidelity",
    steps: ["/graphs → select pack → channel cues → create"],
    success: "Graph config linked to pack",
    emptyError: "Invalid pack id returns error",
    href: "/graphs",
  },
  {
    id: "run-chemgnn-surrogate",
    actor: "Surrogate evaluator",
    job: "Capture ChemGNN surrogate specs for soft-sim",
    steps: ["/surrogates → create → link pack → membrane channel"],
    success: "Surrogate set open and listed under the pack",
    emptyError: "Empty surrogate text blocks create",
    href: "/surrogates",
  },
  {
    id: "ab-compare",
    actor: "Evaluator",
    job: "Compare ChemGNN surrogate vs classical physics baseline",
    steps: ["/runs → scores → /compare → A/B → /scoreboard"],
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
      subtitle="Five sophisticated journeys for ChemGNN membrane soft-sim — not a single happy path."
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
              className="mt-3 inline-block text-sm text-[var(--cm-teal)] underline"
            >
              Enter flow → {f.href}
            </Link>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}
