let opportunities = (window.SHIPRADAR_DATA || window.BOUNTYDROPS_DATA)?.length
  ? (window.SHIPRADAR_DATA || window.BOUNTYDROPS_DATA)
  : [
  {
    id: 1,
    status: "active",
    source: "GH",
    sourceName: "GitHub",
    title: "Fix a PostgreSQL migration bug",
    reward: 2500,
    rewardNote: "USDC · escrow",
    aiFit: 92,
    competition: 3,
    hours: [5, 9],
    deadlineHours: 18,
    deadlineLabel: "18 hours",
    tags: ["TypeScript", "PostgreSQL", "Tests"],
    funded: true,
    noKyc: true,
    security: "safe",
    verification: "14 automated tests",
    description: "Fix NULL handling in the migration resolver and add a regression test. The repository is public and includes reproduction steps.",
    deliverables: ["Minimal patch with no public API changes", "Regression test", "Passing full test suite"],
    risk: "The project uses PostgreSQL 17. A local container or compatible CI runner is required."
  },
  {
    id: 2,
    status: "active",
    source: "AL",
    sourceName: "Algora",
    title: "Build an MCP integration for Linear",
    reward: 800,
    rewardNote: "USD · funded",
    aiFit: 87,
    competition: 12,
    hours: [7, 12],
    deadlineHours: 84,
    deadlineLabel: "3d 12h",
    tags: ["Python", "MCP", "OAuth"],
    funded: true,
    noKyc: false,
    security: "warning",
    verification: "Review + integration tests",
    description: "The MCP server must read issues, create comments and update statuses using minimal OAuth permissions.",
    deliverables: ["Three MCP tools", "OAuth flow", "README with examples", "Integration tests"],
    risk: "The brief links to an external setup script. Review it manually before running."
  },
  {
    id: 3,
    status: "active",
    source: "KH",
    sourceName: "Kaggle",
    title: "Extract tables from damaged PDFs",
    reward: 5000,
    rewardNote: "USD · prize pool",
    aiFit: 73,
    competition: 46,
    hours: [18, 30],
    deadlineHours: 132,
    deadlineLabel: "5d 12h",
    tags: ["OCR", "Python", "PDF"],
    funded: true,
    noKyc: false,
    security: "safe",
    verification: "Hidden benchmark",
    description: "A competition to recover tabular data from low-quality scans of archival documents.",
    deliverables: ["CSV for the test dataset", "Reproducible notebook", "Method description"],
    risk: "High competition and a hidden test set. The final payout depends on leaderboard position."
  },
  {
    id: 4,
    status: "active",
    source: "GH",
    sourceName: "GitHub",
    title: "Fix date sorting in a CLI",
    reward: 300,
    rewardNote: "USD · sponsor",
    aiFit: 96,
    competition: 1,
    hours: [2, 4],
    deadlineHours: 38,
    deadlineLabel: "1d 14h",
    tags: ["Rust", "CLI", "Chrono"],
    funded: false,
    noKyc: true,
    security: "safe",
    verification: "Unit tests",
    description: "The CLI sorts RFC3339 timestamps with different time zones incorrectly. A failing test and expected output are provided.",
    deliverables: ["Comparator fix", "Existing test passes", "New edge-case test"],
    risk: "The reward is sponsor-backed, but the funds are not held in escrow."
  },
  {
    id: 5,
    status: "active",
    source: "OS",
    sourceName: "Open Source",
    title: "Build a local Markdown preview",
    reward: 450,
    rewardNote: "EUR · milestone",
    aiFit: 89,
    competition: 5,
    hours: [5, 8],
    deadlineHours: 192,
    deadlineLabel: "8 days",
    tags: ["Web", "Markdown", "WASM"],
    funded: true,
    noKyc: true,
    security: "safe",
    verification: "Playwright tests",
    description: "A single-page preview for four Markdown dialects. All processing must stay in the browser with no external requests.",
    deliverables: ["GFM, CommonMark, Pandoc and Obsidian", "Side-by-side preview", "Portable Markdown export"],
    risk: "Generated HTML must be isolated carefully from user-provided Markdown."
  },
  {
    id: 6,
    status: "active",
    source: "HF",
    sourceName: "Hugging Face",
    title: "Port a diarization model to WebGPU",
    reward: 4200,
    rewardNote: "USD · grant",
    aiFit: 61,
    competition: 8,
    hours: [28, 50],
    deadlineHours: 312,
    deadlineLabel: "13 days",
    tags: ["WebGPU", "ONNX", "Audio"],
    funded: true,
    noKyc: true,
    security: "safe",
    verification: "Accuracy + speed benchmark",
    description: "Create an ONNX export of a diarization model and demonstrate fully local inference in Chromium.",
    deliverables: ["ONNX weights", "WebGPU demo", "Benchmark on three devices", "Documentation"],
    risk: "Converting unsupported operators may require changes to the model architecture."
  },
  {
    id: 7,
    status: "active",
    source: "GH",
    sourceName: "GitHub",
    title: "Document 12 API endpoints",
    reward: 220,
    rewardNote: "USD · funded",
    aiFit: 94,
    competition: 2,
    hours: [3, 5],
    deadlineHours: 61,
    deadlineLabel: "2d 13h",
    tags: ["OpenAPI", "Docs", "Examples"],
    funded: true,
    noKyc: true,
    security: "warning",
    verification: "Schema validation",
    description: "Complete the OpenAPI descriptions, errors and request examples based on existing handlers and tests.",
    deliverables: ["12 endpoint descriptions", "Request/response examples", "Error cases"],
    risk: "The issue requests runtime metadata. Do not expose local paths or environment variables."
  },
  {
    id: 8,
    status: "active",
    source: "DEV",
    sourceName: "Devpost",
    title: "Build an AI assistant for volunteers",
    reward: 12000,
    rewardNote: "USD · prize pool",
    aiFit: 54,
    competition: 109,
    hours: [35, 70],
    deadlineHours: 240,
    deadlineLabel: "10 days",
    tags: ["Agents", "Civic Tech", "RAG"],
    funded: true,
    noKyc: false,
    security: "safe",
    verification: "Jury review",
    description: "Hackathon brief: prototype an assistant that matches volunteers with local nonprofit needs.",
    deliverables: ["Working prototype", "Demo video", "Pitch deck", "Public repository"],
    risk: "Subjective jury scoring and a large field. The prize is split between winners."
  },
  {
    id: 9,
    status: "upcoming",
    source: "EF",
    sourceName: "Ecosystem Fund",
    title: "Open-source agent security grant",
    reward: 10000,
    rewardNote: "USD · grant",
    aiFit: 66,
    competition: 0,
    hours: [24, 50],
    deadlineHours: 480,
    deadlineLabel: "opens in 6d",
    tags: ["Security", "Agents", "Open Source"],
    funded: true,
    noKyc: false,
    security: "safe",
    verification: "Milestone review",
    description: "The fund will accept proposals for tools that protect AI agents from prompt injection and data leaks.",
    deliverables: ["Application", "Technical plan", "Milestones", "Open-source commitment"],
    risk: "Final terms and the list of eligible countries have not been published yet."
  },
  {
    id: 10,
    status: "upcoming",
    source: "GH",
    sourceName: "GitHub",
    title: "Move the image cache to SQLite",
    reward: 1100,
    rewardNote: "USD · announced",
    aiFit: 82,
    competition: 0,
    hours: [10, 18],
    deadlineHours: 336,
    deadlineLabel: "opens in 2d",
    tags: ["Go", "SQLite", "Cache"],
    funded: false,
    noKyc: true,
    security: "safe",
    verification: "Benchmark + tests",
    description: "An announced bounty to replace a file-based image cache with size-limited SQLite storage and LRU eviction.",
    deliverables: ["SQLite storage", "LRU eviction", "Migration", "Performance benchmark"],
    risk: "The final reward and acceptance criteria may still change."
  },
  {
    id: 11,
    status: "upcoming",
    source: "DS",
    sourceName: "Data Science",
    title: "Classify road surface damage",
    reward: 7500,
    rewardNote: "USD · challenge",
    aiFit: 58,
    competition: 0,
    hours: [30, 60],
    deadlineHours: 720,
    deadlineLabel: "opens in 12d",
    tags: ["Vision", "Dataset", "Geo"],
    funded: true,
    noKyc: false,
    security: "safe",
    verification: "Hidden leaderboard",
    description: "A municipal challenge to classify road defects in photos captured on mobile devices.",
    deliverables: ["Prediction file", "Model card", "Inference notebook"],
    risk: "License requirements for the final model will be published when the challenge opens."
  },
  {
    id: 12,
    status: "ended",
    source: "GH",
    sourceName: "GitHub",
    title: "Add ICS calendar export",
    reward: 380,
    rewardNote: "USD · paid",
    aiFit: 91,
    competition: 4,
    hours: [4, 7],
    deadlineHours: 0,
    deadlineLabel: "paid",
    tags: ["JavaScript", "ICS", "Tests"],
    funded: true,
    noKyc: true,
    security: "safe",
    verification: "Merged PR",
    description: "A completed bounty for exporting application events to a standard ICS file.",
    deliverables: ["ICS exporter", "Timezone support", "Tests"],
    risk: "This opportunity has ended. The data is retained for sponsor statistics."
  },
  {
    id: 13,
    status: "ended",
    source: "AL",
    sourceName: "Algora",
    title: "Fix a race condition in an upload queue",
    reward: 1800,
    rewardNote: "USD · paid",
    aiFit: 78,
    competition: 7,
    hours: [12, 20],
    deadlineHours: 0,
    deadlineLabel: "paid",
    tags: ["Rust", "Async", "Storage"],
    funded: true,
    noKyc: true,
    security: "safe",
    verification: "Merged PR",
    description: "The contributor prevented jobs from being lost when a worker stops while an upload is requeued.",
    deliverables: ["Concurrency fix", "Stress test", "Technical note"],
    risk: "This opportunity has ended. The reward was paid two days after merge."
  },
  {
    id: 14,
    status: "ended",
    source: "DEV",
    sourceName: "Devpost",
    title: "AI interface for a public transit map",
    reward: 6000,
    rewardNote: "USD · paid",
    aiFit: 49,
    competition: 63,
    hours: [35, 60],
    deadlineHours: 0,
    deadlineLabel: "ended",
    tags: ["Maps", "Accessibility", "AI"],
    funded: true,
    noKyc: false,
    security: "safe",
    verification: "Jury winner",
    description: "The winning hackathon project: voice search for accessible public transit routes.",
    deliverables: ["Prototype", "Pitch", "Demo"],
    risk: "This opportunity has ended. The prize was split between two teams."
  }
];

