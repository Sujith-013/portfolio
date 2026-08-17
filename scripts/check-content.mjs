#!/usr/bin/env node
// Content/asset guardrail — run via `npm run check`.
//
// Validates utils/data/projects-data.js against the export spec in
// docs/CONTENT-TEMPLATE.md Part 2 and the schema every component in
// app/components/homepage/projects/ + app/components/helper/asset-placeholder.jsx
// actually reads. Two kinds of findings:
//
//   - ERRORS (exit code 1): something that's actually broken — a real asset
//     pointing at a file that isn't there, wrong dimensions, over budget,
//     a missing poster, a required field gone, a "real" asset that still
//     has TODO caption text. These are mistakes, not work-in-progress.
//   - INFO: how much of each project's content is still placeholder. Not a
//     failure — every project starts here, and staying here for a project
//     you haven't gotten to yet is expected, not a bug.
//
// A project is only held to the ERROR bar for a given field once it's
// opted in — either by editing its content past the default TODO strings,
// or by setting an individual asset's `placeholder: false`. Nothing here
// blocks you from running this constantly while four projects are still
// untouched and one is half-done.

import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { projectsData } from "../utils/data/projects-data.js";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PUBLIC_PROJECTS = path.join(ROOT, "public", "projects");

// Mirrors docs/CONTENT-TEMPLATE.md Part 2 exactly. Single source of truth
// for this script only — the table in the doc is the one humans read.
const SPEC = {
  hero: { width: 2400, height: 1350, maxBytes: 2 * 1024 * 1024, label: "hero" },
  cad: { width: 1600, height: 1200, maxBytes: 1.5 * 1024 * 1024, label: "CAD render" },
  simulation: { width: 1600, height: 900, maxBytes: 1.5 * 1024 * 1024, label: "simulation screenshot" },
  results: { width: 1600, height: 900, maxBytes: 1 * 1024 * 1024, label: "results plot" },
  // Video's spec is a cap ("≤1920×1080"), not an exact size like the others.
  video: { maxWidth: 1920, maxHeight: 1080, maxBytes: 8 * 1024 * 1024, label: "video" },
  poster: { maxLongEdge: 1600, maxBytes: 250 * 1024, label: "poster frame" },
};

const isTodo = (value) => typeof value === "string" && value.trim().toUpperCase().startsWith("TODO");
const isPositiveNumber = (value) => typeof value === "number" && Number.isFinite(value) && value > 0;

function formatBytes(n) {
  if (n >= 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(2)}MB`;
  return `${(n / 1024).toFixed(0)}KB`;
}

function checkProject(project, errors) {
  const fail = (msg) => errors.push(`project "${project.slug}": ${msg}`);
  const assetDir = path.join(PUBLIC_PROJECTS, project.slug ?? "");

  // --- Required schema fields (always enforced, regardless of content state) ---
  if (typeof project.id !== "number") fail(`"id" must be a number, got ${JSON.stringify(project.id)}`);
  if (typeof project.slug !== "string" || !project.slug) fail(`"slug" must be a non-empty string`);
  if (typeof project.domain !== "string" || !project.domain) fail(`"domain" must be a non-empty string`);
  if (typeof project.name !== "string" || !project.name) fail(`"name" must be a non-empty string`);
  if (typeof project.nameFull !== "string") fail(`"nameFull" must be a string`);
  if (typeof project.context !== "string") fail(`"context" must be a string`);
  if (typeof project.description !== "string") fail(`"description" must be a string`);
  if (!Array.isArray(project.tools)) fail(`"tools" must be an array (use [] if none yet)`);
  if (typeof project.result !== "string") fail(`"result" must be a string (use '' if none — this is the correct empty state, not a gap)`);
  if (!Array.isArray(project.assets)) fail(`"assets" must be an array`);

  // --- Hero ---
  const hero = project.hero;
  if (!hero || typeof hero !== "object") {
    fail(`"hero" is missing or not an object`);
  } else {
    if (hero.width !== SPEC.hero.width || hero.height !== SPEC.hero.height) {
      fail(
        `hero declared dimensions ${hero.width}x${hero.height} don't match the spec (${SPEC.hero.width}x${SPEC.hero.height}) — docs/CONTENT-TEMPLATE.md Part 2`,
      );
    }
    if (hero.placeholder === false) {
      checkRealAsset(project, { ...hero, category: "hero" }, assetDir, errors, "hero");
    }
  }

  // --- Content-completeness consistency: once nameFull is filled in, the
  // rest of the required content fields are expected to follow, not lag
  // behind — a half-filled project is more likely a forgotten field than
  // an intentional state. ---
  const contentStarted = !isTodo(project.nameFull);
  if (contentStarted) {
    if (isTodo(project.context)) fail(`"nameFull" is filled in but "context" is still a TODO placeholder`);
    if (isTodo(project.description)) fail(`"nameFull" is filled in but "description" is still a TODO placeholder`);
    if (project.tools.length === 0) fail(`"nameFull" is filled in but "tools" is still empty`);
  }

  // --- Assets ---
  const seenVideoWithoutPoster = [];
  (project.assets ?? []).forEach((asset, i) => {
    const where = `asset #${i} (${asset?.category ?? "unknown category"})`;
    const validCategories = ["cad", "simulation", "results", "video", "code"];
    if (!validCategories.includes(asset?.category)) {
      fail(`${where}: "category" must be one of ${validCategories.join(", ")}, got ${JSON.stringify(asset?.category)}`);
      return;
    }
    if (typeof asset.placeholder !== "boolean") {
      fail(`${where}: "placeholder" must be a boolean`);
      return;
    }
    if (asset.category !== "code") {
      const spec = SPEC[asset.category];
      const wOk = asset.category === "video" ? asset.width <= spec.maxWidth : asset.width === spec.width;
      const hOk = asset.category === "video" ? asset.height <= spec.maxHeight : asset.height === spec.height;
      if (!isPositiveNumber(asset.width) || !isPositiveNumber(asset.height) || !wOk || !hOk) {
        const expected =
          asset.category === "video"
            ? `<= ${spec.maxWidth}x${spec.maxHeight}`
            : `exactly ${spec.width}x${spec.height}`;
        fail(`${where}: declared dimensions ${asset.width}x${asset.height} should be ${expected} — docs/CONTENT-TEMPLATE.md Part 2`);
      }
    }
    if (typeof asset.caption !== "string") {
      fail(`${where}: "caption" must be a string`);
    }

    if (asset.placeholder === false) {
      checkRealAsset(project, asset, assetDir, errors, where);
      if (asset.category === "video" && !asset.poster) {
        seenVideoWithoutPoster.push(where);
      }
    }
  });
  seenVideoWithoutPoster.forEach((where) =>
    fail(`${where}: real video has no "poster" field — every real video needs a poster frame`),
  );
}

