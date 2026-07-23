export default function HonestyPage() {
  return (
    <section data-honesty="live" className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
        Honesty
      </h1>
      <p className="text-[var(--cbd-muted)] leading-relaxed">
        Consult Bench Desk is a method-lab experiment inspired by paper
        2607.09142 — not a replacement for the authors&apos; MedRealMM benchmark and
        not a telemedicine consult service. Never brand this desk as a
        telemedicine product.
      </p>
      <p className="text-[var(--cbd-muted)] leading-relaxed">
        Soft simulation of real-world multimodal consult evaluation plans
        versus text-only, image-blind scoring, and
        synthetic-chat-only benches baselines. Display name is Consult Bench Desk only.
      </p>
      <ul className="space-y-2 text-[var(--cbd-muted)]">
        <li>
          Paper:{" "}
          <a className="underline" href="https://arxiv.org/abs/2607.09142v1">
            https://arxiv.org/abs/2607.09142v1
          </a>
        </li>
        <li>Authors&apos; code: none published</li>
        <li>
          Lessons:{" "}
          <a
            className="tutor-guide-link underline text-[var(--cbd-steel)]"
            href="https://github.com/serhii-kucherenko/ai-method-lab/blob/main/docs/guides/32-consult-bench-desk-lessons.md"
          >
            docs/guides/32-consult-bench-desk-lessons.md
          </a>
        </li>
      </ul>
    </section>
  );
}
