export default function HonestyPage() {
  return (
    <section data-honesty="live" className="max-w-2xl space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
        Realtime Deploy Desk
      </h1>
      <p className="text-[var(--rdd-muted)]">
        A method-lab product for harness-guided deployment optimization
        experiments — inspired by a paper with no published authors&apos; code
        bundle.
      </p>
      <div className="border-l-4 border-[var(--rdd-warn)] bg-[#fff8ef] px-4 py-3 text-[var(--rdd-ink)]">
        <strong>Honesty:</strong> This is a method experiment inspired by paper
        2607.18171 — not a replacement for the authors&apos; harness. Authors&apos;
        code: none published with this paper. It is not a production serving
        stack.
      </div>
      <p className="text-[var(--rdd-muted)]">
        Display name stays <strong>Realtime Deploy Desk</strong>. We never brand
        this desk with the paper project&apos;s short name (FlashRT).
      </p>
      <p className="text-sm text-[var(--rdd-muted)]">
        Tutor guide:{" "}
        <a
          className="tutor-guide-link text-[var(--rdd-teal)] underline-offset-2 hover:underline"
          href="/docs/guides/11-realtime-deploy-desk-lessons.md"
        >
          Realtime Deploy Desk lessons
        </a>
      </p>
      <p className="text-sm">
        <a
          className="text-[var(--rdd-teal)] underline-offset-2 hover:underline"
          href="https://arxiv.org/abs/2607.18171v1"
        >
          https://arxiv.org/abs/2607.18171v1
        </a>
      </p>
    </section>
  );
}
