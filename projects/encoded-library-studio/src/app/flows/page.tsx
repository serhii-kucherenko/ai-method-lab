import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

export const NAMED_FLOWS = [
  {
    name: "Create library pack",
    actor: "DELT chemistry analytics lead",
    job: "Version a soft-sim pack before any compare",
    steps: ["/packs"],
    success: "Active pack appears in the registry",
    failure: "Missing label/version blocks create",
  },
  {
    name: "Configure construct cycle",
    actor: "Assay designer",
    job: "Make construct–screen rounds explicit",
    steps: ["/cycles", "/libraries"],
    success: "Cycle with enrichment floor is active",
    failure: "Bad packId returns empty create",
  },
  {
    name: "Filter hit shortlist",
    actor: "Hit triage analyst",
    job: "Set precision floors without nominating clinical candidates",
    steps: ["/hits"],
    success: "Shortlist saved with filter hints",
    failure: "Archive removes it from active search",
  },
  {
    name: "Run A/B compare",
    actor: "Evaluator",
    job: "Compare iterative DELT optimize vs single-pass library screen",
    steps: ["/assays", "/compare", "/scoreboard"],
    success: "Winner + gap recorded on scoreboard",
    failure: "Missing assay refs return bad_refs",
  },
  {
    name: "Export + webhook",
    actor: "Org owner",
    job: "Export packs/compares and ingest HMAC webhook events",
    steps: ["/settings"],
    success: "JSON/CSV export + idempotent webhook ack",
    failure: "Bad signature rejected; duplicate key returns duplicate",
  },
] as const;

export function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Five named journeys for Encoded Library Studio — not a single happy path."
    >
      <ol className="space-y-6">
        {NAMED_FLOWS.map((f) => (
          <li key={f.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-xl">{f.name}</h2>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Actor: {f.actor}
            </p>
            <p className="mt-2">{f.job}</p>
            <p className="mt-2 text-sm">
              Steps:{" "}
              {f.steps.map((s, i) => (
                <span key={s}>
                  {i > 0 ? " → " : ""}
                  <Link href={s} className="underline text-[var(--el-sea)]">
                    {s}
                  </Link>
                </span>
              ))}
            </p>
            <p className="mt-2 text-sm">Success: {f.success}</p>
            <p className="mt-1 text-sm">Failure / empty: {f.failure}</p>
          </li>
        ))}
      </ol>
    </StudioShell>
  );
}

export default FlowsPage;
