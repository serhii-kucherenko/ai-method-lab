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
    id: "create-molecule-pack",
    name: "Create molecule pack",
    actor: "Chem-informatics lead",
    job: "Record the chem-space library and fingerprint assumptions for a soft-sim.",
    steps: [
      "/molecules — create a pack",
      "Add version and chem space",
      "Review pack status",
    ],
    success: "Molecule pack is listed with a version.",
    emptyError: "No packs — create the first molecule pack.",
    href: "/molecules",
    cta: "Open molecules",
  },
  {
    id: "configure-kernels",
    name: "Configure quantum vs classical kernels",
    actor: "QSAR method scientist",
    job: "Choose kernel families, quantum weight, and classical mix.",
    steps: [
      "/kernels — define families",
      "Set quantum weight",
      "Review kernel intent",
    ],
    success: "Kernel config names its families and weights.",
    emptyError: "Need a molecule pack before adding kernels.",
    href: "/kernels",
    cta: "Open kernels",
  },
  {
    id: "add-target-case",
    name: "Add target case",
    actor: "Medicinal chemist reviewer",
    job: "Record a binding case and success condition for QSAR soft-sim.",
    steps: [
      "/targets — create case",
      "Set success condition",
      "Link assay channel",
    ],
    success: "A target case records binding summary.",
    emptyError: "Need a molecule pack before adding targets.",
    href: "/targets",
    cta: "Open targets",
  },
  {
    id: "run-ab-compare",
    name: "Run A/B QSAR compare",
    actor: "Evaluation reviewer",
    job: "Compare quantum multiple-kernel QSAR with classical kernel baseline.",
    steps: [
      "/runs — create a QSAR run",
      "/compare — run A/B",
      "/scoreboard — inspect gaps",
    ],
    success:
      "Compare reports quantum_multi_kernel or classical_kernel winner and gap.",
    emptyError: "Need kernel, target, and QSAR run.",
    href: "/compare",
    cta: "Run compare",
  },
  {
    id: "export-webhook",
    name: "Export and webhook",
    actor: "Workspace admin",
    job: "Export packs and compare results, then connect a signed webhook.",
    steps: [
      "/settings — set secret and URL",
      "Export molecule data",
      "Receive idempotent webhook",
    ],
    success: "Exports download and signed events are accepted.",
    emptyError: "Auth requires qks-dev-token.",
    href: "/settings",
    cta: "Open settings",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Named journeys for quantum-kernel soft-sim."
    >
      <ul className="space-y-6">
        {NAMED_FLOWS.map((flow) => (
          <li
            key={flow.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5"
          >
            <h2 className="font-[family-name:var(--font-display)] text-xl text-slate-900">
              {flow.name}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              <span className="font-medium">actor</span>: {flow.actor}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              <span className="font-medium">job</span>: {flow.job}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              <span className="font-medium">success</span>: {flow.success}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              <span className="font-medium">emptyError</span>: {flow.emptyError}
            </p>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-slate-500">
              {flow.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <div className="mt-4">
              <Button asChild>
                <Link href={flow.href}>{flow.cta}</Link>
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
