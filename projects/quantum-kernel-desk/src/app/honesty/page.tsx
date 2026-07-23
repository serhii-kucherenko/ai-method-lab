export default function HonestyPage() {
  return (
    <section data-honesty="live" className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
        Honesty
      </h1>
      <p className="text-[var(--qkd-muted)] leading-relaxed">
        Quantum Kernel Desk is a method-lab experiment inspired by paper
        2607.11701 — not a replacement for the authors&apos; Q²SAR pipeline
        or commercial QSAR and quantum chemistry tools.
      </p>
      <p className="text-[var(--qkd-muted)] leading-relaxed">
        Soft simulation of quantum multiple-kernel SAR plans and risk deltas
        only. Never brand Q²SAR as the product name — that label may appear
        only in Sources / honesty copy.
      </p>
      <ul className="space-y-2 text-[var(--qkd-muted)]">
        <li>
          Paper:{" "}
          <a className="underline" href="https://arxiv.org/abs/2607.11701v1">
            https://arxiv.org/abs/2607.11701v1
          </a>
        </li>
        <li>Authors&apos; code: none published</li>
        <li>
          Lessons:{" "}
          <a
            className="tutor-guide-link underline text-[var(--qkd-steel)]"
            href="https://github.com/serhii-kucherenko/ai-method-lab/blob/main/docs/guides/28-quantum-kernel-desk-lessons.md"
          >
            docs/guides/28-quantum-kernel-desk-lessons.md
          </a>
        </li>
      </ul>
    </section>
  );
}
