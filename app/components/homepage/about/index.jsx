"use client";
// @flow strict

import { personalData } from "@/utils/data/personal-data";
import { useSectionReveal } from "@/utils/hooks/use-section-reveal";
import Image from "next/image";
import { useRef } from "react";


function AboutSection() {
  const scopeRef = useRef(null);
  useSectionReveal(scopeRef);

  return (
    <div ref={scopeRef} id="about" className="my-12 lg:my-24 relative">
      {/* Decorative — the real, always-visible section heading is the
          "Who I am?" <h2> below; this rotated tab repeats the same
          information for desktop-only visual rhythm, so it's hidden from
          assistive tech rather than announced as a second heading. */}
      <div aria-hidden="true" className="hidden lg:flex flex-col items-center absolute top-16 -right-8">
        <span className="font-display bg-surface-raised w-fit text-text-primary rotate-90 p-2 px-5 text-xl rounded-md">
          ABOUT ME
        </span>
        <span className="h-36 w-[2px] bg-border-strong"></span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        <div className="order-2 lg:order-1">
          <h2 data-reveal="text" className="font-display font-medium mb-5 text-accent text-xl uppercase">
            Who I am?
          </h2>
          <p data-reveal="text" className="text-text-secondary text-sm lg:text-lg">
            {personalData.description}
          </p>
        </div>
        <div className="flex justify-center order-1 lg:order-2">
          <Image
            data-reveal="figure"
            src={personalData.profile}
            width={280}
            height={280}
            alt="Sujith"
            className="rounded-lg transition-all duration-1000 grayscale hover:grayscale-0 hover:scale-110 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
