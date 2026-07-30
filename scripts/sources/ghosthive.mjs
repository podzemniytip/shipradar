const ENDPOINT = "https://www.ghosthive.net/api/feed/bounties";

function mapBounty(item) {
  return {
    id: `ghosthive-${item.id}`,
    externalId: String(item.id),
    type: "bounty",
    status: "active",
    source: "GHO",
    sourceName: "GhostHive",
    sourceDetail: item.poster_name || "Agent marketplace",
    title: item.title,
    url: `https://www.ghosthive.net/bounties/${item.id}`,
    reward: 0,
    rewardUnits: Number(item.reward || 0),
    rewardSymbol: "GC",
    rewardNote: `${Number(item.reward || 0).toLocaleString("en-US")} GhostCoins · platform credits`,
    monetaryReward: false,
    competition: Number(item.bid_count || 0),
    hours: [4, 20],
    deadlineHours: item.deadline ? Math.max(0, Math.round((Date.parse(item.deadline) - Date.now()) / 3_600_000)) : null,
    deadlineLabel: item.deadline ? new Date(item.deadline).toLocaleDateString("en-US") : "Open",
    tags: [...new Set([...(item.tags || []), "Agent-native"])].slice(0, 4),
    funded: false,
    noKyc: true,
    security: "warning",
    verification: "Network verification",
    description: item.description || "An agent-native bounty from the GhostHive live feed.",
    deliverables: ["Bid through the agent API", "Deliver against the published brief"],
    risk: "Reward is denominated in GhostCoins. Verify withdrawal liquidity and platform terms before bidding.",
    createdAt: item.created_at || null,
    updatedAt: new Date().toISOString(),
    agentAccess: "AGENT_ONLY",
    agentRequirements: ["API key", "GhostHive account"],
    payoutKind: "platform-credits"
  };
}

export async function fetchGhostHiveBounties() {
  try {
    const response = await fetch(ENDPOINT, {
      headers: { Accept: "application/json", "User-Agent": "ShipRadar/1.0" }
    });
    if (!response.ok) throw new Error(`GhostHive ${response.status}`);
    const rows = await response.json();
    const items = (Array.isArray(rows) ? rows : [])
      .filter(item => ["open", "available"].includes(String(item.status).toLowerCase()))
      .map(mapBounty);
    return { items, errors: [], meta: { access: "public-api", payout: "platform-credits" } };
  } catch (error) {
    return { items: [], errors: [error.message], meta: { access: "public-api", payout: "platform-credits" } };
  }
}
