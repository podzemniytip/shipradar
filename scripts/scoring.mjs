const AI_TERMS = [
  "ai", "agent", "llm", "machine learning", "rag", "mcp", "openai",
  "anthropic", "gemini", "python", "typescript", "javascript", "api",
  "automation", "data", "model", "prompt", "ocr", "computer vision"
];

const CLEAR_SCOPE_TERMS = [
  "acceptance criteria", "deliverable", "test", "expected", "reproduce",
  "requirements", "benchmark", "submission", "documentation", "example"
];

const RISK_TERMS = [
  "winner", "jury", "subjective", "may change", "not guaranteed",
  "no escrow", "invite only", "unpaid"
];

const clamp = value => Math.max(0, Math.min(100, Math.round(value)));

export function scoreOpportunity(item) {
  const text = [
    item.title,
    item.description,
    ...(item.tags || []),
    ...(item.deliverables || [])
  ].join(" ").toLowerCase();

  const aiMatches = AI_TERMS.filter(term => text.includes(term)).length;
  const scopeMatches = CLEAR_SCOPE_TERMS.filter(term => text.includes(term)).length;
  const riskMatches = RISK_TERMS.filter(term => text.includes(term)).length;

  const aiFit = clamp(42 + aiMatches * 8 + (item.type === "bounty" ? 8 : 0));
  const trustedPlatformBonus = ["Superteam", "Devpost", "Algora", "TaskBounty"].includes(item.sourceName) ? 8 : 0;
  const nonCashPenalty = item.monetaryReward === false ? 34 : 0;
  const payoutConfidence = clamp(
    (item.funded ? 82 : item.reward > 0 ? 58 : 32) +
    trustedPlatformBonus +
    (item.sourceName === "Algora" ? 12 : 0) -
    riskMatches * 8 -
    nonCashPenalty
  );
  const competitionScore = clamp(
    item.competition == null
      ? 55
      : 100 - Math.log10(Math.max(1, item.competition)) * 35
  );
  const clarity = clamp(
    45 + scopeMatches * 10 +
    ((item.description || "").length > 160 ? 12 : 0) +
    ((item.deliverables || []).length >= 2 ? 10 : 0)
  );
  const urgency = clamp(
    item.deadlineHours == null
      ? 55
      : item.deadlineHours <= 24
        ? 92
        : item.deadlineHours <= 168
          ? 78
          : item.deadlineHours <= 720
            ? 62
            : 42
  );

  const score = clamp(
    aiFit * 0.35 +
    payoutConfidence * 0.25 +
    competitionScore * 0.20 +
    clarity * 0.10 +
    urgency * 0.10
  );

  const requirements = item.agentRequirements || [];
  const agentEligible = ["AGENT_ALLOWED", "AGENT_ONLY"].includes(item.agentAccess);
  const agentReadiness = agentEligible
    ? clamp(
        100 -
        (requirements.some(value => /api key|account/i.test(value)) ? 10 : 0) -
        (requirements.some(value => /wallet/i.test(value)) ? 8 : 0) -
        (requirements.some(value => /stake/i.test(value)) ? 25 : 0) -
        (requirements.some(value => /human/i.test(value)) ? 20 : 0) -
        (item.monetaryReward === false ? 20 : 0)
      )
    : 0;

  return {
    ...item,
    aiFit,
    score,
    rating: score >= 85 ? "A+" : score >= 75 ? "A" : score >= 65 ? "B" : score >= 50 ? "C" : "D",
    agentReadiness,
    scoreBreakdown: {
      aiFit,
      payoutConfidence,
      competition: competitionScore,
      clarity,
      urgency
    }
  };
}
