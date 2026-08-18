"use client";
// @flow strict

import { CodePlaceholder, ProjectAsset } from "@/app/components/helper/asset-placeholder";
import { useSectionReveal } from "@/utils/hooks/use-section-reveal";
import Link from "next/link";
import { useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { ProjectHeader } from "./project-header";

const CATEGORY_TITLES = {
  cad: "Design & CAD",
  simulation: "Simulation & Analysis",
  results: "Results & Data",
  video: "Video",
  code: "Code",
};

export function ProjectDetailView({ project, grouped }) {
  const scopeRef = useRef(null);
  useSectionReveal(scopeRef);

  return (
    <div ref={scopeRef} className="py-12 lg:py-16">
      <Link
        data-reveal="text"
        href="/#projects"
        className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-accent transition-colors duration-300 mb-8 no-underline"
      >
        <FaArrowLeft size={14} />
        <span>Back to portfolio</span>
      </Link>

      <ProjectHeader project={project} headingLevel="h1" />

      <ProjectAsset
        asset={project.hero}
        slug={project.slug}
        category="hero"
        dataReveal="figure"
        className="w-full mb-8"
        priority={true}
        sizes="100vw"
      />

      <p data-reveal="text" className="text-text-secondary text-sm lg:text-base max-w-3xl mb-8">
        {project.description}
      </p>

      <div data-reveal="text" className="flex flex-wrap gap-2 mb-12">
        {(project.tools.length ? project.tools : ["TODO: tools"]).map((tool, i) => (
          <span
            key={i}
            className="font-mono text-xs bg-surface-raised border border-border text-text-tertiary px-2 py-1 rounded"
          >
            {tool}
          </span>
        ))}
      </div>

      {grouped.map(({ category, items }) => (
        <div key={category} className="mb-12">
          <h2 data-reveal="text" className="font-display text-lg text-text-primary mb-4 border-t border-border pt-6">
            {CATEGORY_TITLES[category] ?? category}
          </h2>
          {/*
            sm:only:col-span-2 — a category with exactly one asset (results,
            video and code all default to 1 per demoAssets()) would otherwise
            sit left-aligned with a bare gap in the right column on a 2-col
            grid ≥640px. `only:` (Tailwind's :only-child variant, same family
            as the `first:`/`last:` already used elsewhere) makes a lone item
            span the full row instead — a two-item category is unaffected.
            Found and fixed while building the aircraft-design reference
            implementation (docs/START-HERE.md §0).
          */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {items.map((asset, i) =>
              category === "code" ? (
                <CodePlaceholder key={i} asset={asset} dataReveal="figure" className="sm:only:col-span-2" />
              ) : (
                <div key={i} className="sm:only:col-span-2">
                  <ProjectAsset
                    asset={asset}
                    slug={project.slug}
                    category={category}
                    dataReveal="figure"
                    priority={false}
                    sizes={items.length === 1 ? "100vw" : "(min-width: 640px) 50vw, 100vw"}
                  />
                  <p className="text-xs text-text-tertiary mt-2 font-mono">{asset.caption}</p>
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
