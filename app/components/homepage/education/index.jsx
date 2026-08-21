"use client";
// @flow strict
import { educations } from "@/utils/data/educations";
import { useSectionReveal } from "@/utils/hooks/use-section-reveal";
import { useRef } from "react";
import Card from "../../helper/card";

function Education() {
  const scopeRef = useRef(null);
  useSectionReveal(scopeRef);

  return (
    <div ref={scopeRef} id="education" className="relative z-50 border-t my-12 lg:my-24 border-border">
      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex  items-center">
          <span className="w-24 h-[2px] bg-border-strong"></span>
          <h2 data-reveal="text" className="font-display bg-surface-raised w-fit text-text-primary p-2 px-5 text-xl rounded-md">
            Educations
          </h2>
          <span className="w-24 h-[2px] bg-border-strong"></span>
        </div>
      </div>

      <div className="py-8">
        {/* Single column, capped at the site's standard reading measure —
            was a 2-col grid with a decorative Lottie illustration filling
            the left column (a stock isometric graphic, off-palette and
            informationless). See docs/DESIGN-SYSTEM.md "Audit: AI-template
            visual clichés" for why it's gone. */}
        <div className="max-w-3xl flex flex-col gap-6">
          {
            educations.map(education => (
              <Card key={education.id}>
                <div data-reveal="text" className="p-3 relative text-text-primary">
                  <div className="flex justify-center items-center gap-2">
                    <p className="font-mono text-xs sm:text-sm text-accent">
                      {education.duration}
                    </p>
                    {education.status && (
                      <span className="font-mono text-[10px] sm:text-xs uppercase tracking-wide bg-surface-raised text-text-tertiary px-2 py-0.5 rounded-full">
                        {education.status}
                      </span>
                    )}
                  </div>
                  {/* A border rule marks the eyebrow/body boundary — replaces
                      the generic BsPersonWorkspace icon that used to sit here
                      on every card regardless of what the entry actually was.
                      See docs/DESIGN-SYSTEM.md "Audit: AI-template visual
                      clichés" for why. */}
                  <div className="border-t border-border px-3 py-5">
                    <h3 className="text-base sm:text-xl mb-2 font-medium text-text-primary">
                      {education.title}
                    </h3>
                    <p className="text-sm sm:text-base mb-3 text-text-secondary">{education.institution}</p>
                    {education.achievements?.length > 0 && (
                      <ul className="list-disc pl-4 flex flex-col gap-1.5">
                        {education.achievements.map((achievement, i) => (
                          <li key={i} className="text-xs sm:text-sm text-text-secondary">
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </Card>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Education;