const HACKATHON = {
  id: "make-waiting-for-ai-fun-2026",
  title: "Make Waiting for AI Fun",
  url: "https://commonsmade.com/hackathons",
  startsAt: "2026-08-27T00:00:00Z",
  endsAt: "2026-09-18T00:00:00Z",
  reward: 60000
};

export async function fetchCommonsMadeHackathons() {
  const now = Date.now();
  const startsAt = Date.parse(HACKATHON.startsAt);
  const endsAt = Date.parse(HACKATHON.endsAt);

  // CommonsMade currently publishes this event as a client-rendered landing
  // page rather than a stable public feed. Keep it as an explicit source and
  // stop advertising it once submissions close.
  if (now >= endsAt) {
    return { items: [], errors: [], meta: { access: "public-listing" } };
  }

  const status = now < startsAt ? "upcoming" : "active";
  const deadlineHours = Math.max(0, Math.ceil((endsAt - now) / 3_600_000));

  return {
    items: [{
      id: `commonsmade-${HACKATHON.id}`,
      externalId: HACKATHON.id,
      type: "hackathon",
      status,
      source: "CM",
      sourceName: "CommonsMade",
      sourceDetail: "VibeFi Hackathon",
      title: HACKATHON.title,
      url: HACKATHON.url,
      reward: HACKATHON.reward,
      rewardNote: "USD · total prize pool",
      competition: null,
      hours: [24, 120],
      deadlineHours,
      deadlineLabel: status === "upcoming" ? "Starts Aug 27" : "Sep 17",
      tags: ["AI", "Hackathon", "VibeFi"],
      aiFitOverride: 90,
      funded: true,
      noKyc: false,
      security: "safe",
      verification: "Organizer rules + jury",
      description: "A three-week CommonsMade hackathon focused on making the waiting time inside AI products useful, playful or rewarding.",
      deliverables: ["Working AI product", "Public submission", "Demo and project description"],
      risk: "Review eligibility, judging criteria, sign-in requirements and prize distribution on the official event page.",
      createdAt: HACKATHON.startsAt,
      updatedAt: new Date().toISOString(),
      registrations: null,
      location: "Online",
      agentAccess: "HUMAN_ONLY"
    }],
    errors: [],
    meta: { access: "public-listing", payout: "real" }
  };
}