function checkRealAsset(project, asset, assetDir, errors, where) {
  const fail = (msg) => errors.push(`project "${project.slug}", ${where}: ${msg}`);

  if (asset.category === "code") {
    if (typeof asset.snippet !== "string" || !asset.snippet.trim()) {
      fail(`marked placeholder: false but "snippet" is missing or empty`);
    }
    if (isTodo(asset.caption)) fail(`marked placeholder: false but "caption" is still a TODO placeholder`);
    return;
  }

  if (!asset.file) {
    fail(`marked placeholder: false but has no "file"`);
    return;
  }

  const filePath = path.join(assetDir, asset.file);
  if (!existsSync(filePath)) {
    fail(`file missing at public/projects/${project.slug}/${asset.file}`);
    return { filePath, ok: false };
  }

  const stat = statSync(filePath);
  const spec = SPEC[asset.category];
  if (stat.size > spec.maxBytes) {
    fail(
      `${spec.label} file size ${formatBytes(stat.size)} exceeds the ${formatBytes(spec.maxBytes)} max for "${asset.category}" — public/projects/${project.slug}/${asset.file}`,
    );
  }

  if (isTodo(asset.caption)) fail(`marked placeholder: false but "caption" is still a TODO placeholder`);
  if (asset.alt !== undefined && isTodo(asset.alt)) fail(`marked placeholder: false but "alt" is still a TODO placeholder`);

  return { filePath, ok: true, size: stat.size };
}

