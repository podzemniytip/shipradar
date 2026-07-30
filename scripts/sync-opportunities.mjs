import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreOpportunity } from "./scoring.mjs";
import { fetchGitHubBounties } from "./sources/github.mjs";
import { fetchDevpostHackathons } from "./sources/devpost.mjs";
import { fetchSuperteamAgentBounties, fetchSuperteamBounties } from "./sources/superteam.mjs";
import { fetchTaskBountyTasks } from "./sources/taskbounty.mjs";
import { fetchBuzzClawBounties } from "./sources/buzzclaw.mjs";
import { fetchGhostHiveBounties } from "./sources/ghosthive.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "data");
const catalogPath = join(dataDir, "opportunities.json");
const metaPath = join(dataDir, "sync-meta.json");
const browserCatalogPath = join(dataDir, "catalog.js");

function canonicalTitle(title = "") {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function deduplicate(items) {
  const unique = new Map();
  for (const item of items) {
    const key = item.url || `${item.sourceName}:${canonicalTitle(item.title)}`;
    const existing = unique.get(key);
    if (!existing || (item.updatedAt || "") > (existing.updatedAt || "")) unique.set(key, item);
  }
  return [...unique.values()];
}

function limitProjectDominance(items) {
  const counts = new Map();
  return [...items]
    .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""))
    .filter(item => {
      if (item.sourceName !== "GitHub") return true;
      const project = item.sourceDetail || item.sourceName;
      const count = counts.get(project) || 0;
      if (count >= 5) return false;
      counts.set(project, count + 1);
      return true;
    });
}

async function previousCatalog() {
  try {
    return JSON.parse(await readFile(catalogPath, "utf8"));
  } catch {
    return [];
  }
}

const startedAt = new Date().toISOString();
const results = await Promise.allSettled([
  fetchGitHubBounties(),
  fetchDevpostHackathons(),
  fetchSuperteamBounties(),
  fetchSuperteamAgentBounties(),
  fetchTaskBountyTasks(),
  fetchBuzzClawBounties(),
  fetchGhostHiveBounties()
]);

const sourceNames = [
  "github",
  "devpost",
  "superteam",
  "superteam-agents",
  "taskbounty",
  "buzzclaw",
  "ghosthive"
];
const sourceStatus = {};
const freshItems = [];

results.forEach((result, index) => {
  const name = sourceNames[index];
  if (result.status === "fulfilled") {
    freshItems.push(...result.value.items);
    sourceStatus[name] = {
      ok: result.value.errors.length === 0,
      count: result.value.items.length,
      errors: result.value.errors,
      ...(result.value.meta || {})
    };
  } else {
    sourceStatus[name] = { ok: false, count: 0, errors: [result.reason?.message || "Unknown error"] };
  }
});

const previous = await previousCatalog();
const usable = freshItems.length ? freshItems : previous;
const catalog = limitProjectDominance(deduplicate(usable))
  .map(scoreOpportunity)
  .sort((a, b) => b.score - a.score || b.reward - a.reward);

await mkdir(dataDir, { recursive: true });
const meta = {
  updatedAt: new Date().toISOString(),
  startedAt,
  total: catalog.length,
  active: catalog.filter(item => item.status === "active").length,
  upcoming: catalog.filter(item => item.status === "upcoming").length,
  sources: sourceStatus,
  scoringVersion: 2
};

await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
await writeFile(metaPath, `${JSON.stringify(meta, null, 2)}\n`, "utf8");
await writeFile(
  browserCatalogPath,
  `window.SHIPRADAR_DATA=${JSON.stringify(catalog)};\nwindow.SHIPRADAR_META=${JSON.stringify(meta)};\n`,
  "utf8"
);

console.log(`ShipRadar sync complete: ${catalog.length} opportunities`);
for (const [source, status] of Object.entries(sourceStatus)) {
  console.log(`${source}: ${status.count} items${status.errors.length ? `, ${status.errors.join("; ")}` : ""}`);
}
