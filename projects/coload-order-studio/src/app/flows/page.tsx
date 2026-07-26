import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const FLOWS = [
  {
    name: "Create carrier pack",
    actor: "Formulation lead",
    job: "Version a hollow mesoporous co-load context",
    steps: "/packs → label/version/focus → active pack",
    success: "Pack appears in registry with version",
    failure: "Empty label rejected; archived packs filtered",
    href: "/packs",
  },
  {
    name: "Configure load sequence",
    actor: "Formulation analyst",
    job: "Make chemo-then-photo order explicit",
    steps: "/loads → order kind + hint → save",
    success: "Load sequence linked to pack",
    failure: "Missing pack id returns not_found",
    href: "/loads",
  },
  {
    name: "Configure assay",
    actor: "Assay soft-sim operator",
    job: "Capture order fidelity and encapsulation signals",
    steps: "/assays → carrier + load + metrics → create",
    success: "Assay run listed with fidelity scores",
    failure: "Unknown carrier/load blocked",
    href: "/assays",
  },
  {
    name: "Run A/B compare",
    actor: "Evaluator",
    job: "Decide if ordered co-load beats simultaneous baseline",
    steps: "/compare → select entities → run → /scoreboard",
    success: "Winner + gap recorded on scoreboard",
    failure: "Missing assay id returns error",
    href: "/compare",
  },
  {
    name: "Export + webhook",
    actor: "Org admin",
    job: "Hand off packs/compares and ingest signed events",
    steps: "/settings → export JSON/CSV → webhook HMAC",
    success: "Download + idempotent webhook ack",
    failure: "Bad signature rejected; rate limit 429",
    href: "/settings",
  },
] as const;

export function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Five sophisticated journeys for ordered chemo-photothermal co-load soft-sim."
    >
      <div className="space-y-4">
        {FLOWS.map((f) => (
          <article key={f.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-xl">
              {f.name}
            </h2>
            <p className="mt-1 text-sm">
              <strong>Actor:</strong> {f.actor}
            </p>
            <p className="text-sm">
              <strong>Job:</strong> {f.job}
            </p>
            <p className="text-sm">
              <strong>Steps:</strong> {f.steps}
            </p>
            <p className="text-sm">
              <strong>Success:</strong> {f.success}
            </p>
            <p className="text-sm">
              <strong>Failure:</strong> {f.failure}
            </p>
            <Link
              href={f.href}
              className="mt-3 inline-block text-sm underline text-[var(--co-slate)]"
            >
              Enter flow
            </Link>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}

export default FlowsPage;
