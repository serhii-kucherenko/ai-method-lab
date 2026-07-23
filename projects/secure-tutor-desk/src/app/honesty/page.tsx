export default function HonestyPage() {
  return (
    <section data-honesty="live" className="max-w-2xl space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
        Secure Tutor Desk
      </h1>
      <p className="text-[var(--std-muted)]">
        A method-lab product for multi-LLM orchestrated tutoring experiments —
        inspired by a paper with no published authors&apos; code bundle.
      </p>
      <div className="border-l-4 border-[var(--std-warn)] bg-[#fff8ef] px-4 py-3 text-[var(--std-ink)]">
        <strong>Honesty:</strong> This is a method experiment inspired by paper
        2607.14601 — not a replacement for the authors&apos; tutoring platform.
        Authors&apos; code: none published with this paper. It is not a live
        tutoring course product.
      </div>
      <p className="text-[var(--std-muted)]">
        Display name stays <strong>Secure Tutor Desk</strong>. We never brand
        this desk with the paper project&apos;s short name (SYNAPSE).
      </p>
      <p className="text-sm text-[var(--std-muted)]">
        Tutor guide:{" "}
        <a
          className="tutor-guide-link text-[var(--std-teal)] underline-offset-2 hover:underline"
          href="/docs/guides/12-secure-tutor-desk-lessons.md"
        >
          Secure Tutor Desk lessons
        </a>
      </p>
      <p className="text-sm">
        <a
          className="text-[var(--std-teal)] underline-offset-2 hover:underline"
          href="https://arxiv.org/abs/2607.14601v1"
        >
          https://arxiv.org/abs/2607.14601v1
        </a>
      </p>
    </section>
  );
}
