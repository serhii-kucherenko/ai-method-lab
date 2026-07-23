export default function HonestyPage() {
  return (
    <section data-honesty="live" className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
        Honesty
      </h1>
      <p className="text-[var(--scd-muted)] leading-relaxed">
        Prompt Cache Desk is a method-lab experiment inspired by paper
        2607.15516 — not a replacement for the authors&apos; system and not a
        commercial LLM API gateway.
      </p>
      <p className="text-[var(--scd-muted)] leading-relaxed">
        Do not treat desk scores as measured production savings or published
        API quality gains. Never brand this desk as CAPC, Sonnet, or PayPal.
      </p>
      <ul className="space-y-2 text-[var(--scd-muted)]">
        <li>
          Paper:{" "}
          <a className="underline" href="https://arxiv.org/abs/2607.15516v1">
            https://arxiv.org/abs/2607.15516v1
          </a>
        </li>
        <li>Authors&apos; code: none published</li>
        <li>
          Lessons:{" "}
          <a
            className="tutor-guide-link underline text-[var(--scd-steel)]"
            href="https://github.com/serhii-kucherenko/ai-method-lab/blob/main/docs/guides/20-prompt-cache-desk-lessons.md"
          >
            docs/guides/20-prompt-cache-desk-lessons.md
          </a>
        </li>
      </ul>
    </section>
  );
}
