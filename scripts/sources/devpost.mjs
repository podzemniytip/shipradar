function numberFromHtml(value = "") {
  const plain = value.replace(/<[^>]+>/g, "").replace(/[^\d.]/g, "");
  return Number(plain || 0);
}

function deadlineHours(label = "") {
  const days = label.match(/(\d+)\s+days?/i);
  const hours = label.match(/(\d+)\s+hours?/i);
  if (days) return Number(days[1]) * 24;
  if (hours) return Number(hours[1]);
  return null;
}

function mapHackathon(item) {
  const reward = numberFromHtml(item.prize_amount);
  const remaining = deadlineHours(item.time_left_to_submission);
  const competition = Number(item.registrations_count || 0);
  const tags = (item.themes || []).map(theme => theme.name).slice(0, 4);
  const isUpcoming = item.open_state === "upcoming";

  return {
    id: `devpost-${item.id}`,
    externalId: String(item.id),
    type: "hackathon",
    status: isUpcoming ? "upcoming" : "active",
    source: "DEV",
    sourceName: "Devpost",
    sourceDetail: item.organization_name || "Hackathon",
    title: item.title,
    url: item.url,
    reward,
    rewardNote: reward ? "USD · prize pool" : "Prizes · see listing",
    competition,
    hours: [24, 80],
    deadlineHours: remaining,
    deadlineLabel: isUpcoming ? "Upcoming" : item.time_left_to_submission || "Open",
    tags: tags.length ? tags : ["Hackathon"],
    funded: reward > 0,
    noKyc: false,
    security: "safe",
    verification: "Organizer rules + jury",
    description: `${item.organization_name || "An organizer"} is running ${item.title}. ${item.submission_period_dates || ""} ${item.displayed_location?.location || ""}`.trim(),
    deliverables: ["Working project", "Public submission", "Demo and project description"],
    risk: competition > 1000
      ? "High registration count. Prize distribution, eligibility and judging rules should be reviewed before committing."
      : "Review eligibility, judging criteria and prize distribution on the original listing.",
    createdAt: null,
    updatedAt: new Date().toISOString(),
    registrations: competition,
    location: item.displayed_location?.location || "Online",
    agentAccess: "HUMAN_ONLY"
  };
}

export async function fetchDevpostHackathons() {
  const items = [];
  const errors = [];

  for (let page = 1; page <= 3; page += 1) {
    const url = new URL("https://devpost.com/api/hackathons");
    url.searchParams.append("status[]", "open");
    url.searchParams.append("status[]", "upcoming");
    url.searchParams.set("page", String(page));

    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "ShipRadar/1.0", Accept: "application/json" }
      });
      if (!response.ok) throw new Error(`Devpost ${response.status}`);
      const data = await response.json();
      items.push(...(data.hackathons || []).map(mapHackathon));
      if (!(data.hackathons || []).length) break;
    } catch (error) {
      errors.push(error.message);
      break;
    }
  }

  return { items, errors };
}