const migratedSaved = localStorage.getItem("shipradar-saved")
  || localStorage.getItem("bountydrops-saved")
  || "[]";

const state = {
  status: "active",
  filters: new Set(),
  search: "",
  sort: "recommended",
  showSaved: false,
  saved: new Set(JSON.parse(migratedSaved).map(String))
};

const list = document.getElementById("opportunityList");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const drawer = document.getElementById("detailDrawer");
const drawerContent = document.getElementById("drawerContent");
const backdrop = document.getElementById("drawerBackdrop");

function rankingScore(item) {
  if (Number.isFinite(item.score)) return Math.min(100, Math.max(0, item.score));
  const fundedBonus = item.funded ? 14 : 0;
  const competitionPenalty = Math.min(item.competition * 1.7, 32);
  const weekendBonus = item.hours[1] <= 10 ? 10 : 0;
  return Math.min(100, Math.max(0, item.aiFit + fundedBonus + weekendBonus - competitionPenalty));
}

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeUrl(value = "") {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : "#";
  } catch {
    return "#";
  }
}

function getVisibleItems() {
  const query = state.search.trim().toLowerCase();
  let items = opportunities.filter(item => {
    if (item.status !== state.status) return false;
    if (state.showSaved && !state.saved.has(String(item.id))) return false;
    if (query) {
      const haystack = [item.title, item.sourceName, ...item.tags].join(" ").toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (state.filters.has("ai") && item.aiFit < 80) return false;
    if (state.filters.has("lowCompetition") && item.competition > 5) return false;
    if (state.filters.has("funded") && !item.funded) return false;
    if (state.filters.has("weekend") && item.hours[1] > 10) return false;
    if (state.filters.has("noKyc") && !item.noKyc) return false;
    if (state.filters.has("agents") && !["AGENT_ALLOWED", "AGENT_ONLY"].includes(item.agentAccess)) return false;
    return true;
  });

  items.sort((a, b) => {
    if (state.sort === "reward") return b.reward - a.reward;
    if (state.sort === "aiFit") return b.aiFit - a.aiFit;
    if (state.sort === "deadline") return a.deadlineHours - b.deadlineHours;
    return rankingScore(b) - rankingScore(a);
  });
  return items;
}

function formatReward(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
}

function rewardLabel(item) {
  if (item.monetaryReward === false && item.rewardUnits) {
    return `${Number(item.rewardUnits).toLocaleString("en-US")} ${escapeHTML(item.rewardSymbol || "credits")}`;
  }
  return item.reward > 0 ? formatReward(item.reward) : "See listing";
}

function competitionLabel(value, status) {
  if (status === "upcoming") return "not started";
  if (value <= 3) return "low";
  if (value <= 12) return "medium";
  return "high";
}

function participantLabel(value) {
  return value === 1 ? "builder" : "builders";
}

function accessLabel(value) {
  if (value === "AGENT_ALLOWED") return "Agents allowed";
  if (value === "AGENT_ONLY") return "Agents only";
  if (value === "HUMAN_ONLY") return "Human only";
  return "Check original brief";
}

function render() {
  const items = getVisibleItems();
  list.innerHTML = items.map((item, index) => `
    <article class="opportunity-row" data-id="${item.id}" style="animation-delay:${index * 45}ms" tabindex="0">
      <div class="opportunity-main">
        <span class="source-logo">${item.source}</span>
        <div class="opportunity-copy">
          <h2>${escapeHTML(item.title)}</h2>
          <div class="meta-line">
            <span>${escapeHTML(item.sourceName)}</span>
            ${["AGENT_ALLOWED", "AGENT_ONLY"].includes(item.agentAccess)
              ? `<span class="agent-flag">${item.agentAccess === "AGENT_ONLY" ? "AGENTS ONLY" : `AGENT READY ${item.agentReadiness ?? 0}`}</span>`
              : ""}
            <span>·</span>
            <span>${item.hours[0]}–${item.hours[1]}h</span>
            <span>·</span>
            <span class="${item.funded ? "verified" : ""}">${item.funded ? "● payout verified" : "○ no escrow"}</span>
            ${item.security === "warning" ? '<span class="risk">⚠ brief risk</span>' : ""}
          </div>
          <div class="tag-line">${item.tags.map(tag => `<span class="tag">${escapeHTML(tag)}</span>`).join("")}</div>
        </div>
      </div>
      <div class="reward">
        <strong>${rewardLabel(item)}</strong>
        <span>${escapeHTML(item.rewardNote)}</span>
      </div>
      <div class="ai-score">
        <strong>${Math.round(rankingScore(item))}</strong><small>/100 · ${escapeHTML(item.rating || "—")}</small>
        <div class="score-track"><i style="width:${Math.round(rankingScore(item))}%"></i></div>
      </div>
      <div class="competition">
        <strong>${competitionLabel(item.competition, item.status)}</strong>
        <span>${item.competition ? `${item.competition} ${participantLabel(item.competition)}` : "before launch"}</span>
      </div>
      <div class="deadline ${item.deadlineHours && item.deadlineHours < 24 ? "urgent" : ""}">
        <strong>${escapeHTML(item.deadlineLabel)}</strong>
        <span>${item.status === "ended" ? "status" : "remaining"}</span>
      </div>
      <button class="save-button ${state.saved.has(String(item.id)) ? "saved" : ""}" data-save="${item.id}" aria-label="${state.saved.has(String(item.id)) ? "Remove from saved" : "Save opportunity"}">
        ${state.saved.has(String(item.id)) ? "◆" : "◇"}
      </button>
    </article>
  `).join("");

  emptyState.hidden = items.length > 0;
  list.hidden = items.length === 0;
  emptyState.querySelector("h2").textContent = state.showSaved ? "No saved opportunities" : "No matches found";
  emptyState.querySelector("p").textContent = state.showSaved
    ? "Use the diamond button on any opportunity to bookmark it in this browser."
    : "Remove a filter or try a different search.";
  updateSavedCount();
}

function openDrawer(item) {
  drawerContent.innerHTML = `
    <p class="drawer-kicker">${escapeHTML(item.sourceName)} / ${item.status === "active" ? "active" : item.status === "upcoming" ? "upcoming" : "ended"}</p>
    <h2 class="drawer-title">${escapeHTML(item.title)}</h2>
    <div class="drawer-reward">
      <div>
        <span>Reward</span>
        <strong>${rewardLabel(item)}</strong>
      </div>
      <span>${escapeHTML(item.rewardNote)}</span>
    </div>
    <div class="detail-grid">
      <div class="detail-cell"><span>Opportunity score</span><strong>${Math.round(rankingScore(item))}/100 · ${escapeHTML(item.rating || "—")}</strong></div>
      <div class="detail-cell"><span>AI Fit</span><strong>${item.aiFit}/100</strong></div>
      <div class="detail-cell"><span>Competition</span><strong>${competitionLabel(item.competition, item.status)}</strong></div>
      <div class="detail-cell"><span>Time estimate</span><strong>${item.hours[0]}–${item.hours[1]} hours</strong></div>
      <div class="detail-cell"><span>Payout confidence</span><strong>${item.scoreBreakdown?.payoutConfidence ?? (item.funded ? 82 : 50)}/100</strong></div>
      <div class="detail-cell"><span>Verification</span><strong>${escapeHTML(item.verification)}</strong></div>
      <div class="detail-cell"><span>Participation</span><strong>${accessLabel(item.agentAccess)}</strong></div>
      ${["AGENT_ALLOWED", "AGENT_ONLY"].includes(item.agentAccess)
        ? `<div class="detail-cell"><span>Agent readiness</span><strong>${item.agentReadiness ?? 0}/100</strong></div>`
        : ""}
    </div>
    <section class="detail-section">
      <h3>Brief</h3>
      <p>${escapeHTML(item.description)}</p>
    </section>
    <section class="detail-section">
      <h3>Score breakdown</h3>
      <div class="score-components">
        <div><span>AI fit · 35%</span><strong>${item.scoreBreakdown?.aiFit ?? item.aiFit}</strong></div>
        <div><span>Payout confidence · 25%</span><strong>${item.scoreBreakdown?.payoutConfidence ?? (item.funded ? 82 : 50)}</strong></div>
        <div><span>Low competition · 20%</span><strong>${item.scoreBreakdown?.competition ?? "—"}</strong></div>
        <div><span>Scope clarity · 10%</span><strong>${item.scoreBreakdown?.clarity ?? "—"}</strong></div>
        <div><span>Urgency · 10%</span><strong>${item.scoreBreakdown?.urgency ?? "—"}</strong></div>
      </div>
      <p class="score-note">A discovery heuristic, not a guarantee of payment. Always verify the original listing before starting.</p>
    </section>
    <section class="detail-section">
      <h3>Deliverables</h3>
      <ul>${item.deliverables.map(point => `<li>${escapeHTML(point)}</li>`).join("")}</ul>
    </section>
    <section class="detail-section">
      <h3>Safety & risks</h3>
      <div class="risk-card">${escapeHTML(item.risk)}</div>
    </section>
    <section class="detail-section">
      <h3>Skills</h3>
      <div class="tag-line">${item.tags.map(tag => `<span class="tag">${escapeHTML(tag)}</span>`).join("")}</div>
    </section>
    <div class="drawer-cta">
      <a class="primary-cta" href="${safeUrl(item.url)}" target="_blank" rel="noopener noreferrer">Open original listing ↗</a>
      <button class="secondary-cta" data-save="${item.id}" aria-label="${state.saved.has(String(item.id)) ? "Remove from saved" : "Save opportunity"}">${state.saved.has(String(item.id)) ? "◆" : "◇"}</button>
    </div>
  `;

  backdrop.hidden = false;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  setTimeout(() => { backdrop.hidden = true; }, 320);
}

function toggleSaved(id) {
  const key = String(id);
  if (state.saved.has(key)) state.saved.delete(key);
  else state.saved.add(key);
  localStorage.setItem("shipradar-saved", JSON.stringify([...state.saved]));
  render();
  const openItem = opportunities.find(item => String(item.id) === key && drawer.classList.contains("open"));
  if (openItem) openDrawer(openItem);
}

function updateSavedCount() {
  document.getElementById("savedCount").textContent = state.saved.size;
  const button = document.getElementById("savedButton");
  button.classList.toggle("active", state.showSaved);
  button.setAttribute("aria-pressed", String(state.showSaved));
}

function resetAllFilters() {
  state.filters.clear();
  state.search = "";
  state.showSaved = false;
  searchInput.value = "";
  document.querySelectorAll(".filter-chip").forEach(chip => {
    chip.classList.remove("active");
    chip.setAttribute("aria-pressed", "false");
  });
  render();
}

document.querySelectorAll(".status-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".status-tab").forEach(item => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    state.status = tab.dataset.status;
    render();
  });
});

