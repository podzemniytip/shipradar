const ENDPOINT = "https://superteam.fun/api/listings?context=all&tab=bounties&category=All&status=open&sortBy=Date&order=asc&region=&sponsor=";
const AGENT_ENDPOINT = "https://superteam.fun/api/agents/listings/live?take=100&deadline=2027-12-31";

function hoursUntil(value) {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return null;
  return Math.max(0, Math.round((timestamp - Date.now()) / 3_600_000));
}

function deadlineLabel(hours) {
  if (hours == null) return "Open";
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  const rest = hours % 24;
  return rest ? `${days}d ${rest}h` : `${days} days`;
}

function inferTags(item) {
  const text = item.title.toLowerCase();
  const tags = [];
  if (/develop|build|code|plugin|sdk|api|engineer/.test(text)) tags.push("Development");
  if (/write|thread|tweet|linkedin|content|video/.test(text)) tags.push("Content");
  if (/design|brand|logo|ui|ux/.test(text)) tags.push("Design");
  if (/ai|agent|llm|model/.test(text)) tags.push("AI");
  if (!tags.length) tags.push("Web3");
  tags.push(item.token || "Crypto");
  return [...new Set(tags)].slice(0, 4);
}

function mapListing(item) {
  const remaining = hoursUntil(item.deadline);
  const submissions = Number(item._count?.Submission || 0);
  const sponsor = item.sponsor?.name || "Superteam sponsor";
  const verified = Boolean(item.sponsor?.isVerified);
  const access = item.agentAccess === "AGENT_ALLOWED"
    ? "AGENT_ALLOWED"
    : item.agentAccess === "AGENT_ONLY"
      ? "AGENT_ONLY"
    : item.agentAccess === "HUMAN_ONLY"
      ? "HUMAN_ONLY"
      : "UNKNOWN";

  return {
    id: `superteam-${item.id}`,
    externalId: item.id,
    type: item.type || "bounty",
    status: "active",
    source: "ST",
    sourceName: "Superteam",
    sourceDetail: sponsor,
    title: item.title,
    url: `https://superteam.fun/earn/listing/${item.slug}`,
    reward: Number(item.rewardAmount || item.maxRewardAsk || 0),
    rewardNote: `${item.token || "USDC"} · ${item.compensationType || "bounty"}`,
    competition: submissions,
    hours: Number(item.rewardAmount) >= 3000 ? [16, 50] : Number(item.rewardAmount) >= 750 ? [8, 24] : [3, 12],
    deadlineHours: remaining,
    deadlineLabel: deadlineLabel(remaining),
    tags: inferTags(item),
    funded: verified,
    noKyc: false,
    security: "safe",
    verification: verified ? "Verified Superteam sponsor" : "Platform listing",
    description: `${sponsor} is offering ${item.rewardAmount || "a fixed reward"} ${item.token || ""} for “${item.title}”.`,
    deliverables: ["Follow the original brief", "Submit through Superteam Earn", "Meet the published deadline"],
    risk: access === "HUMAN_ONLY"
      ? "Human participation only. This is a competitive bounty: completing the work does not guarantee a payout."
      : "Competitive bounty. Check submission rules and whether autonomous-agent participation is permitted.",
    createdAt: null,
    updatedAt: new Date().toISOString(),
    agentAccess: access,
    sponsorVerified: verified,
    featured: Boolean(item.isFeatured)
  };
}

export async function fetchSuperteamBounties() {
  try {
    const response = await fetch(ENDPOINT, {
      headers: { Accept: "application/json", "User-Agent": "ShipRadar/1.0" }
    });
    if (!response.ok) throw new Error(`Superteam ${response.status}`);
    const data = await response.json();
    const items = (Array.isArray(data) ? data : [])
      .filter(item => item.status === "OPEN" && Number(item.rewardAmount || item.maxRewardAsk || 0) > 0)
      .map(mapListing);
    return { items, errors: [] };
  } catch (error) {
    return { items: [], errors: [error.message] };
  }
}

export async function fetchSuperteamAgentBounties() {
  if (!process.env.SUPERTEAM_AGENT_KEY) {
    return {
      items: [],
      errors: [],
      meta: { access: "api-key-required", configured: false, payout: "real" }
    };
  }

  try {
    const response = await fetch(AGENT_ENDPOINT, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.SUPERTEAM_AGENT_KEY}`,
        "User-Agent": "ShipRadar/1.0"
      }
    });
    if (!response.ok) throw new Error(`Superteam Agents ${response.status}`);
    const payload = await response.json();
    const rows = Array.isArray(payload) ? payload : payload.data || payload.listings || [];
    const items = rows
      .map(mapListing)
      .filter(item => ["AGENT_ALLOWED", "AGENT_ONLY"].includes(item.agentAccess));
    return {
      items,
      errors: [],
      meta: { access: "authenticated-api", configured: true, payout: "real" }
    };
  } catch (error) {
    return {
      items: [],
      errors: [error.message],
      meta: { access: "authenticated-api", configured: true, payout: "real" }
    };
  }
}
