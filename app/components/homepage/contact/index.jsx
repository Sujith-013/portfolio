"use client";
// @flow strict
import { personalData } from '@/utils/data/personal-data';
import { useSectionReveal } from '@/utils/hooks/use-section-reveal';
import Link from 'next/link';
import { useRef } from 'react';
import { BiLogoLinkedin } from "react-icons/bi";
import { IoLogoGithub } from "react-icons/io";
import { MdAlternateEmail } from "react-icons/md";
import ContactForm from './contact-form';

function ContactSection() {
  const scopeRef = useRef(null);
  useSectionReveal(scopeRef);

  return (
    <div ref={scopeRef} id="contact" className="my-12 lg:my-24 relative mt-24 text-text-primary">
      {/* Decorative — the real, always-visible section heading is
          ContactForm's "Contact with me" <h2>; this rotated tab repeats
          the same information for desktop-only visual rhythm, so it's
          hidden from assistive tech rather than announced as a second,
          redundant heading. */}
      <div aria-hidden="true" className="hidden lg:flex flex-col items-center absolute top-24 -right-8">
        <span className="font-display bg-surface-raised w-fit text-text-primary rotate-90 p-2 px-5 text-xl rounded-md">
          CONTACT
        </span>
        <span className="h-36 w-[2px] bg-border-strong"></span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div data-reveal="text">
          <ContactForm />
        </div>
        <div data-reveal="text" className="lg:w-3/4 ">
          <div className="flex flex-col gap-5 lg:gap-9">
            {/* Was an icon + plain text row with hover/pointer styling and no
                actual link — looked interactive, did nothing. Now a real
                mailto: affordance, same treatment as the GitHub/LinkedIn
                links below it, so the hover state means something. */}
            <a
              href={`mailto:${personalData.email}`}
              className="text-sm md:text-xl flex items-center gap-3 no-underline text-inherit outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 rounded"
              aria-label={`Email ${personalData.email}`}
            >
              <MdAlternateEmail
                className="bg-ink-300 p-2 rounded-full hover:bg-accent hover:scale-110 transition-all duration-300 text-ink-900"
                size={36}
              />
              <span>{personalData.email}</span>
            </a>
          </div>
          <div className="mt-8 lg:mt-16 flex items-center gap-5 lg:gap-10">
            <Link
              target="_blank"
              href={personalData.github}
              aria-label="GitHub"
              className="rounded-full outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              <IoLogoGithub
                className="bg-ink-300 p-3 rounded-full hover:bg-accent hover:scale-110 transition-all duration-300 text-ink-900 cursor-pointer"
                size={48}
              />
            </Link>
            <Link
              target="_blank"
              href={personalData.linkedIn}
              aria-label="LinkedIn"
              className="rounded-full outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              <BiLogoLinkedin
                className="bg-ink-300 p-3 rounded-full hover:bg-accent hover:scale-110 transition-all duration-300 text-ink-900 cursor-pointer"
                size={48}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
