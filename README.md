# Avik Solanki Portfolio

Personal portfolio for Avik Solanki, a Computer Engineering student at the University of Illinois Urbana-Champaign.

Live site: [aviksolanki.com](https://aviksolanki.com/)

Public repository: [github.com/avik-s/portfolio](https://github.com/avik-s/portfolio)

## Capstone feature

The PrizePicker project page includes a **Simulated Odds Analyzer**. Visitors choose a fictional NBA or NFL sample slate, slip style, and pick count. The browser then:

1. Converts fixed American odds into implied probabilities.
2. Removes the sportsbook margin (vig) by normalizing both sides.
3. Rejects lines more than 0.5 apart.
4. Filters by the project’s sample thresholds.
5. Generates ranked slips while enforcing unique players and at least two teams.

The simulator is deterministic and educational. It uses fictional players and fixed sample odds; it does not scrape live data, call an API, place wagers, or guarantee profit.

## Local setup

Requires Node.js 24 or newer and Python 3 for the local static preview command.

```bash
npm ci
npm run dev
```

Open `http://localhost:4173` in a browser.

## Quality commands

```bash
npm run check   # ESLint + HTML validation
npm test        # Vitest unit, UI, structure, and build tests
npm run build   # Copies the deployable static site into dist/
```

The build preserves all current routes, assets, and the `CNAME` custom-domain file.

## Architecture

- `assets/data/prizepicker-odds.js` contains the fictional, deterministic sample slate.
- `assets/js/prizepicker-core.js` contains the pure odds, vig-removal, filtering, and slip-ranking functions.
- `assets/js/prizepicker-simulator.js` adapts the core result to the accessible PrizePicker page UI.
- `tests/` covers probability math, line filtering, slip constraints, empty/error states, UI reset behavior, page structure, and the static build.

## CI/CD

Every pull request runs `npm ci`, quality checks, tests, and the static build through [`.github/workflows/quality-and-deploy.yml`](.github/workflows/quality-and-deploy.yml). The `main` branch runs the same verification before packaging and deploying `dist/` to GitHub Pages. The repository’s `main` branch is protected so a pull request cannot merge without the passing `Verify site` check.

See [`docs/capstone-evidence.md`](docs/capstone-evidence.md) for the failed-check, corrected passing run, deployment evidence, and presentation outline.

## Material AI use and limitations

AI assisted the implementation plan, code drafting, test-case ideation, accessibility review, and documentation. I reviewed the resulting code, ran the complete local suite, inspected the rendered interaction, and can explain the probability and CI/CD decisions. No credentials or private data were provided to the AI.

The demo deliberately has limitations: its slate is fictional and fixed, its ranking is deterministic, it does not reproduce live scraping or the original project’s Monte Carlo path, and its probabilities are diagnostic estimates rather than betting advice or financial guidance.