document.querySelectorAll(".filter-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    const filter = chip.dataset.filter;
    if (state.filters.has(filter)) state.filters.delete(filter);
    else state.filters.add(filter);
    chip.classList.toggle("active");
    chip.setAttribute("aria-pressed", String(state.filters.has(filter)));
    render();
  });
});

searchInput.addEventListener("input", event => {
  state.search = event.target.value;
  render();
});

sortSelect.addEventListener("change", event => {
  state.sort = event.target.value;
  render();
});

list.addEventListener("click", event => {
  const save = event.target.closest("[data-save]");
  if (save) {
    event.stopPropagation();
    toggleSaved(save.dataset.save);
    return;
  }
  const row = event.target.closest("[data-id]");
  if (row) openDrawer(opportunities.find(item => String(item.id) === row.dataset.id));
});

list.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    const row = event.target.closest("[data-id]");
    if (row) openDrawer(opportunities.find(item => String(item.id) === row.dataset.id));
  }
});

drawer.addEventListener("click", event => {
  const save = event.target.closest("[data-save]");
  if (save) toggleSaved(save.dataset.save);
});

document.getElementById("drawerClose").addEventListener("click", closeDrawer);
backdrop.addEventListener("click", closeDrawer);
document.getElementById("resetFilters").addEventListener("click", resetAllFilters);

