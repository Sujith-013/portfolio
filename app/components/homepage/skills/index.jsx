"use client";
// @flow strict

import { skillsData } from "@/utils/data/skills";
import { skillsIconComponent, skillsImage, skillsMonogram } from "@/utils/skill-image";
import { useSectionReveal } from "@/utils/hooks/use-section-reveal";
import Image from "next/image";
import { useRef } from "react";
import Marquee from "react-fast-marquee";

function Skills() {
  const flatSkills = skillsData.flatMap((group) => group.skills);
  const scopeRef = useRef(null);
  useSectionReveal(scopeRef);

  return (
    <div ref={scopeRef} id="skills" className="relative z-50 border-t my-12 lg:my-24 border-border">
      <div className="w-[100px] h-[100px] bg-ink-500 rounded-full absolute top-6 left-[42%] translate-x-1/2 filter blur-3xl  opacity-20"></div>

      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-border-strong to-transparent  w-full" />
        </div>
      </div>

      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex  items-center">
          <span className="w-24 h-[2px] bg-border-strong"></span>
          <span data-reveal="text" className="font-display bg-surface-raised w-fit text-text-primary p-2 px-5 text-xl rounded-md">
            Skills
          </span>
          <span className="w-24 h-[2px] bg-border-strong"></span>
        </div>
      </div>

      <div data-reveal="figure" className="w-full my-12">
        <Marquee
          gradient={false}
          speed={80}
          pauseOnHover={true}
          pauseOnClick={true}
          delay={0}
          play={true}
          direction="left"
        >
          {flatSkills.map((skill, id) => {
            const icon = skillsImage(skill);
            const IconComponent = !icon ? skillsIconComponent(skill) : null;
            const monogram = !icon && !IconComponent ? skillsMonogram(skill) : null;
            return (
              <div className="w-36 min-w-fit h-fit flex flex-col items-center justify-center transition-all duration-500 m-3 sm:m-5 rounded-lg group relative hover:scale-[1.15] cursor-pointer"
                key={id}>
                <div className="h-full w-full rounded-lg border border-border bg-surface group-hover:border-accent transition-all duration-500">
                  <div className="flex -translate-y-[1px] justify-center">
                    <div className="w-3/4">
                      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-border-strong to-transparent" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-3 p-6">
                    {icon && (
                      <div className="h-8 sm:h-10">
                        <Image
                          src={icon.src}
                          alt={skill}
                          width={40}
                          height={40}
                          className="h-full w-auto rounded-lg"
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
                    <p className="font-mono text-text-primary text-sm sm:text-lg">
                      {skill}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </Marquee>
      </div>
    </div>
  );
};

export default Skills;