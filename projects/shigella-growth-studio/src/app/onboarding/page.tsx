import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const CHECKS = [
  { label: "Create your first cohort pack", href: "/packs" },
  { label: "Add a cohort age band", href: "/cohorts" },
  { label: "Configure a Shigella episode", href: "/episodes" },
  { label: "Create a growth assay", href: "/growth" },
  { label: "Run an A/B compare", href: "/compare" },
  { label: "Invite a teammate", href: "/settings" },
  { label: "Read the honesty fence", href: "/honesty" },
];

export function OnboardingPage() {
  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist to get from empty org to a lock-ready soft-sim compare."
    >
      <ul className="space-y-3">
        {CHECKS.map((c) => (
          <li key={c.href} className="flex items-center gap-3 rounded-lg border bg-white px-4 py-3">
            <span className="inline-block size-4 rounded border border-[var(--sg-line)]" aria-hidden />
            <Link href={c.href} className="text-[var(--sg-teal)] underline">
              {c.label}
            </Link>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default OnboardingPage;
