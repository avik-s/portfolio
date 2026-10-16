# Capstone evidence

This page records the public GitHub evidence for the PrizePicker capstone implementation. The repository and live portfolio are public:

- Repository: <https://github.com/avik-s/portfolio>
- Live site: <https://aviksolanki.com/>
- Feature route: <https://aviksolanki.com/prizepicker/>

## Required CI/CD evidence

| Requirement | Evidence |
| --- | --- |
| Pull request with an intentionally failing check | [PR #1](https://github.com/avik-s/portfolio/pull/1) and its [failed Verify site run](https://github.com/avik-s/portfolio/actions/runs/38841403869) at commit `4795e56` |
| Corrected pull request check | [Final passing Verify site run](https://github.com/avik-s/portfolio/actions/runs/38841935464) at commit `3029917` |
| First successful protected-main deployment | [Quality and deploy run on main](https://github.com/avik-s/portfolio/actions/runs/38841975645), including the `Verify site` job and `Deploy site` job |
| Pages configuration | Pages reports workflow deployment, `aviksolanki.com`, HTTPS enforced, and built status. The workflow is defined in [`quality-and-deploy.yml`](../.github/workflows/quality-and-deploy.yml). |
| Branch protection | `main` requires a pull request, strict/up-to-date `Verify site`, administrator enforcement, and disallows force pushes and deletion. |

The first failed run was deliberate: the feature test expected a misspelled sample-player label instead of the dataset's canonical label. The follow-up commits corrected the assertion, hardened structured analyzer errors, and fixed the tablet form layout before the final passing run.

## Manual verification

- Default NBA / Power / 2-pick state renders two deterministic sample slips.
- NFL / Flex / 6-pick state renders the designed no-valid-slip empty state.
- Reset returns the form to NBA / Power / 2 picks and announces readiness through the live status region.
- The 900px tablet check keeps the controls and actions inside the simulator card; narrow screens stack the controls.
- The feature labels all odds and props as simulated sample data, identifies public artist names as fictional labels, and includes the educational no-wagering disclaimer.

## Three-minute presentation outline

1. **0:00–0:30 — Portfolio context.** Introduce the existing editorial portfolio and open the PrizePicker project page, calling out the new interactive-demo badge.
2. **0:30–1:20 — Normal demo.** Run the default NBA Power two-pick analyzer. Point out the direction, line, simulated American odds, no-vig probability, average probability, threshold, and edge.
3. **1:20–1:50 — Empty state.** Switch to NFL, Flex, six picks and show the designed no-valid-slip state. Reset to show the accessible reset behavior.
4. **1:50–2:20 — One calculation and one test.** Explain that American odds become implied probabilities, the two sides are normalized to remove vig, and a line difference over 0.5 is rejected. Show the unit test for the exact default slip and the edge/constraint tests.
5. **2:20–2:45 — CI and deployment.** Open the failed run, the corrected passing run, and the successful main deployment from the evidence table. Mention protected `main` and the single workflow.
6. **2:45–3:00 — Reflection.** Close with the lesson that deterministic fictional data makes the feature explainable and testable, and the next step would be a separately reviewed live-data adapter—not a hidden live scraper in the portfolio demo.

## Limitations and AI-use disclosure

The analyzer is intentionally deterministic and educational. It does not reproduce the original project’s live scraping or Monte Carlo path, call an odds API, provide betting advice, or claim guaranteed profit. Public artist names are used only as fictional labels. Material AI assistance was used to plan the feature, scaffold the modular JavaScript/CSS/tests, inspect accessibility and responsive behavior, and draft documentation. I reviewed the calculations, test expectations, UI states, and deployment evidence and remain responsible for the submitted work.
