export default function HonestyPage() {
  return (
    <section data-honesty="live" className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
        Honesty
      </h1>
      <p className="text-[var(--mrd-muted)] leading-relaxed">
        Memory Risk Desk is a method-lab experiment inspired by paper
        2607.11656 — not a replacement for the authors&apos; transformer and not a
        clinical diagnostic product. Never brand this desk as a medical device.
      </p>
      <p className="text-[var(--mrd-muted)] leading-relaxed">
        Soft simulation of imputation-free calibrated risk plans versus
        mean/mode imputation, uncalibrated high-confidence scores, and
        single-cohort-only baselines. Display name is Memory Risk Desk only.
      </p>
      <ul className="space-y-2 text-[var(--mrd-muted)]">
        <li>
          Paper:{" "}
          <a className="underline" href="https://arxiv.org/abs/2607.11656v2">
            https://arxiv.org/abs/2607.11656v2
          </a>
        </li>
        <li>Authors&apos; code: none published</li>
        <li>
          Lessons:{" "}
          <a
            className="tutor-guide-link underline text-[var(--mrd-steel)]"
            href="https://github.com/serhii-kucherenko/ai-method-lab/blob/main/docs/guides/29-memory-risk-desk-lessons.md"
          >
            docs/guides/29-memory-risk-desk-lessons.md
          </a>
        </li>
      </ul>
    </section>
  );
}
