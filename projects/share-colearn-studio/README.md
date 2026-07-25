# Share Colearn Studio

Soft-sim studio for rheumatology / EHR analytics eng leads comparing **human–AI co-learning disease activity labeling** against an **AI-only labeling baseline** before locking a colearn pack.

## Honesty

Soft-sim only — never claim clinical diagnostic use, live EHR write-back, or FDA clearance. Not an authors' rebrand.

Paper: https://www.medrxiv.org/content/10.64898/2026.07.16.26358271v1 · authors' code: none published

## Run

```bash
cd projects/share-colearn-studio
npm install
npm run dev
```

Open http://localhost:3000

Bearer token for APIs: `share-colearn-dev-token`

## Tests

```bash
npm test
npm run build
npm run test:app-up
```

## Offline demo

Open `try.html` in a browser for an offline A/B soft-sim.

## Pages

`/`, `/pricing`, `/demo`, `/onboarding`, `/flows`, `/colearns`, `/labels`, `/reviewers`, `/runs`, `/compare`, `/scoreboard`, `/settings`, `/honesty`

## Dual scorers

- A: `human_ai_colearning_labeling`
- B: `ai_only_labeling_baseline`
