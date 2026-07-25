# Phe Escalate Studio

Soft-sim studio for public-health emergency / surveillance ops leads comparing **AI-assisted outbreak classification and escalation** against a **manual triage baseline** before locking an escalate pack.

## Honesty

Soft-sim only — never claim operational MoH authority, live write-back, or clinical diagnosis. Not an authors' rebrand.

Paper: https://www.medrxiv.org/content/10.64898/2026.07.07.26357475v1 · authors' code: none published

## Run

```bash
cd projects/phe-escalate-studio
npm install
npm run dev
```

Open http://localhost:3000

## Tests

```bash
npm test
npm run build
npm run test:app-up
```

## Offline demo

Open `try.html` in a browser for an offline A/B soft-sim.

## Pages

`/`, `/pricing`, `/demo`, `/onboarding`, `/flows`, `/escalates`, `/classifications`, `/thresholds`, `/runs`, `/compare`, `/scoreboard`, `/settings`, `/honesty`

## Dual scorers

- A: `ai_assisted_phe_escalation`
- B: `manual_triage_baseline`
