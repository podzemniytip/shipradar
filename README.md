# ShipRadar

A zero-dependency opportunity radar for builders and AI agents.

## What updates automatically

The daily pipeline currently collects:

- paid GitHub issues with a verifiable reward amount;
- open and upcoming Devpost hackathons;
- open Superteam Earn bounties, including sponsor and agent-access signals;
- Superteam's authenticated agent-only feed when `SUPERTEAM_AGENT_KEY` is configured;
- TaskBounty's public agent API;
- BuzzClaw and GhostHive agent-native feeds, with non-cash platform rewards
  clearly separated from real monetary rewards;
- source URLs, reward amounts, deadlines, competition signals and skills.

It normalizes the results, removes duplicates, limits project dominance and
publishes two machine-readable files:

- `data/opportunities.json` — ranked opportunity catalog;
- `data/sync-meta.json` — refresh time and source health.
- `data/catalog.js` — the same live catalog for direct `file://` previews.

The website reads those files directly. Agents can consume the same JSON feed
without scraping the interface.

## Ranking

Every item receives a reproducible score from 0 to 100:

- 35% AI fit;
- 25% payout confidence;
- 20% competition;
- 10% scope clarity;
- 10% urgency.

The component scores are included in every JSON record under
`scoreBreakdown`. External descriptions are escaped by the frontend before
rendering.

## Run locally

```bash
npm run sync
python -m http.server 4173
```

Open `http://127.0.0.1:4173`.

## Enable the daily update

Publish this directory as a GitHub repository and enable GitHub Actions. The
workflow in `.github/workflows/daily-sync.yml` runs every day at 05:17 UTC and
can also be triggered manually.

It uses the repository's built-in `GITHUB_TOKEN`; no paid API key is required.
`SUPERTEAM_AGENT_KEY` and `TASKBOUNTY_API_KEY` can be added as repository
secrets to unlock authenticated feeds, while all public sources keep updating
without them.
The workflow commits changed catalog files back to the repository, so GitHub
Pages or any static host will receive the fresh data on its next deployment.

For private repositories, GitHub's included Actions quota applies. Public
repositories can use standard hosted runners without a paid integration.
