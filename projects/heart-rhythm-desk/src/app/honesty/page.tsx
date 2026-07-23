export default function HonestyPage() {
  return (
    <section data-honesty="live" className="max-w-2xl space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
        Heart Rhythm Desk
      </h1>
      <p className="text-[var(--hrd-muted)]">
        A method-lab product for long-tail-aware rhythm scoring experiments —
        inspired by a paper with public code.
      </p>
      <div className="border-l-4 border-[var(--hrd-warn)] bg-[#fff8ef] px-4 py-3 text-[var(--hrd-ink)]">
        <strong>Honesty:</strong> This is a method experiment inspired by paper
        2607.14613 — not a replacement for the authors&apos; model at
        github.com/Open-EXG/AG-SCL-for-Long-Tailed-ECG. It is not a clinical ECG
        reader.
      </div>
      <p className="text-[var(--hrd-muted)]">
        Display name stays <strong>Heart Rhythm Desk</strong>. We never brand
        this desk with the paper project&apos;s short name.
      </p>
      <p className="text-sm text-[var(--hrd-muted)]">
        Tutor guide:{" "}
        <a
          className="tutor-guide-link text-[var(--hrd-teal)] underline-offset-2 hover:underline"
          href="/docs/guides/09-heart-rhythm-desk-lessons.md"
        >
          Heart Rhythm Desk lessons
        </a>
      </p>
      <p className="text-sm">
        <a
          className="text-[var(--hrd-teal)] underline-offset-2 hover:underline"
          href="https://arxiv.org/abs/2607.14613v1"
        >
          https://arxiv.org/abs/2607.14613v1
        </a>
      </p>
    </section>
  );
}
