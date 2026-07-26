import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const FLOWS = [
  {
    name: "Create impact pack",
    actor: "Immunization-program analytics lead",
    job: "Version a soft-sim pack before comparing mortality-linked coverage.",
    steps: "Packs → create → search",
    success: "Active pack listed with version and program focus",
    failure: "Invalid label/version returns form error",
    href: "/packs",
  },
  {
    name: "Configure country panel",
    actor: "EPI desk analyst",
    job: "Make SSA country context explicit for the pack.",
    steps: "Countries → add kind/region → list",
    success: "Country row with kind and region hint",
    failure: "Bad pack id rejects create",
    href: "/countries",
  },
  {
    name: "Configure antigen coverage",
    actor: "Coverage planner",
    job: "Specify DTP3/measles antigen soft-sim floors.",
    steps: "Antigens → add schedule → list",
    success: "Antigen row with schedule hint",
    failure: "Missing pack id blocks create",
    href: "/antigens",
  },
  {
    name: "Run A/B compare",
    actor: "Impact evaluator",
    job: "Compare immunization-linked mortality vs coverage-only dashboard.",
    steps: "Panels → Compare → Scoreboard",
    success: "Winner and gap recorded; linked may beat coverage-only",
    failure: "Bad refs return error",
    href: "/compare",
  },
  {
    name: "Export + webhook",
    actor: "Org owner",
    job: "Export packs/compares and configure webhook ingest.",
    steps: "Settings → export → webhook URL",
    success: "JSON/CSV download; members + audit visible",
    failure: "Unauthorized without bearer token",
    href: "/settings",
  },
];

export function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Five sophisticated journeys for immunization-program analytics — not a single happy path."
    >
      <ul className="space-y-4">
        {FLOWS.map((f) => (
          <li key={f.name} className="rounded-lg border bg-white px-4 py-4">
            <h2 className="font-semibold">{f.name}</h2>
            <p className="mt-1 text-sm">
              <span className="font-medium">Actor:</span> {f.actor}
            </p>
            <p className="text-sm">
              <span className="font-medium">Job:</span> {f.job}
            </p>
            <p className="text-sm">
              <span className="font-medium">Steps:</span> {f.steps}
            </p>
            <p className="text-sm">
              <span className="font-medium">Success:</span> {f.success}
            </p>
            <p className="text-sm">
              <span className="font-medium">Failure:</span> {f.failure}
            </p>
            <Link href={f.href} className="mt-2 inline-block text-sm underline text-[var(--ii-teal)]">
              Enter flow
            </Link>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default FlowsPage;
