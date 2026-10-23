import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fetchGitHubBounties } from '../scripts/sources/github.mjs';

describe('GitHub Reward Parser Regression Tests', () => {
  it('does not parse issue numbers or years following bounty/reward/prize as currency', async () => {
    // Mock global fetch to return controlled test payload
    const originalFetch = globalThis.fetch;
    try {
      globalThis.fetch = async () => ({
        ok: true,
        json: async () => ({
          items: [
            // Case 1: Frantic bounty #83 with worker price $9 (below min threshold $25)
            {
              id: 101,
              title: 'Frantic bounty #83',
              body: 'Worker price: $9',
              repository_url: 'https://api.github.com/repos/auscaster/frantic-board',
              html_url: 'https://github.com/auscaster/frantic-board/issues/198',
              created_at: '2026-09-01T00:00:00Z',
              updated_at: '2026-09-01T00:00:00Z',
              labels: [{ name: 'bounty' }]
            },
            // Case 2: Slash command syntax /bounty 100
            {
              id: 102,
              title: '/bounty 100',
              body: 'Fix bug in auth module',
              repository_url: 'https://api.github.com/repos/test/repo',
              html_url: 'https://github.com/test/repo/issues/102',
              created_at: '2026-09-01T00:00:00Z',
              updated_at: '2026-09-01T00:00:00Z',
              labels: [{ name: 'bounty' }]
            },
            // Case 3: Explicit currency prefix bounty: $50
            {
              id: 103,
              title: 'bounty: $50 for fixing CSS layout',
              body: 'Details here',
              repository_url: 'https://api.github.com/repos/test/repo',
              html_url: 'https://github.com/test/repo/issues/103',
              created_at: '2026-09-01T00:00:00Z',
              updated_at: '2026-09-01T00:00:00Z',
              labels: []
            },
            // Case 4: Explicit currency code suffix 50 USD
            {
              id: 104,
              title: 'Fix memory leak - bounty 50 USD',
              body: 'Memory leak in parser',
              repository_url: 'https://api.github.com/repos/test/repo',
              html_url: 'https://github.com/test/repo/issues/104',
              created_at: '2026-09-01T00:00:00Z',
              updated_at: '2026-09-01T00:00:00Z',
              labels: []
            },
            // Case 5: USDC currency suffix
            {
              id: 105,
              title: 'reward: 500 USDC',
              body: 'Solidity contract audit',
              repository_url: 'https://api.github.com/repos/test/repo',
              html_url: 'https://github.com/test/repo/issues/105',
              created_at: '2026-09-01T00:00:00Z',
              updated_at: '2026-09-01T00:00:00Z',
              labels: []
            },
            // Case 6: EUR currency suffix
            {
              id: 106,
              title: 'prize: 250 EUR',
              body: 'Design contest winner',
              repository_url: 'https://api.github.com/repos/test/repo',
              html_url: 'https://github.com/test/repo/issues/106',
              created_at: '2026-09-01T00:00:00Z',
              updated_at: '2026-09-01T00:00:00Z',
              labels: []
            },
            // Case 7: Thousands multiplier 2.5k USD
            {
              id: 107,
              title: 'bounty: 2.5k USD for major refactor',
              body: 'Large codebase refactor',
              repository_url: 'https://api.github.com/repos/test/repo',
              html_url: 'https://github.com/test/repo/issues/107',
              created_at: '2026-09-01T00:00:00Z',
              updated_at: '2026-09-01T00:00:00Z',
              labels: []
            },
            // Case 8: Plain number after bounty (issue number 2026) -> should be ignored
            {
              id: 108,
              title: 'bounty 2026 update discussion',
              body: 'Discussion for year 2026',
              repository_url: 'https://api.github.com/repos/test/repo',
              html_url: 'https://github.com/test/repo/issues/108',
              created_at: '2026-09-01T00:00:00Z',
              updated_at: '2026-09-01T00:00:00Z',
              labels: [{ name: 'bounty' }]
            },
            // Case 9: Plain number after reward (reward 42) -> should be ignored
            {
              id: 109,
              title: 'reward 42 points assigned',
              body: 'Points assignment',
              repository_url: 'https://api.github.com/repos/test/repo',
              html_url: 'https://github.com/test/repo/issues/109',
              created_at: '2026-09-01T00:00:00Z',
              updated_at: '2026-09-01T00:00:00Z',
              labels: []
            },
            // Case 10: Standalone dollar sign $1,000
            {
              id: 110,
              title: 'Security vulnerability fix $1,000',
              body: 'Critical security fix',
              repository_url: 'https://api.github.com/repos/test/repo',
              html_url: 'https://github.com/test/repo/issues/110',
              created_at: '2026-09-01T00:00:00Z',
              updated_at: '2026-09-01T00:00:00Z',
              labels: []
            },
            // Case 11: Issue number #198 -> should be ignored
            {
              id: 111,
              title: 'bounty #198 discussion',
              body: 'Related to issue #198',
              repository_url: 'https://api.github.com/repos/test/repo',
              html_url: 'https://github.com/test/repo/issues/111',
              created_at: '2026-09-01T00:00:00Z',
              updated_at: '2026-09-01T00:00:00Z',
              labels: []
            },
            // Case 12: Deduplication across search query results
            {
              id: 102,
              title: '/bounty 100',
              body: 'Fix bug in auth module',
              repository_url: 'https://api.github.com/repos/test/repo',
              html_url: 'https://github.com/test/repo/issues/102',
              created_at: '2026-09-01T00:00:00Z',
              updated_at: '2026-09-01T00:00:00Z',
              labels: [{ name: 'bounty' }]
            }
          ]
        })
      });

      const { items } = await fetchGitHubBounties();

      // Verify items returned
      const rewardsById = new Map(items.map(item => [item.externalId, item.reward]));

      // Case 1: Frantic bounty #83 should not be included (reward <= 0)
      assert.strictEqual(rewardsById.has('101'), false);

      // Case 2: /bounty 100 -> 100
      assert.strictEqual(rewardsById.get('102'), 100);

      // Case 3: bounty: $50 -> 50
      assert.strictEqual(rewardsById.get('103'), 50);

      // Case 4: bounty 50 USD -> 50
      assert.strictEqual(rewardsById.get('104'), 50);

      // Case 5: reward: 500 USDC -> 500
      assert.strictEqual(rewardsById.get('105'), 500);

      // Case 6: prize: 250 EUR -> 250
      assert.strictEqual(rewardsById.get('106'), 250);

      // Case 7: 2.5k USD -> 2500
      assert.strictEqual(rewardsById.get('107'), 2500);

      // Case 8: bounty 2026 -> not included
      assert.strictEqual(rewardsById.has('108'), false);

      // Case 9: reward 42 -> not included
      assert.strictEqual(rewardsById.has('109'), false);

      // Case 10: $1,000 -> 1000
      assert.strictEqual(rewardsById.get('110'), 1000);

      // Case 11: bounty #198 -> not included
      assert.strictEqual(rewardsById.has('111'), false);

      // Case 12: Deduplication: items length should be exact number of valid unique issues (6 valid unique issues: 102, 103, 104, 105, 106, 107, 110)
      assert.strictEqual(items.length, 7);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
