const ENDPOINT = "https://www.task-bounty.com/api/v1/tasks?status=open&limit=100";

function pickNumber(...values) {
  for (const value of values) {
    const number = Number(value);
    if (Number.isFinite(number) && number >= 0) return number;
  }
  return 0;
}

function mapTask(item) {
  const id = item.id || item.taskId || item.slug;
  const reward = pickNumber(item.reward, item.rewardAmount, item.amount, item.bounty);
  const currency = item.currency || item.token || "USDC";
  const tags = Array.isArray(item.tags) ? item.tags : [];

  return {
    id: `taskbounty-${id}`,
    externalId: String(id),
    type: "bounty",
    status: "active",
    source: "TB",
    sourceName: "TaskBounty",
    sourceDetail: item.repository || item.organization || "Agent API",
    title: item.title || item.name || "TaskBounty task",
    url: item.url || item.htmlUrl || `https://www.task-bounty.com/tasks/${id}`,
    reward,
    rewardNote: `${currency} · agent payout`,
    competition: pickNumber(item.claimCount, item.claims, item.applicants),
    hours: [2, 16],
    deadlineHours: null,
    deadlineLabel: item.deadline ? new Date(item.deadline).toLocaleDateString("en-US") : "Open",
    tags: [...new Set(["Agent API", ...tags])].slice(0, 4),
    funded: Boolean(item.funded ?? item.escrowed ?? reward > 0),
    noKyc: Boolean(item.noKyc ?? true),
    security: "safe",
    verification: item.verification || "Maintainer review",
    description: item.description || item.summary || "An API-discoverable task open to autonomous AI agents.",
    deliverables: item.deliverables || ["Complete the published task", "Submit proof through the TaskBounty API"],
    risk: "Confirm the live status, repository permissions and payout terms before an agent claims the task.",
    createdAt: item.createdAt || item.created_at || null,
    updatedAt: item.updatedAt || item.updated_at || new Date().toISOString(),
    agentAccess: "AGENT_ALLOWED",
    agentRequirements: ["API key", "Payout wallet"],
    payoutKind: "real"
  };
}

export async function fetchTaskBountyTasks() {
  try {
    const headers = { Accept: "application/json", "User-Agent": "ShipRadar/1.0" };
    if (process.env.TASKBOUNTY_API_KEY) headers.Authorization = `Bearer ${process.env.TASKBOUNTY_API_KEY}`;
    const response = await fetch(ENDPOINT, { headers });
    if (!response.ok) throw new Error(`TaskBounty ${response.status}`);
    const payload = await response.json();
    const rows = Array.isArray(payload) ? payload : payload.data || payload.tasks || [];
    const items = rows
      .filter(item => !item.status || ["open", "active", "available"].includes(String(item.status).toLowerCase()))
      .map(mapTask)
      .filter(item => item.externalId !== "undefined");
    return { items, errors: [], meta: { access: "public-api", payout: "real" } };
  } catch (error) {
    return { items: [], errors: [error.message], meta: { access: "public-api", payout: "real" } };
  }
}
