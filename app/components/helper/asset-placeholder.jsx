// @flow strict

import Image from "next/image";
import { FaPlay } from "react-icons/fa";

const CATEGORY_LABELS = {
  cad: "DESIGN & CAD",
  simulation: "SIMULATION & ANALYSIS",
  results: "RESULTS & DATA",
  video: "VIDEO",
  hero: "HERO IMAGE",
};

/**
 * Placeholder for an image or video slot at its intended export dimensions
 * — used until docs/ASSET-CHECKLIST.md's real assets exist. Deliberately
 * plain (dashed border, no accent — this is a layout stand-in, not data)
 * so it reads unmistakably as "not real content" while still letting the
 * intended aspect ratio and pixel size be judged on the live page.
 */
export function AssetPlaceholder({ category = "cad", width, height, dataReveal, className = "" }) {
  const label = CATEGORY_LABELS[category] ?? category.toUpperCase();

  return (
    <div
      data-reveal={dataReveal}
      className={`relative flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border-strong bg-surface text-text-tertiary ${className}`}
      style={{ aspectRatio: width && height ? `${width} / ${height}` : undefined }}
    >
      {category === "video" && <FaPlay size={20} className="opacity-60" />}
      <span className="font-mono text-[10px] sm:text-xs uppercase tracking-wide text-center px-2">
        {label}
        {width && height && (
          <>
            <br />
            {width} &times; {height}
          </>
        )}
      </span>
    </div>
  );
}

/**
 * Placeholder for a real-code-snippet slot — text, not an image, so it
 * gets a block treatment instead of a fixed aspect-ratio box. Renders the
 * real snippet once one exists (asset.placeholder === false, per the same
 * opt-in convention ProjectAsset below uses), the dashed placeholder
 * otherwise.
 *
 * Requires a genuine non-empty string, not just a truthy value — a stray
 * `snippet: {}` or `snippet: ''` left behind while editing the manifest by
 * hand would otherwise either throw (React can't render a raw object as a
 * child) or silently render an empty block. Falling back to the placeholder
 * is the same "never crash, always degrade" rule ProjectAsset uses below.
 */
