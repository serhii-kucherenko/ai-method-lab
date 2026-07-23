export default function HonestyPage() {
  return (
    <section data-honesty="live" className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
        Honesty
      </h1>
      <p className="text-[var(--wld-muted)] leading-relaxed">
        Wild Locomotion Desk is a method-lab experiment inspired by paper
        2607.13579 — not a replacement for the authors&apos; quadruped
        controller or commercial robot stacks.
      </p>
      <p className="text-[var(--wld-muted)] leading-relaxed">
        Soft simulation of multi-skill locomotion and risk deltas only. Never
        brand APT-RL as the product name — that label may appear only in Sources
        / honesty copy.
      </p>
      <ul className="space-y-2 text-[var(--wld-muted)]">
        <li>
          Paper:{" "}
          <a className="underline" href="https://arxiv.org/abs/2607.13579v1">
            https://arxiv.org/abs/2607.13579v1
          </a>
        </li>
        <li>Authors&apos; code: none published</li>
        <li>
          Lessons:{" "}
          <a
            className="tutor-guide-link underline text-[var(--wld-steel)]"
            href="https://github.com/serhii-kucherenko/ai-method-lab/blob/main/docs/guides/25-wild-locomotion-desk-lessons.md"
          >
            docs/guides/25-wild-locomotion-desk-lessons.md
          </a>
        </li>
      </ul>
    </section>
  );
}
