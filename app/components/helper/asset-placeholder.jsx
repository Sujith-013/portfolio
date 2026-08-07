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
      className={`relative flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border-strong bg-surface text-text-tertiary ${className}`}
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
 */
export function CodePlaceholder({ asset, dataReveal, className = "" }) {
  if (asset?.placeholder === false && asset?.snippet) {
    return (
      <div
        data-reveal={dataReveal}
        className={`rounded-lg border border-border bg-surface p-4 overflow-x-auto ${className}`}
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
      className={`flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border-strong bg-surface text-text-tertiary p-8 min-h-[10rem] ${className}`}
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
 */
export function ProjectAsset({ asset, slug, category, dataReveal, className = "", priority = false, sizes }) {
  const isReal = asset?.placeholder === false && asset?.file;

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

  if (category === "video") {
    const posterSrc = asset.poster ? `/projects/${slug}/${asset.poster}` : undefined;
    return (
      <video
        data-reveal={dataReveal}
        className={`w-full rounded-lg border border-border bg-surface ${className}`}
        style={{ aspectRatio: asset.width && asset.height ? `${asset.width} / ${asset.height}` : undefined }}
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
    );
  }

  return (
    <Image
      data-reveal={dataReveal}
      className={`w-full h-auto rounded-lg border border-border object-cover ${className}`}
      src={src}
      alt={asset.alt || asset.caption || ""}
      width={asset.width}
      height={asset.height}
      priority={priority}
      sizes={sizes}
    />
  );
}