export function CodePlaceholder({ asset, dataReveal, className = "" }) {
  const hasRealSnippet =
    asset?.placeholder === false && typeof asset?.snippet === "string" && asset.snippet.trim().length > 0;

  if (asset?.placeholder === false && !hasRealSnippet && process.env.NODE_ENV !== "production") {
    console.error(
      'CodePlaceholder: asset has placeholder: false but "snippet" is missing, empty, or not a string — rendering the placeholder block instead of crashing or showing nothing. Asset:',
      asset,
    );
  }

  if (hasRealSnippet) {
    return (
      <div
        data-reveal={dataReveal}
        className={`rounded-md border border-border bg-surface p-4 overflow-x-auto ${className}`}
      >
        {asset.language && (
          <p className="font-mono text-[10px] uppercase tracking-wide text-text-tertiary mb-2">
            {asset.language}
          </p>
        )}
        <pre className="font-mono text-xs text-text-secondary whitespace-pre">
          <code>{asset.snippet}</code>
        </pre>
        {asset.codeUrl && (
          <a
            href={asset.codeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-3 text-xs text-accent hover:text-accent-hover underline"
          >
            View full source
          </a>
        )}
      </div>
    );
  }

  return (
    <div
      data-reveal={dataReveal}
      className={`flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border-strong bg-surface text-text-tertiary p-8 min-h-[10rem] ${className}`}
    >
      <span className="font-mono text-[10px] sm:text-xs uppercase tracking-wide text-center">
        CODE SNIPPET
        <br />
        monospace block, ~10-20 lines
      </span>
    </div>
  );
}

/**
 * Renders a real project asset once it's wired to a real file
 * (asset.placeholder === false), the dimensioned grey box otherwise —
 * built ahead of any real asset landing so that "wiring in" a project per
 * docs/ASSET-CHECKLIST.md is a pure data edit, not a code change, and the
 * loading-strategy discipline from docs/PRD.md §10.4-10.5 (priority vs.
 * lazy, sizes, video preload/poster/click-to-play) is already correct
 * rather than something to remember to build later under time pressure.
 *
 * `priority` should only be true for a page's first-viewport hero image
 * (the /projects/[slug] detail page's own hero) — never for the homepage
 * showcase heroes, which stay lazy per §10.4's explicit "none should be
 * marked priority" rule for below-the-fold homepage imagery.
 *
 * A real (non-placeholder) entry also needs a valid, finite, positive
 * `width`/`height` — not just a `file`. next/image throws a hard render
 * error ("Image with src ... is missing required 'width' property") for a
 * non-fill image with a missing/undefined size, which turns one bad manifest
 * edit into a 500 on the whole route instead of one broken tile — confirmed
 * live in dev while building this guard. Falling back to the placeholder box
 * for a malformed "real" entry is the same choice already made everywhere
 * else in this file: never crash, always degrade to something visibly
 * unfinished instead.
 *
 * Real image/video assets get a loading state: an inset skeleton tone
 * (bg-surface-raised, motion-safe:animate-pulse) sits behind the media in
 * the same aspect-ratio box the real asset will fill. This is pure CSS,
 * not a load event handled in JS — an <img> (and, once a poster is set,
 * the poster paints the same way) is transparent until it has something to
 * paint, so the skeleton simply shows through until the real pixels cover
 * it, with no state to get stuck in. That means it needs no "use client",
 * degrades to the always-correct native img/video behavior if JS never
 * runs at all, and the exact box size is reserved up front from the
 * manifest's width/height — nothing shifts when the asset finishes
 * loading. motion-safe: keeps the pulse itself off under reduced motion,
 * leaving a plain static tone. See docs/DESIGN-SYSTEM.md "Audit: loading
 * states" for why this replaced shipping with none at all.
 */
const SKELETON = <div className="absolute inset-0 bg-surface-raised motion-safe:animate-pulse" aria-hidden="true" />;

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export function ProjectAsset({ asset, slug, category, dataReveal, className = "", priority = false, sizes }) {
  const isReal =
    asset?.placeholder === false &&
    !!asset?.file &&
    isFiniteNumber(asset?.width) &&
    isFiniteNumber(asset?.height);

  if (asset?.placeholder === false && !isReal && process.env.NODE_ENV !== "production") {
    console.error(
      `ProjectAsset: "${slug}" has an asset with placeholder: false but a missing file/width/height — rendering the placeholder box instead of crashing. Run "npm run check" to catch this before it reaches the page. Asset:`,
      asset,
    );
  }

  if (!isReal) {
    return (
      <AssetPlaceholder
        category={category}
        width={asset?.width}
        height={asset?.height}
        dataReveal={dataReveal}
        className={className}
      />
    );
  }

  const src = `/projects/${slug}/${asset.file}`;
  const aspectRatio = `${asset.width} / ${asset.height}`;

  if (category === "video") {
    const posterSrc = asset.poster ? `/projects/${slug}/${asset.poster}` : undefined;
    return (
      <div
        data-reveal={dataReveal}
        className={`relative overflow-hidden rounded-md border border-border bg-surface ${className}`}
        style={{ aspectRatio }}
      >
        {SKELETON}
        <video
          className="relative block w-full h-full object-cover"
          controls
          preload="none"
          poster={posterSrc}
          // Click-to-play by default per docs/PRD.md §10.5 — no autoplay,
          // no loop. That means the reduced-motion rule is satisfied
          // structurally: nothing here ever plays without the visitor
          // pressing play, under any motion preference.
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
    );
  }

  return (
    <div
      data-reveal={dataReveal}
      className={`relative overflow-hidden rounded-md border border-border bg-surface ${className}`}
      style={{ aspectRatio }}
    >
      {SKELETON}
      {/* fill (not width/height) so next/image's own absolute-positioned
          output stacks over the skeleton by DOM order alone, and sizes
          itself off the wrapper's aspect-ratio box exactly — no separate
          width/height math that could drift from the wrapper's ratio and
          trip next/image's distortion warning. */}
      <Image
        className="object-cover"
        src={src}
        alt={asset.alt || asset.caption || ""}
        fill
        priority={priority}
        sizes={sizes}
      />
    </div>
  );
}
