import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HonestyPage() {
  return (
    <div data-honesty="live" className="space-y-6 max-w-2xl">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--scd-ink)]">
        Honesty
      </h1>
      <p className="text-[var(--scd-muted)] leading-relaxed">
        Security Control Desk is a method-lab experiment inspired by paper
        2607.09076 — not a replacement for the authors&apos; neuro-agentic control system.
        It is not a commercial industrial control product.
      </p>
      <p className="text-[var(--scd-muted)] leading-relaxed">
        Scores here are a dual-impl sketch (naive open-loop baseline vs
        safer agentic counterfactual control). They are not measured production speedups.
        Never brand this desk as Neuro-Agentic Control.
      </p>
      <p className="text-sm text-[var(--scd-muted)]">
        Paper:{" "}
        <a
          className="underline text-[var(--scd-steel)]"
          href="https://arxiv.org/abs/2607.09076v1"
        >
          https://arxiv.org/abs/2607.09076v1
        </a>
        . Authors&apos; code: none published with this paper.
      </p>
      <p className="text-sm">
        <a
          className="tutor-guide-link underline text-[var(--scd-steel)]"
          href="https://github.com/serhii-kucherenko/ai-method-lab/blob/main/docs/guides/17-security-control-desk-lessons.md"
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
