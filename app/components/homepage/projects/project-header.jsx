// @flow strict

/**
 * Shared header block (eyebrow + title + context + result) used by both
 * the landing-page showcase and the /projects/[slug] detail page, so the
 * two don't drift apart. Plain markup only — data-reveal attributes are
 * inert HTML here; the parent that renders this owns the useSectionReveal
 * call and scope.
 */
export function ProjectHeader({ project, index }) {
  return (
    <div>
      {typeof index === "number" && (
        <p data-reveal="text" className="font-mono text-xs sm:text-sm text-text-tertiary uppercase tracking-wide mb-2">
          {`Project ${String(index + 1).padStart(2, "0")}`}
        </p>
      )}
      <h2 data-reveal="text" className="font-display text-2xl md:text-3xl text-text-primary mb-2">
        {project.nameFull}
      </h2>
      <p data-reveal="text" className="font-mono text-xs sm:text-sm text-text-tertiary mb-3">
        {project.context}
      </p>
      {project.result && (
        <p data-reveal="text" className="text-accent font-medium mb-4">
          {project.result}
        </p>
      )}
    </div>
  );
}
