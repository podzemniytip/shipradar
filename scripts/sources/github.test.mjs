import test from "node:test";
import assert from "node:assert/strict";

import { fetchGitHubBounties } from "./github.mjs";

function issue(overrides = {}) {
  return {
    id: 1,
    title: "Bounty",
    body: "",
    labels: [],
    comments: 0,
    assignees: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    html_url: "https://github.com/example/repo/issues/1",
    repository_url: "https://api.github.com/repos/example/repo",
    ...overrides
  };
}

// Runs the public fetchGitHubBounties() with a stubbed GitHub search API so the
// regression suite stays offline. byQuery is either a list of items returned for
// every query, or a function (query) => items.
async function runWithIssues(byQuery) {
  const originalFetch = global.fetch;
  global.fetch = async url => {
    const query = url.searchParams.get("q");
    const items = typeof byQuery === "function" ? byQuery(query) : byQuery;
    return { ok: true, json: async () => ({ items }) };
  };
  try {
    return await fetchGitHubBounties();
  } finally {
    global.fetch = originalFetch;
  }
}

const reward = items => items.map(item => item.reward);

test("treats currency-less bounty IDs as non-money (real #83 regression)", async () => {
  const { items } = await runWithIssues([
    issue({
      title: "Frantic bounty #83",
      body: "Frantic bounty #83\n\nWorker price: $9"
    })
  ]);
  assert.equal(items.length, 0);
});

test("rejects bare keyword amounts: ID, count and year", async () => {
  for (const body of [
    "bounty 83",
    "reward 2024",
    "prize count 12",
    "bounty 40",
    "reward 25"
  ]) {
    const { items } = await runWithIssues([issue({ title: "Task", body })]);
    assert.equal(items.length, 0, `expected no reward for: ${body}`);
  }
});

test("keeps the /bounty 100 command syntax working", async () => {
  const { items } = await runWithIssues([issue({ title: "/bounty 250" })]);
  assert.deepEqual(reward(items), [250]);
});

test("keeps valid currency formats: keyword + currency marker", async () => {
  const cases = [
    ["Fix bug", "Reward: $500"],
    ["Task", "bounty 100 USD"],
    ["Task", "Prize: USD 300"],
    ["Task", "reward $1.5k"],
    ["Task", "Bounty EUR 1200"]
  ];
  const { items } = await runWithIssues(
    cases.map(([title, body], index) =>
      issue({ id: index + 100, title, body })
    )
  );
  assert.deepEqual(reward(items).sort((a, b) => a - b), [100, 300, 500, 1200, 1500]);
});

test("deduplicates the same issue across queries", async () => {
  const shared = issue({ id: 7, title: "Bounty", body: "reward $400" });
  const other = issue({ id: 8, title: "Bounty", body: "reward $600" });
  const { items } = await runWithIssues(query => {
    if (query === 'is:issue is:open label:bounty') return [shared];
    if (query === 'is:issue is:open label:reward') return [shared, other];
    return [];
  });
  assert.equal(items.length, 2);
  assert.deepEqual(reward(items).sort((a, b) => a - b), [400, 600]);
});
