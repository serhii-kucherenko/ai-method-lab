import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HonestyPage() {
  return (
    <div data-honesty="live" className="space-y-6 max-w-2xl">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--scd-ink)]">
        Honesty
      </h1>
      <p className="text-[var(--scd-muted)] leading-relaxed">
        Itinerary Plan Desk is a method-lab experiment inspired by paper
        2607.15552 — not a replacement for the authors&apos; day itinerary
        system. It is not a commercial trip planner.
      </p>
      <p className="text-[var(--scd-muted)] leading-relaxed">
        Scores here are a dual-impl sketch (naive preference-only baseline vs
        feasibility-first plan/learn/adapt scheduling). They are not measured production
        itinerary quality gains. Never brand this desk as FlyEnJoy or PLA.
      </p>
      <p className="text-sm text-[var(--scd-muted)]">
        Paper:{" "}
        <a
          className="underline text-[var(--scd-steel)]"
          href="https://arxiv.org/abs/2607.15552v1"
        >
          https://arxiv.org/abs/2607.15552v1
        </a>
        . Authors&apos; code:{" "}
        <a
          className="underline text-[var(--scd-steel)]"
          href="https://github.com/Official529Tech/pla-itinerary"
        >
          https://github.com/Official529Tech/pla-itinerary
        </a>
      </p>
      <p className="text-sm">
        <a
          className="tutor-guide-link underline text-[var(--scd-steel)]"
          href="https://github.com/serhii-kucherenko/ai-method-lab/blob/main/docs/guides/19-itinerary-plan-desk-lessons.md"
        >
          Tutor guide
        </a>
      </p>
      <Button asChild variant="outline">
        <Link href="/jobs">Back to desk</Link>
      </Button>
    </div>
  );
}
