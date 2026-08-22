"use client";
// @flow strict

import { personalData } from "@/utils/data/personal-data";
import { useSectionReveal } from "@/utils/hooks/use-section-reveal";
import Link from "next/link";
import { useRef } from "react";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { MdDownload } from "react-icons/md";
import { RiContactsFill } from "react-icons/ri";

function HeroSection() {
  const scopeRef = useRef(null);
  // The h1 (name/title) deliberately carries no data-reveal — it's the
  // hero's LCP-critical content and must be visible and stable on first
  // paint per docs/PRD.md §5, not animated in from invisible.
  useSectionReveal(scopeRef);

  return (
    <section ref={scopeRef} className="relative flex flex-col items-center justify-between py-4 lg:py-12">
      <div className="flex w-full max-w-3xl flex-col items-start justify-center p-2 pb-12 md:pb-10 lg:pt-10">
        <h1 className="font-display text-3xl font-bold leading-10 text-text-primary md:font-extrabold lg:text-display">
          Hello, <br />
          This is {' '}
          <span className="text-text-primary">{personalData.name}</span>
          {` , I'm a Professional `}
          <span className="text-accent">{personalData.designation}</span>
          .
        </h1>

        <div data-reveal="text" className="my-12 flex items-center gap-5">
          <Link
            href={personalData.github}
            target='_blank'
            aria-label="GitHub"
            className="rounded text-text-secondary hover:text-accent outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            <BsGithub size={30} />
          </Link>
          <Link
            href={personalData.linkedIn}
            target='_blank'
            aria-label="LinkedIn"
            className="rounded text-text-secondary hover:text-accent outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            <BsLinkedin size={30} />
          </Link>
        </div>

        <div data-reveal="text" className="flex items-center gap-3">
          <Link href="#contact" className="border border-border-strong rounded-full hover:border-accent">
            <button className="px-3 text-xs md:px-8 py-3 md:py-4 bg-canvas rounded-full border-none text-center md:text-sm font-medium uppercase tracking-wider text-text-primary no-underline md:font-semibold flex items-center gap-1 hover:text-accent">
              <span>Contact me</span>
              <RiContactsFill size={16} />
            </button>
          </Link>

          <Link className="flex items-center gap-1 rounded-full bg-accent px-3 md:px-8 py-3 md:py-4 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-ink-950 no-underline hover:bg-accent-hover hover:no-underline md:font-semibold" role="button" target="_blank" href={personalData.resume}
          >
            <span>Get Resume</span>
            <MdDownload size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
