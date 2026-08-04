// @flow strict

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
 * gets a block treatment instead of a fixed aspect-ratio box.
 */
export function CodePlaceholder({ dataReveal, className = "" }) {
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
