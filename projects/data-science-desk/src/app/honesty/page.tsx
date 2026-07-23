import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HonestyPage() {
  return (
    <div data-honesty="live" className="space-y-6 max-w-2xl">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--dsd-ink)]">
        Honesty
      </h1>
      <p className="text-[var(--dsd-muted)] leading-relaxed">
        Data Science Desk is a method-lab experiment inspired by paper
        2607.15901 — not a replacement for the authors&apos; world-model system.
        It is not a commercial data-science agent platform.
      </p>
      <p className="text-[var(--dsd-muted)] leading-relaxed">
        Scores here are a dual-impl sketch (naive step-burn baseline vs
        world-model guided routing). They are not measured production speedups.
        Never brand this desk as DSWorld.
      </p>
      <p className="text-sm text-[var(--dsd-muted)]">
        Paper:{" "}
        <a
          className="underline text-[var(--dsd-teal)]"
          href="https://arxiv.org/abs/2607.15901v1"
        >
          https://arxiv.org/abs/2607.15901v1
        </a>
        . Authors&apos; code: none published with this paper.
      </p>
      <p className="text-sm">
        <a
          className="tutor-guide-link underline text-[var(--dsd-teal)]"
          href="https://github.com/serhii-kucherenko/ai-method-lab/blob/main/docs/guides/16-data-science-desk-lessons.md"
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
