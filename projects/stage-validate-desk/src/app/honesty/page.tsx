export default function HonestyPage() {
  return (
    <section data-honesty="live" className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
        Honesty
      </h1>
      <p className="text-[var(--svd-muted)] leading-relaxed">
        Stage Validate Desk is a method-lab experiment inspired by paper
        2607.14568 — not a replacement for the authors&apos; Fermi CUDA engine or
        commercial inference stacks.
      </p>
      <p className="text-[var(--svd-muted)] leading-relaxed">
        Soft simulation of stage gates and measurement deltas only. Never brand
        MiniCPM, Fermi, or Tesla C2075 as the product name — those labels may
        appear only in Sources / honesty copy.
      </p>
      <ul className="space-y-2 text-[var(--svd-muted)]">
        <li>
          Paper:{" "}
          <a className="underline" href="https://arxiv.org/abs/2607.14568v1">
            https://arxiv.org/abs/2607.14568v1
          </a>
        </li>
        <li>Authors&apos; code: none published</li>
        <li>
          Lessons:{" "}
          <a
            className="tutor-guide-link underline text-[var(--svd-steel)]"
            href="https://github.com/serhii-kucherenko/ai-method-lab/blob/main/docs/guides/24-stage-validate-desk-lessons.md"
          >
            docs/guides/24-stage-validate-desk-lessons.md
          </a>
        </li>
      </ul>
    </section>
  );
}
