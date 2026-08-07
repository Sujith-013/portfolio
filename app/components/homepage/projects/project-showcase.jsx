"use client";
// @flow strict

import { ProjectAsset } from "@/app/components/helper/asset-placeholder";
import { useSectionReveal } from "@/utils/hooks/use-section-reveal";
import Link from "next/link";
import { useRef } from "react";
import { FaArrowRight } from "react-icons/fa";
import { ProjectHeader } from "./project-header";

/**
 * One full landing-page section per project — replaces the old fake
 * terminal card stack. This is the largest, most visually weighted
 * section on the page now (see docs/PRD.md §9): one real, large hero
 * image (not a thumbnail), the narrative, and a link to the full
 * captioned gallery at /projects/[slug].
 */
export function ProjectShowcase({ project, index }) {
  const scopeRef = useRef(null);
  useSectionReveal(scopeRef);

  return (
    <div
      ref={scopeRef}
      className="py-12 lg:py-16 border-t border-border first:border-t-0 first:pt-0"
    >
      <ProjectHeader project={project} index={index} headingLevel="h3" />

      <ProjectAsset
        asset={project.hero}
        slug={project.slug}
        category="hero"
        dataReveal="figure"
        className="w-full mb-6"
        priority={false}
        sizes="100vw"
      />

      <p data-reveal="text" className="text-text-secondary text-sm lg:text-base mb-4 max-w-3xl">
        {project.description}
      </p>

      <div data-reveal="text" className="flex flex-wrap gap-2 mb-6">
        {(project.tools.length ? project.tools : ["TODO: tools"]).map((tool, i) => (
          <span
            key={i}
            className="font-mono text-xs bg-surface-raised border border-border text-text-tertiary px-2 py-1 rounded"
          >
            {tool}
          </span>
        ))}
      </div>

      <Link
        data-reveal="text"
        href={`/projects/${project.slug}`}
        className="inline-flex items-center gap-1 hover:gap-3 rounded-full border border-border-strong px-5 py-2.5 text-xs sm:text-sm font-medium uppercase tracking-wider text-text-primary no-underline transition-all duration-200 ease-out hover:text-accent hover:border-accent"
      >
        <span>View full project</span>
        <FaArrowRight size={14} />
      </Link>
    </div>
  );
}
