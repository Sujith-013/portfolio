"use client";
// @flow strict

import { skillsData } from "@/utils/data/skills";
import { skillsIconComponent, skillsImage, skillsMonogram } from "@/utils/skill-image";
import { useSectionReveal } from "@/utils/hooks/use-section-reveal";
import Image from "next/image";
import { useRef } from "react";

function SkillTile({ skill }) {
  const icon = skillsImage(skill);
  const IconComponent = !icon ? skillsIconComponent(skill) : null;
  const monogram = !icon && !IconComponent ? skillsMonogram(skill) : null;

  // cursor-default already says this tile isn't interactive — it had a
  // hover:scale + group-hover:border-accent animation anyway, motion with
  // nothing behind it to confirm. See docs/DESIGN-SYSTEM.md "Audit: motion
  // restraint" for why it's gone.
  return (
    <div className="w-full h-fit flex flex-col items-center justify-center rounded-md cursor-default">
      <div className="h-full w-full rounded-md border border-border bg-surface">
        <div className="flex flex-col items-center justify-center gap-3 p-4 sm:p-6">
          {icon && (
            <div className="h-8 sm:h-10">
              <Image
                src={icon.src}
                alt={skill}
                width={40}
                height={40}
                className="h-full w-auto rounded-md"
              />
            </div>
          )}
          {IconComponent && (
            <div className="h-8 sm:h-10 flex items-center justify-center text-text-secondary">
              <IconComponent size={32} />
            </div>
          )}
          {monogram && (
            <div className="h-8 sm:h-10 w-8 sm:w-10 flex items-center justify-center rounded border border-border-strong bg-surface-raised">
              <span className="font-mono text-[10px] sm:text-xs font-medium text-text-secondary">
                {monogram}
              </span>
            </div>
          )}
          <p className="font-mono text-text-primary text-sm sm:text-lg text-center">
            {skill}
          </p>
        </div>
      </div>
    </div>
  );
}

function Skills() {
  const scopeRef = useRef(null);
  useSectionReveal(scopeRef);

  return (
    <div ref={scopeRef} id="skills" className="relative z-50 border-t my-12 lg:my-24 border-border">
      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex  items-center">
          <span className="w-24 h-[2px] bg-border-strong"></span>
          <h2 data-reveal="text" className="font-display bg-surface-raised w-fit text-text-primary p-2 px-5 text-xl rounded-md">
            Skills
          </h2>
          <span className="w-24 h-[2px] bg-border-strong"></span>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:gap-12 my-8">
        {skillsData.map((group) => (
          <div key={group.category} data-reveal="figure">
            <h3 className="font-mono text-xs sm:text-sm uppercase tracking-wider text-text-tertiary mb-4">
              {group.category}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
              {group.skills.map((skill) => (
                <SkillTile key={skill} skill={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
