#!/usr/bin/env node
/**
 * SEO Check — fetches live pages over HTTP and runs checks.
 *
 * Usage:
 *   node scripts/seo-check.mjs                   # default http://localhost:3000
 *   node scripts/seo-check.mjs https://prod.com  # custom base URL
 *   node scripts/seo-check.mjs http://localhost:3000 /pricing  # single page
 *
 * Config: data/seo-pages.json
 * Exit 1 on critical failures.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONFIG_PATH = path.join(ROOT, "data/seo-pages.json");

const C = {
  green: "\x1b[32m", red: "\x1b[31m", yellow: "\x1b[33m", cyan: "\x1b[36m",
  bold: "\x1b[1m", dim: "\x1b[2m", reset: "\x1b[0m",
};

// ── Args ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const baseUrl = (args[0] && args[0].startsWith("http") ? args[0] : "http://localhost:3000").replace(/\/$/, "");
const pageFilter = args.find((a, i) => i > 0 && a.startsWith("/")) || null;

// ── Load config ──────────────────────────────────────────────────────────
if (!fs.existsSync(CONFIG_PATH)) {
  console.error(`${C.red}Missing config: ${CONFIG_PATH}${C.reset}`);
  process.exit(1);
}
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
const defaults = config.defaults || {};

// ── Fetch ────────────────────────────────────────────────────────────────
async function fetchText(url) {
  try {
    const res = await fetch(url, { headers: { "user-agent": "seo-check/1.0" } });
    return { status: res.status, headers: Object.fromEntries(res.headers), body: await res.text() };
  } catch (err) {
    return { status: 0, error: err.message };
  }
}

// ── HTML extraction ──────────────────────────────────────────────────────
function stripToBody(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<head[\s\S]*?<\/head>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(text) {
  return text.split(/\s+/).filter((w) => w.length > 1).length;
}

function matchAttr(html, tag, attr) {
  const re = new RegExp(`<${tag}[^>]*\\b${attr}=["']([^"']+)["']`, "i");
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

function getTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? m[1].replace(/\s+/g, " ").trim() : null;
}

function getMeta(html, name) {
  const p1 = new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, "i");
  const p2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, "i");
  return (html.match(p1) || html.match(p2))?.[1]?.trim() || null;
}

function getOgProp(html, prop) {
  const p1 = new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i");
  const p2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${prop}["']`, "i");
  return (html.match(p1) || html.match(p2))?.[1]?.trim() || null;
}

function getCanonical(html) {
  return matchAttr(html, "link[^>]+rel=[\"']canonical[\"']", "href") ||
    html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] ||
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1] ||
    null;
}

function extractHeadings(html, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi");
  const out = [];
  for (const m of html.matchAll(re)) {
    const text = m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (text) out.push(text);
  }
  return out;
}

function linksMissingTitle(html) {
  const links = [...html.matchAll(/<a\s([^>]*)>/gi)];
  const internal = links.filter((m) => {
    const attrs = m[1];
    const href = attrs.match(/href=["']([^"']+)["']/)?.[1] || "";
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
    if (href.startsWith("http") && !href.includes(new URL(baseUrl).host)) return false;
    return true;
  });
  return internal.filter((m) => !/\btitle=/i.test(m[1])).length;
}

function imgsMissingAlt(html) {
  const imgs = [...html.matchAll(/<img\s([^>]*)>/gi)];
  return imgs.filter((m) => !/\balt=/i.test(m[1])).length;
}

function keywordDensity(text, keyword) {
  const lc = text.toLowerCase();
  const kw = keyword.toLowerCase();
  const words = lc.split(/\s+/).filter((w) => w.length > 0);
  let count = 0, pos = 0;
  while ((pos = lc.indexOf(kw, pos)) !== -1) { count++; pos += kw.length; }
  const kwWords = kw.split(/\s+/).length;
  const base = words.length / kwWords;
  return { count, density: base > 0 ? (count / base) * 100 : 0 };
}

function h2ModuleCoverage(h2s, required) {
  const joined = h2s.join(" ").toLowerCase();
  const missing = [];
  for (const mod of required) {
    // "ready" → match "ready to"; "faq" → match "faq" or "frequently asked"
    let found = joined.includes(mod);
    if (!found && mod === "faq") found = /frequently asked/i.test(joined);
    if (!found && mod === "ready") found = /ready to|get started|start creating/i.test(joined);
    if (!found) missing.push(mod);
  }
  return { covered: required.length - missing.length, total: required.length, missing };
}

// ── Checks ──────────────────────────────────────────────────────────────
const CRIT = "critical", WARN = "warning", INFO = "info";
function push(arr, level, label, pass, detail = "") { arr.push({ level, label, pass, detail }); }

function runPageChecks(html, cfg) {
  const issues = [];
  const text = stripToBody(html);
  const words = wordCount(text);
  const title = getTitle(html);
  const desc = getMeta(html, "description");
  const canonical = getCanonical(html);
  const ogImage = getOgProp(html, "og:image");
  const twImage = getOgProp(html, "twitter:image") || getMeta(html, "twitter:image");
  const h1s = extractHeadings(html, "h1");
  const h2s = extractHeadings(html, "h2");
  const h3s = extractHeadings(html, "h3");
  const noAlt = imgsMissingAlt(html);
  const noTitle = linksMissingTitle(html);
  const kd = keywordDensity(text, cfg.keyword);

  const merged = { ...defaults, ...cfg };
  const titleMin = merged.titleMin, titleMax = merged.titleMax;
  const descMin = merged.descMin, descMax = merged.descMax;

  // Critical
  push(issues, CRIT, "title exists", !!title, title ? `"${title}"` : "missing");
  if (title) {
    const len = title.length;
    push(issues, len < titleMin || len > titleMax ? WARN : INFO,
      `title length (${len} chars)`,
      len >= titleMin && len <= titleMax,
      `target ${titleMin}–${titleMax}`);
  }
  push(issues, CRIT, "description exists", !!desc, desc ? `${desc.length} chars` : "missing");
  if (desc) {
    const len = desc.length;
    push(issues, len < descMin || len > descMax ? WARN : INFO,
      `description length (${len} chars)`,
      len >= descMin && len <= descMax,
      `target ${descMin}–${descMax}`);
  }
  push(issues, CRIT, `H1 count (${h1s.length})`, h1s.length === 1,
    h1s.length === 0 ? "no H1" : `${h1s.length} H1 — must be exactly 1`);
  push(issues, CRIT, `word count (${words})`, words >= merged.wordMin,
    `min ${merged.wordMin}`);
  push(issues, CRIT, `images without alt (${noAlt})`, noAlt === 0,
    noAlt > 0 ? `${noAlt} <img> missing alt` : "");

  // Warnings
  push(issues, WARN, "canonical URL", !!canonical, canonical || "missing <link rel=canonical>");
  push(issues, WARN, `H2 count (${h2s.length})`, h2s.length >= merged.h2Min,
    `min ${merged.h2Min}`);
  push(issues, WARN, `H3 count (${h3s.length})`, h3s.length >= merged.h3Min,
    `min ${merged.h3Min}`);

  if (cfg.requireH2Modules) {
    const cov = h2ModuleCoverage(h2s, cfg.requireH2Modules);
    push(issues, cov.missing.length > 0 ? WARN : INFO,
      `H2 standard modules (${cov.covered}/${cov.total})`,
      cov.missing.length === 0,
      cov.missing.length > 0 ? `missing: ${cov.missing.join(", ")}` : "");
  }

  const densOk = kd.density >= merged.keywordDensityMin && kd.density <= merged.keywordDensityMax;
  push(issues, WARN,
    `keyword "${cfg.keyword}" density (${kd.density.toFixed(2)}%, ×${kd.count})`,
    densOk,
    `target ${merged.keywordDensityMin}–${merged.keywordDensityMax}%`);

  push(issues, WARN, "og:image", !!ogImage, ogImage || "missing");
  push(issues, WARN, "twitter:image", !!twImage, twImage || "missing");
  push(issues, WARN, `links without title (${noTitle})`, noTitle === 0,
    noTitle > 0 ? `${noTitle} internal links missing title attr` : "");

  return { issues, h2s, h3s, words };
}

// ── Reporter ─────────────────────────────────────────────────────────────
function symbol(issue) {
  if (issue.pass) return `${C.green}✓${C.reset}`;
  if (issue.level === CRIT) return `${C.red}✗${C.reset}`;
  if (issue.level === WARN) return `${C.yellow}⚠${C.reset}`;
  return `${C.cyan}ℹ${C.reset}`;
}

function printPage(name, url, { issues, h2s, h3s, words }) {
  const crit = issues.filter((i) => !i.pass && i.level === CRIT).length;
  const warn = issues.filter((i) => !i.pass && i.level === WARN).length;
  const pass = issues.filter((i) => i.pass).length;

  console.log(`\n${C.bold}${name}${C.reset} ${C.dim}${url}${C.reset}`);
  for (const issue of issues) {
    const label = issue.pass ? `${C.dim}${issue.label}${C.reset}` : issue.label;
    const detail = issue.detail ? `${C.dim}  — ${issue.detail}${C.reset}` : "";
    console.log(`  ${symbol(issue)}  ${label}${detail}`);
  }
  if (h2s.length > 0) {
    console.log(`  ${C.dim}H2 (${h2s.length}):${C.reset}`);
    h2s.forEach((h) => console.log(`    ${C.dim}• ${h.slice(0, 80)}${C.reset}`));
  }
  console.log(`  ${C.dim}─────${C.reset}  ${C.green}${pass} passed${C.reset}  ${warn > 0 ? C.yellow + warn + " warn" + C.reset + "  " : ""}${crit > 0 ? C.red + crit + " critical" + C.reset : ""}`);
  return crit;
}

// ── Site files check ─────────────────────────────────────────────────────
async function checkSiteFiles() {
  console.log(`\n${C.bold}Site files${C.reset} ${C.dim}${baseUrl}${C.reset}`);
  let crit = 0;
  for (const f of config.siteFiles || []) {
    const r = await fetchText(`${baseUrl}${f.path}`);
    const ok = r.status === 200 && (!f.contentType ||
      (r.headers?.["content-type"] || "").toLowerCase().includes(f.contentType.toLowerCase()));
    if (!ok) crit++;
    const status = r.status || "ERR";
    const ct = r.headers?.["content-type"] || "—";
    console.log(`  ${ok ? C.green + "✓" : C.red + "✗"}${C.reset}  ${f.path} ${C.dim}(${status}, ${ct})${C.reset}`);
  }
  return crit;
}

// ── Main ─────────────────────────────────────────────────────────────────
(async () => {
  console.log(`\n${C.bold}━━ SEO Check ━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}`);
  console.log(`${C.dim}Base URL: ${baseUrl}${C.reset}`);

  const pages = pageFilter ? config.pages.filter((p) => p.path === pageFilter) : config.pages;
  if (pages.length === 0) {
    console.error(`${C.red}No pages matched${C.reset}`);
    process.exit(1);
  }

  let exitCode = 0;

  const siteCrit = await checkSiteFiles();
  if (siteCrit > 0) exitCode = 1;

  for (const page of pages) {
    const url = `${baseUrl}${page.path}`;
    const res = await fetchText(url);
    if (res.status !== 200) {
      console.log(`\n${C.red}✗ ${page.name} — HTTP ${res.status || "ERR"}${C.reset} ${C.dim}${url}${C.reset}`);
      if (res.error) console.log(`  ${C.dim}${res.error}${C.reset}`);
      exitCode = 1;
      continue;
    }
    const result = runPageChecks(res.body, page);
    const crit = printPage(page.name, url, result);
    if (crit > 0) exitCode = 1;
  }

  console.log("");
  if (exitCode === 0) {
    console.log(`${C.green}${C.bold}✓ All critical SEO checks passed.${C.reset}\n`);
  } else {
    console.log(`${C.red}${C.bold}✗ SEO check failed — fix critical issues.${C.reset}\n`);
  }
  process.exit(exitCode);
})();
