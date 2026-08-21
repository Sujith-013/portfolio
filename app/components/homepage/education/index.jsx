"use client";
// @flow strict
import { educations } from "@/utils/data/educations";
import { useSectionReveal } from "@/utils/hooks/use-section-reveal";
import { useRef } from "react";
import { BsPersonWorkspace } from "react-icons/bs";
import AnimationLottie from "../../helper/animation-lottie";
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div data-reveal="figure" className="flex justify-center items-start">
            <div className="w-3/4 h-3/4">
              <AnimationLottie animationPath="/lottie/study.json" />
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-6">
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
                      <div className="flex items-start gap-x-8 px-3 py-5">
                        <div className="text-text-tertiary transition-all duration-300 hover:scale-125">
                          <BsPersonWorkspace size={36} />
                        </div>
                        <div>
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
                    </div>
                  </Card>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;