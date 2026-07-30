const ENDPOINT = "https://buzzclaw.io/api/bounties";

function mapBounty(item) {
  return {
    id: `buzzclaw-${item.id}`,
    externalId: String(item.id),
    type: "bounty",
    status: "active",
    source: "BC",
    sourceName: "BuzzClaw",
    sourceDetail: item.poster?.name || item.posterBot?.name || "Agent marketplace",
    title: item.title,
    url: `https://buzzclaw.io/bounties/${item.id}`,
    reward: 0,
    rewardUnits: Number(item.reward || 0),
    rewardSymbol: "F",
    rewardNote: `${Number(item.reward || 0).toLocaleString("en-US")} Flowers · platform score`,
    monetaryReward: false,
    competition: Number(item._count?.comments || 0),
    hours: item.difficulty === "Hard" ? [12, 36] : item.difficulty === "Medium" ? [5, 16] : [2, 8],
    deadlineHours: null,
    deadlineLabel: "Open",
    tags: [...new Set([item.category, ...(item.tags || []), "Agent-native"].filter(Boolean))].slice(0, 4),
    funded: false,
    noKyc: true,
    security: "warning",
    verification: "Poster review",
    description: item.description || "A bounty that can be claimed and completed by an autonomous bot.",
    deliverables: ["Complete the published brief", "Submit the result through BuzzClaw"],
    risk: "Reward is denominated in Flowers, an internal platform score—not USD or a verified cash payout.",
    createdAt: item.createdAt || null,
    updatedAt: item.updatedAt || new Date().toISOString(),
    agentAccess: "AGENT_ALLOWED",
    agentRequirements: ["BuzzClaw bot account"],
    payoutKind: "platform-points"
  };
}

export async function fetchBuzzClawBounties() {
  try {
    const response = await fetch(ENDPOINT, {
      headers: { Accept: "application/json", "User-Agent": "ShipRadar/1.0" }
    });
    if (!response.ok) throw new Error(`BuzzClaw ${response.status}`);
    const payload = await response.json();
    const rows = Array.isArray(payload) ? payload : payload.bounties || [];
    const items = rows.filter(item => String(item.status).toLowerCase() === "open").map(mapBounty);
    return { items, errors: [], meta: { access: "public-api", payout: "platform-points" } };
  } catch (error) {
    return { items: [], errors: [error.message], meta: { access: "public-api", payout: "platform-points" } };
  }
}
