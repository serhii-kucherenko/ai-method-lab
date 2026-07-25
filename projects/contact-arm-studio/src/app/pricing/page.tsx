import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Starter",
    price: "$0 method-lab",
    detail: "1 seat · manipulator packs · contact-plan soft-sim compares",
  },
  {
    name: "Team",
    price: "Bench seats",
    detail: "Shared workspace · tactile+vision cues · scoreboard · export",
  },
] as const;

export default function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Seats for contact-planning soft-sim benches."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-6"
          >
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-slate-900">
              {t.name}
            </h2>
            <p className="mt-2 text-[var(--studio-orange)]">{t.price}</p>
            <p className="mt-3 text-sm text-slate-600">{t.detail}</p>
          </div>
        ))}
      </div>
      <p className="mt-10 max-w-2xl text-sm text-slate-500">
        Soft-sim / method-lab pricing only. This is not a live robot controller,
        not a safety certification, and not branded as TACTIC.
      </p>
    </StudioShell>
  );
}