document.getElementById("weekendButton").addEventListener("click", () => {
  state.status = "active";
  state.showSaved = false;
  state.filters.add("weekend");
  document.querySelectorAll(".status-tab").forEach(tab => tab.classList.toggle("active", tab.dataset.status === "active"));
  document.querySelectorAll(".status-tab").forEach(tab => tab.setAttribute("aria-selected", String(tab.dataset.status === "active")));
  document.querySelector('[data-filter="weekend"]').classList.add("active");
  document.querySelector('[data-filter="weekend"]').setAttribute("aria-pressed", "true");
  document.querySelector(".terminal").scrollIntoView({ behavior: "smooth", block: "start" });
  render();
});

document.getElementById("savedButton").addEventListener("click", () => {
  state.showSaved = !state.showSaved;
  if (state.showSaved) {
    state.filters.clear();
    state.search = "";
    searchInput.value = "";
    document.querySelectorAll(".filter-chip").forEach(chip => {
      chip.classList.remove("active");
      chip.setAttribute("aria-pressed", "false");
    });
    const savedItems = [...state.saved].map(id => opportunities.find(item => String(item.id) === id)).filter(Boolean);
    if (savedItems[0]) state.status = savedItems[0].status;
  }
  document.querySelectorAll(".status-tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.status === state.status);
    tab.setAttribute("aria-selected", String(tab.dataset.status === state.status));
  });
  render();
});

