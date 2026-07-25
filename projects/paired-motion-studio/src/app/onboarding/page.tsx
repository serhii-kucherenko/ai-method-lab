import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const CHECKLIST = [
  ["Create capture pack", "/captures"],
  ["Configure wearer", "/wearers"],
  ["Configure observer", "/observers"],
  ["Open session + run", "/sessions"],
  ["Run A/B compare", "/compare"],
  ["Read honesty fence", "/honesty"],
  ["Set organization preferences", "/settings"],
] as const;

export function OnboardingPage() {
  return (
    <StudioShell
      title="Onboarding"
      subtitle="Set up an honest, repeatable paired-motion comparison."
    >
      <div className="max-w-2xl rounded-lg border bg-white p-6">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">
            Progress
          </h2>
          <span className="text-sm text-slate-600">
            0 / {CHECKLIST.length} complete
          </span>
        </div>
        <ol className="space-y-3">
          {CHECKLIST.map(([label, href], i) => (
            <li
              key={href}
              className="flex items-center gap-3 rounded-md border p-3"
            >
              <span className="grid size-7 place-items-center rounded-full bg-[var(--pm-mist)] text-sm">
                {i + 1}
              </span>
              <Link
                className="font-medium text-[var(--pm-teal)] underline"
                href={href}
              >
                {label}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </StudioShell>
  );
}

export default OnboardingPage;
