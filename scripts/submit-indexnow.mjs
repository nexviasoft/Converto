#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const SITE_URL = (process.env.INDEXNOW_SITE_URL || "https://www.converto.tools").replace(/\/$/, "");
const INDEXNOW_ENDPOINT = process.env.INDEXNOW_ENDPOINT || "https://api.indexnow.org/indexnow";
const INDEXNOW_KEY = "6431845eec2daa82d9317c165681ec0f";
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
const BEFORE_SHA = process.env.BEFORE_SHA || "";
const AFTER_SHA = process.env.AFTER_SHA || process.env.GITHUB_SHA || "";
const WAIT_FOR_DEPLOYMENT = process.env.WAIT_FOR_DEPLOYMENT !== "false";
const DRY_RUN = process.env.DRY_RUN === "true";
const SITEMAP_FILE = process.env.INDEXNOW_SITEMAP_FILE || "";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isUsableSha(value) {
  return Boolean(value) && !/^0+$/.test(value);
}

function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": "Converto-IndexNow/1.0" },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.json();
}

async function waitForProductionDeployment() {
  if (!WAIT_FOR_DEPLOYMENT || !isUsableSha(AFTER_SHA)) return;

  const expected = AFTER_SHA.toLowerCase();
  const markerUrl = `${SITE_URL}/api/deployment-version`;
  const maxAttempts = 40;

  console.log(`Waiting for production deployment ${expected.slice(0, 7)}...`);

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const marker = await fetchJson(`${markerUrl}?t=${Date.now()}`);
      const deployedSha = typeof marker.sha === "string" ? marker.sha.toLowerCase() : "";

      if (deployedSha === expected && marker.environment === "production") {
        console.log(`Production deployment is live (${deployedSha.slice(0, 7)}).`);
        return;
      }

      const status = deployedSha ? deployedSha.slice(0, 7) : "unknown";
      console.log(`Attempt ${attempt}/${maxAttempts}: production is ${status}; waiting...`);
    } catch (error) {
      console.log(`Attempt ${attempt}/${maxAttempts}: deployment marker unavailable; waiting...`);
    }

    await sleep(15_000);
  }

  throw new Error("Production deployment did not become available within 10 minutes; IndexNow submission skipped.");
}

