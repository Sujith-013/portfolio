// @flow strict

/**
 * Shared header block (eyebrow + title + context + result) used by both
 * the landing-page showcase and the /projects/[slug] detail page, so the
 * two don't drift apart. Plain markup only — data-reveal attributes are
 * inert HTML here; the parent that renders this owns the useSectionReveal
 * call and scope.
 *
 * headingLevel is configurable because the two call sites need different
 * levels for a correct document outline: on the homepage this title is a
 * subsection under the page's own "Projects" <h2> (so h3), but on the
 * standalone /projects/[slug] route there is no other heading on the page
 * at all — this title needs to BE that page's <h1>, not start at h2 with
 * no h1 above it.
 */
export function ProjectHeader({ project, index, headingLevel = "h2" }) {
  const Heading = headingLevel;

  return (
    <div>
      {typeof index === "number" && (
        <p data-reveal="text" className="font-mono text-xs sm:text-sm text-text-tertiary uppercase tracking-wide mb-2">
          {`Project ${String(index + 1).padStart(2, "0")}`}
        </p>
      )}
      <Heading data-reveal="text" className="font-display text-2xl md:text-3xl text-text-primary mb-2">
        {project.nameFull}
      </Heading>
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