// Real pixel-dimension checks need to read each image file, which is async
// (sharp) — done as a second pass over the already-validated real assets so
// the synchronous structural checks above stay simple to read.
async function checkImageDimensions(projectsList, errors) {
  const jobs = [];
  for (const project of projectsList) {
    const assetDir = path.join(PUBLIC_PROJECTS, project.slug ?? "");
    const all = [{ ...project.hero, category: "hero" }, ...(project.assets ?? [])];
    for (const asset of all) {
      if (asset.placeholder !== false || !asset.file) continue;

      // Pixel-dimension check applies to real images only — video has no
      // reliable dependency-free way to probe actual pixel size here, so
      // its declared-vs-spec check in checkProject is as far as this goes.
      if (asset.category !== "code" && asset.category !== "video") {
        const filePath = path.join(assetDir, asset.file);
        if (existsSync(filePath)) {
          jobs.push(
            sharp(filePath)
              .metadata()
              .then((meta) => {
                if (meta.width !== asset.width || meta.height !== asset.height) {
                  errors.push(
                    `project "${project.slug}": public/projects/${project.slug}/${asset.file} is actually ${meta.width}x${meta.height}px, but the data file declares ${asset.width}x${asset.height} — the file and the manifest entry have drifted apart (wrong export, or wrong dimensions typed in)`,
                  );
                }
              })
              .catch((err) => {
                errors.push(
                  `project "${project.slug}": couldn't read public/projects/${project.slug}/${asset.file} as an image (${err.message}) — file may be corrupt or the wrong format`,
                );
              }),
          );
        } // else: already reported as a missing-file error by checkRealAsset
      }

      // Poster frames get the same size-cap + long-edge-cap treatment,
      // independent of the image-dimension check above — this must run for
      // real video assets specifically, which the block above skips.
      if (asset.category === "video" && asset.poster) {
        const posterPath = path.join(assetDir, asset.poster);
        if (!existsSync(posterPath)) {
          errors.push(`project "${project.slug}": poster file missing at public/projects/${project.slug}/${asset.poster}`);
          continue;
        }
        const stat = statSync(posterPath);
        if (stat.size > SPEC.poster.maxBytes) {
          errors.push(
            `project "${project.slug}": poster frame size ${formatBytes(stat.size)} exceeds the ${formatBytes(SPEC.poster.maxBytes)} max — public/projects/${project.slug}/${asset.poster}`,
          );
        }
        jobs.push(
          sharp(posterPath)
            .metadata()
            .then((meta) => {
              const longEdge = Math.max(meta.width ?? 0, meta.height ?? 0);
              if (longEdge > SPEC.poster.maxLongEdge) {
                errors.push(
                  `project "${project.slug}": poster frame is ${meta.width}x${meta.height}px, longest edge ${longEdge}px exceeds the ${SPEC.poster.maxLongEdge}px max — public/projects/${project.slug}/${asset.poster}`,
                );
              }
            })
            .catch((err) => {
              errors.push(
                `project "${project.slug}": couldn't read public/projects/${project.slug}/${asset.poster} as an image (${err.message}) — poster file may be corrupt or the wrong format`,
              );
            }),
        );
      }
    }
  }
  await Promise.all(jobs);
}

function contentSummary(project) {
  const fields = [project.nameFull, project.context, project.description];
  const todoCount = fields.filter(isTodo).length + (project.tools.length === 0 ? 1 : 0);
  if (todoCount === 4) return "not started";
  if (todoCount === 0) return "content complete";
  return `in progress (${4 - todoCount}/4 content fields filled)`;
}

function assetSummary(project) {
  const all = [project.hero, ...(project.assets ?? [])];
  const real = all.filter((a) => a?.placeholder === false).length;
  return `${real}/${all.length} assets real`;
}

async function main() {
  const errors = [];
  const slugs = new Set();

  for (const project of projectsData) {
    if (project.slug) {
      if (slugs.has(project.slug)) errors.push(`duplicate slug "${project.slug}" — every project needs a unique slug`);
      slugs.add(project.slug);
    }
    checkProject(project, errors);
  }
  await checkImageDimensions(projectsData, errors);

  console.log("Checking project content and assets against docs/CONTENT-TEMPLATE.md...\n");

  const bySlug = new Map(projectsData.filter((p) => p.slug).map((p) => [p.slug, []]));
  const unassigned = [];
  for (const err of errors) {
    const slug = err.match(/^project "([^"]+)"/)?.[1];
    if (slug && bySlug.has(slug)) bySlug.get(slug).push(err.replace(/^project "[^"]+"(?:,\s*|:\s*)/, ""));
    else unassigned.push(err);
  }

  for (const project of projectsData) {
    const projectErrors = project.slug ? (bySlug.get(project.slug) ?? []) : [];
    const status = projectErrors.length === 0 ? "✅" : "❌";
    console.log(`${status} ${project.slug ?? `(no slug, id ${project.id})`} — ${contentSummary(project)}, ${assetSummary(project)}`);
    for (const err of projectErrors) {
      console.log(`   - ${err}`);
    }
  }

  if (unassigned.length) {
    console.log("\nOther:");
    for (const err of unassigned) console.log(`   - ${err}`);
  }

  console.log("");
  if (errors.length === 0) {
    console.log(`${projectsData.length} projects checked, 0 errors. Placeholder content is expected — that's not a failure.`);
    process.exit(0);
  } else {
    console.log(`${errors.length} error${errors.length === 1 ? "" : "s"} across ${projectsData.length} projects. Fix the lines above, then rerun.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("check-content.mjs crashed unexpectedly (this is a bug in the script itself, not your content):");
  console.error(err);
  process.exit(1);
});
