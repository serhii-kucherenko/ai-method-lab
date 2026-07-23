import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HonestyPage() {
  return (
    <div data-honesty="live" className="space-y-6 max-w-2xl">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--lld-ink)]">
        Honesty
      </h1>
      <p className="text-[var(--lld-muted)] leading-relaxed">
        Ladder Logic Desk is a method-lab experiment inspired by paper
        2607.08417 — not a replacement for the authors&apos; formal verifier.
        It is not a commercial PLC security product.
      </p>
      <p className="text-[var(--lld-muted)] leading-relaxed">
        Scores here are a dual-impl sketch (naive scan baseline vs formal
        trigger synthesis). They are not measured plant outcomes. Never brand
        this desk with the authors&apos; tool names or as IEC statute codes.
      </p>
      <p className="text-sm text-[var(--lld-muted)]">
        Paper:{" "}
        <a
          className="underline text-[var(--lld-teal)]"
          href="https://arxiv.org/abs/2607.08417v1"
        >
          https://arxiv.org/abs/2607.08417v1
        </a>
        . Authors&apos; code: none published with this paper.
      </p>
      <Button asChild variant="outline">
        <Link href="/jobs">Back to desk</Link>
      </Button>
    </div>
  );
}
