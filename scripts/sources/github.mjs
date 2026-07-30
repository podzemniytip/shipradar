const QUERIES = [
  'is:issue is:open label:bounty',
  'is:issue is:open label:reward',
  'is:issue is:open "bounty" in:title'
];

const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "ShipRadar/1.0"
};

if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

function extractReward(text) {
  const candidates = [];
  const patterns = [
    /(?:\/bounty|bounty|reward|prize)\s*:?\s*(?:USD|USDC|EUR)?\s*\$?\s*([\d,.]+)\s*(k)?/gi,
    /\$\s*([\d,.]+)\s*(k)?\b/gi,
    /([\d,.]+)\s*(k)?\s*(?:USD|USDC|EUR)\b/gi
  ];

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      let value = Number(match[1].replaceAll(",", ""));
      if (match[2]) value *= 1000;
      if (value >= 25 && value <= 10_000_000) candidates.push(value);
    }
  }
  return candidates.length ? Math.max(...candidates) : 0;
}

function cleanText(value = "") {
  return value
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function repoName(repositoryUrl = "") {
  return repositoryUrl.split("/repos/")[1] || "GitHub";
}

function mapIssue(issue) {
  const labels = (issue.labels || []).map(label =>
    typeof label === "string" ? label : label.name
  ).filter(Boolean);
  const body = cleanText(issue.body || "");
  const reward = extractReward(issue.title) || extractReward(`${body}\n${labels.join(" ")}`);
  // A "bounty" label alone is noisy: many repositories use it for internal
  // domain concepts. Only publish GitHub issues with a verifiable amount.
  if (reward <= 0) return null;

  const repo = repoName(issue.repository_url);
  const ageHours = Math.max(1, Math.round((Date.now() - Date.parse(issue.created_at)) / 3_600_000));
  const competition = Math.max(0, (issue.comments || 0) + (issue.assignees || []).length * 4);
  const tags = labels.slice(0, 4);

  return {
    id: `github-${issue.id}`,
    externalId: String(issue.id),
    type: "bounty",
    status: "active",
    source: "GH",
    sourceName: "GitHub",
    sourceDetail: repo,
    title: issue.title,
    url: issue.html_url,
    reward,
    rewardNote: "USD · listed reward",
    competition,
    hours: reward >= 2000 ? [16, 40] : reward >= 500 ? [6, 18] : [2, 8],
    deadlineHours: null,
    deadlineLabel: "Open",
    tags: tags.length ? tags : ["Open Source"],
    funded: /funded|escrow|algora/i.test(`${body} ${labels.join(" ")}`),
    noKyc: true,
    security: /curl\s|wget\s|secret|private key|seed phrase/i.test(body) ? "warning" : "safe",
    verification: "Maintainer review",
    description: body.slice(0, 420) || `Open bounty in ${repo}.`,
    deliverables: ["Accepted pull request", "Maintainer approval", "Passing repository checks"],
    risk: "Confirm that the reward is still available before starting. Check for competing pull requests and recent maintainer activity.",
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
    freshnessHours: ageHours,
    agentAccess: "UNKNOWN"
  };
}

export async function fetchGitHubBounties() {
  const collected = [];
  const errors = [];

  for (const query of QUERIES) {
    const url = new URL("https://api.github.com/search/issues");
    url.searchParams.set("q", query);
    url.searchParams.set("sort", "updated");
    url.searchParams.set("order", "desc");
    url.searchParams.set("per_page", "50");

    try {
      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error(`GitHub ${response.status}`);
      const data = await response.json();
      collected.push(...(data.items || []));
    } catch (error) {
      errors.push(error.message);
    }
  }

  const unique = new Map();
  for (const issue of collected) {
    const mapped = mapIssue(issue);
    if (mapped) unique.set(mapped.id, mapped);
  }

  return { items: [...unique.values()], errors };
}
