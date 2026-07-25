import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Starter",
    price: "$0 method-lab",
    detail: "1 seat · seed persona pack · dual compare soft-sim",
  },
  {
    name: "Team",
    price: "Seats + packs",
    detail: "Up to 10 seats · private persona/eval packs · webhook export",
  },
  {
    name: "Eval Lab",
    price: "Pack license",
    detail: "Org seats · versioned packs · disparity scoreboard · audit trail",
  },
] as const;

export default function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Seats and persona-pack tiers for clinical AI eval soft-sim."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className="rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5"
          >
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-slate-900">
              {t.name}
            </h2>
            <p className="mt-2 text-[var(--studio-mint)]">{t.price}</p>
            <p className="mt-3 text-sm text-slate-600">{t.detail}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-slate-500">
        Soft-sim method-lab packaging only — not clinical advice, not FDA, not a
        live patient chatbot. No card required for the Starter experiment.
      </p>
      <p className="mt-4">
        <Link href="/onboarding" className="text-[var(--studio-mint)] underline">
          Continue to onboarding
        </Link>
      </p>
    </StudioShell>
  );
}