document.addEventListener("keydown", event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape") closeDrawer();
});

function updateDashboard(meta = {}) {
  const active = opportunities.filter(item => item.status === "active");
  const upcoming = opportunities.filter(item => item.status === "upcoming");
  const ended = opportunities.filter(item => item.status === "ended");
  const rewardTotal = active.reduce(
    (sum, item) => sum + (item.monetaryReward === false ? 0 : (Number(item.reward) || 0)),
    0
  );
  const sources = new Set(opportunities.map(item => item.sourceName));
  const fresh = opportunities.filter(item => {
    if (!item.updatedAt) return false;
    return Date.now() - Date.parse(item.updatedAt) <= 86_400_000;
  }).length;

  document.getElementById("activeMetric").textContent = active.length;
  document.getElementById("rewardMetric").textContent = rewardTotal >= 1_000_000
    ? `$${(rewardTotal / 1_000_000).toFixed(1)}M`
    : `$${Math.round(rewardTotal / 1000)}K`;
  document.getElementById("scoreMetric").textContent = opportunities.length
    ? Math.max(...opportunities.map(rankingScore))
    : "—";
  document.getElementById("freshMetric").textContent = `+${fresh}`;
  document.getElementById("sourceMetric").textContent = `across ${sources.size} live sources`;
  document.getElementById("activeTabCount").textContent = active.length;
  document.getElementById("upcomingTabCount").textContent = upcoming.length;
  document.getElementById("endedTabCount").textContent = ended.length;

  if (meta.updatedAt) {
    const date = new Date(meta.updatedAt);
    document.getElementById("updatedAt").textContent = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
      .format(-Math.max(0, Math.round((Date.now() - date.getTime()) / 3_600_000)), "hour");
    document.getElementById("updatedAt").title = date.toLocaleString();
  } else {
    document.getElementById("updatedAt").textContent = "demo fallback";
  }
}

async function loadCatalog() {
  let meta = window.SHIPRADAR_META || window.BOUNTYDROPS_META || {};
  try {
    const cacheBust = Date.now();
    const [catalogResponse, metaResponse] = await Promise.all([
      fetch(`./data/opportunities.json?v=${cacheBust}`),
      fetch(`./data/sync-meta.json?v=${cacheBust}`)
    ]);
    if (catalogResponse.ok) {
      const liveItems = await catalogResponse.json();
      if (Array.isArray(liveItems) && liveItems.length) opportunities = liveItems;
    }
    if (metaResponse.ok) meta = await metaResponse.json();
  } catch (error) {
    console.warn("Live catalog unavailable; showing bundled fallback.", error);
  }

  const validIds = new Set(opportunities.map(item => String(item.id)));
  state.saved = new Set([...state.saved].filter(id => validIds.has(id)));
  localStorage.setItem("shipradar-saved", JSON.stringify([...state.saved]));
  updateDashboard(meta);
  render();
}

loadCatalog();
