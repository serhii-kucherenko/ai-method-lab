# Atlas Flow Studio

Soft-sim studio for neuroimaging / histology analytics eng leads: version atlas packs, configure registrations and region quantifications, then compare an **integrated atlas registration + quantification workflow** against a **fragmented multi-tool baseline** before locking a pack.

## Honesty

Soft-sim only. Not live microscope control. Not clinical diagnostic use. Not FDA cleared. Not NeuroFlow. Not the authors’ system.

Paper: https://www.biorxiv.org/content/10.64898/2026.07.15.737186v1 · authors’ code: none published

## Run

```bash
cd projects/atlas-flow-studio
npm install
npm run dev
```

Dev bearer token: `atlas-flow-dev-token`

## Tests

```bash
npm test
npm run build
npm run test:app-up
```

Offline demo: open `try.html` in a browser.

## Domain IA

`/`, `/pricing`, `/demo`, `/onboarding`, `/flows`, `/atlases`, `/registrations`, `/quantifications`, `/runs`, `/compare`, `/scoreboard`, `/settings`, `/honesty`