function runGit(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

function getChangedFiles() {
  try {
    if (isUsableSha(BEFORE_SHA) && isUsableSha(AFTER_SHA)) {
      const output = runGit(["diff", "--name-only", BEFORE_SHA, AFTER_SHA]);
      return output ? output.split(/\r?\n/).filter(Boolean) : [];
    }

    if (isUsableSha(AFTER_SHA)) {
      const output = runGit(["show", "--pretty=format:", "--name-only", AFTER_SHA]);
      return output ? output.split(/\r?\n/).filter(Boolean) : [];
    }
  } catch (error) {
    console.warn(`Could not read Git diff: ${error.message}`);
  }

  return [];
}

async function getSitemapUrls() {
  let xml;

  if (SITEMAP_FILE) {
    xml = readFileSync(SITEMAP_FILE, "utf8");
  } else {
    const response = await fetch(`${SITE_URL}/sitemap.xml?t=${Date.now()}`, {
      headers: { "User-Agent": "Converto-IndexNow/1.0" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Could not fetch sitemap: HTTP ${response.status}`);
    }

    xml = await response.text();
  }
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim());
  return [...new Set(urls)].filter((url) => url.startsWith(`${SITE_URL}/`) || url === `${SITE_URL}/`);
}

function selectChangedUrls(changedFiles, sitemapUrls) {
  const selected = new Set();
  const add = (path) => selected.add(`${SITE_URL}${normalizePath(path)}`);
  const addMatching = (predicate) => sitemapUrls.filter(predicate).forEach((url) => selected.add(url));
  const addAll = () => sitemapUrls.forEach((url) => selected.add(url));

  if (changedFiles.length === 0) {
    [
      "/",
      "/converter",
      "/convert/mp4-to-mp3",
      "/convert/webp-to-png",
      "/convert/png-to-jpg",
      "/convert/png-to-ico",
      "/convert/jpg-to-png",
      "/convert/mov-to-mp4",
      "/convert/mp4-to-gif",
      "/convert/flac-to-mp3",
      "/convert/tiff-to-jpg",
      "/convert/webm-to-mp4",
    ].forEach(add);
    return [...selected].filter((url) => sitemapUrls.includes(url));
  }

  const contentFiles = changedFiles.filter((file) => !file.endsWith(".md"));
  if (contentFiles.length === 0) return [];

  const globalFiles = new Set([
    "app/layout.tsx",
    "app/sitemap.ts",
    "app/robots.ts",
    "middleware.ts",
    "next.config.ts",
    "lib/siteUrl.ts",
    "lib/indexingPolicy.ts",
  ]);

  if (contentFiles.some((file) => globalFiles.has(file))) {
    addAll();
    return [...selected];
  }

  const indexNowBootstrapFiles = new Set([
    ".github/workflows/indexnow.yml",
    "scripts/submit-indexnow.mjs",
    `public/${INDEXNOW_KEY}.txt`,
  ]);

  if (contentFiles.some((file) => indexNowBootstrapFiles.has(file))) {
    [
      "/",
      "/converter",
      "/convert/mp4-to-mp3",
      "/convert/webp-to-png",
      "/convert/png-to-jpg",
      "/convert/png-to-ico",
      "/convert/jpg-to-png",
      "/convert/mov-to-mp4",
      "/convert/mp4-to-gif",
      "/convert/flac-to-mp3",
      "/convert/tiff-to-jpg",
      "/convert/webm-to-mp4",
    ].forEach(add);
  }

  for (const file of contentFiles) {
    if (file === "app/page.tsx") add("/");
    if (file === "app/converter/page.tsx") add("/converter");
    if (file === "app/about/page.tsx") add("/about");
    if (file === "app/contact/page.tsx") add("/contact");
    if (file === "app/privacy/page.tsx") add("/privacy");
    if (file === "app/terms/page.tsx") add("/terms");
    if (file === "app/cookies/page.tsx") add("/cookies");
    if (file === "app/pro/page.tsx") add("/pro");

    if (
      file === "app/convert/[slug]/page.tsx" ||
      file === "components/ConverterSection.tsx" ||
      file === "lib/converterContent.ts" ||
      file === "lib/conversionRules.ts" ||
      file === "lib/formatData.ts"
    ) {
      add("/converter");
      addMatching((url) => url.includes("/convert/") && !url.includes("/convert/pdf"));
    }

    if (file.startsWith("app/convert/pdf/") || file.includes("pdf")) {
      addMatching((url) => url.includes("/convert/pdf"));
    }

    if (file.startsWith("app/formats/") || file === "lib/formatData.ts") {
      addMatching((url) => url.includes("/formats"));
    }

    if (file.startsWith("app/compare/") || file === "lib/compareData.ts") {
      addMatching((url) => url.includes("/compare"));
    }

    if (file.startsWith("app/guides/") || file === "lib/editorialGuides.ts") {
      addMatching((url) => url.includes("/guides"));
    }

    if (file === "app/globals.css" || file.startsWith("components/")) {
      add("/");
      add("/converter");
      add("/formats");
      add("/compare");
      add("/guides");
    }

    if (file.startsWith("public/") && /(logo|favicon|manifest|og|icon)/i.test(file)) {
      add("/");
    }
  }

  return [...selected].filter((url) => sitemapUrls.includes(url));
}

async function verifyKeyFile() {
  if (DRY_RUN) return;

  const response = await fetch(`${KEY_LOCATION}?t=${Date.now()}`, {
    headers: { "User-Agent": "Converto-IndexNow/1.0" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`IndexNow key file is not public: HTTP ${response.status}`);
  }

  const body = (await response.text()).trim();
  if (body !== INDEXNOW_KEY) {
    throw new Error("IndexNow key file content does not match the configured key.");
  }
}

async function submitUrls(urls) {
  if (urls.length === 0) {
    console.log("No indexable content changes detected; nothing to submit.");
    return;
  }

  if (DRY_RUN) {
    console.log(`Dry run: ${urls.length} URL(s) would be submitted.`);
    urls.forEach((url) => console.log(`- ${url}`));
    return;
  }

  const payload = {
    host: new URL(SITE_URL).host,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "User-Agent": "Converto-IndexNow/1.0",
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();
  if (![200, 202].includes(response.status)) {
    throw new Error(`IndexNow returned HTTP ${response.status}${responseText ? `: ${responseText}` : ""}`);
  }

  console.log(`IndexNow accepted ${urls.length} URL(s) with HTTP ${response.status}.`);
  urls.forEach((url) => console.log(`- ${url}`));
}

async function main() {
  await waitForProductionDeployment();
  await verifyKeyFile();

  const sitemapUrls = await getSitemapUrls();
  const changedFiles = getChangedFiles();
  const urls = selectChangedUrls(changedFiles, sitemapUrls);

  console.log(`Detected ${changedFiles.length} changed file(s).`);
  await submitUrls(urls);
}

main().catch((error) => {
  console.error(`IndexNow submission failed: ${error.message}`);
  process.exitCode = 1;
});
