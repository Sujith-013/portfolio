// @flow strict

import { personalData } from "@/utils/data/personal-data";
import { skillsData } from "@/utils/data/skills";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { MdDownload } from "react-icons/md";
import { RiContactsFill } from "react-icons/ri";

const heroSkills = skillsData.flatMap((group) => group.skills);

function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-between py-4 lg:py-12">
      <Image
        src="/hero.svg"
        alt="Hero"
        width={1572}
        height={795}
        className="absolute -top-[98px] -z-10"
      />

      <div className="grid grid-cols-1 items-start lg:grid-cols-2 lg:gap-12 gap-y-8">
        <div className="order-2 lg:order-1 flex flex-col items-start justify-center p-2 pb-20 md:pb-10 lg:pt-10">
          <h1 className="font-display text-3xl font-bold leading-10 text-text-primary md:font-extrabold lg:text-display">
            Hello, <br />
            This is {' '}
            <span className="text-text-primary">{personalData.name}</span>
            {` , I'm a Professional `}
            <span className="text-accent">{personalData.designation}</span>
            .
          </h1>

          <div className="my-12 flex items-center gap-5">
            <Link
              href={personalData.github}
              target='_blank'
              className="transition-all text-text-secondary hover:text-accent hover:scale-125 duration-300"
            >
              <BsGithub size={30} />
            </Link>
            <Link
              href={personalData.linkedIn}
              target='_blank'
              className="transition-all text-text-secondary hover:text-accent hover:scale-125 duration-300"
            >
              <BsLinkedin size={30} />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="#contact" className="border border-border-strong rounded-full transition-all duration-300 hover:border-accent">
              <button className="px-3 text-xs md:px-8 py-3 md:py-4 bg-canvas rounded-full border-none text-center md:text-sm font-medium uppercase tracking-wider text-text-primary no-underline transition-all duration-200 ease-out md:font-semibold flex items-center gap-1 hover:gap-3 hover:text-accent">
                <span>Contact me</span>
                <RiContactsFill size={16} />
              </button>
            </Link>

            <Link className="flex items-center gap-1 hover:gap-3 rounded-full bg-accent px-3 md:px-8 py-3 md:py-4 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-ink-950 no-underline transition-all duration-200 ease-out hover:bg-accent-hover hover:no-underline md:font-semibold" role="button" target="_blank" href={personalData.resume}
            >
              <span>Get Resume</span>
              <MdDownload size={16} />
            </Link>
          </div>

        </div>
        <div className="order-1 lg:order-2 relative rounded-lg border border-border-strong bg-surface-raised">
          <div className="flex flex-row">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-border-strong to-transparent"></div>
          </div>
          <div className="px-4 lg:px-8 py-5">
            <div className="flex flex-row space-x-2">
              <div className="h-3 w-3 rounded-full bg-ink-500"></div>
              <div className="h-3 w-3 rounded-full bg-ink-400"></div>
              <div className="h-3 w-3 rounded-full bg-ink-300"></div>
            </div>
          </div>
          <div className="overflow-hidden border-t-2 border-border px-4 lg:px-8 py-4 lg:py-8">
            <code className="font-mono text-xs md:text-sm lg:text-base">
              <div className="blink">
                <span className="mr-2 text-text-primary">const</span>
                <span className="mr-2 text-text-primary">coder</span>
                <span className="mr-2 text-text-primary">=</span>
                <span className="text-text-tertiary">{'{'}</span>
              </div>
              <div>
                <span className="ml-4 lg:ml-8 mr-2 text-text-primary">name:</span>
                <span className="text-text-tertiary">{`'`}</span>
                <span className="text-text-secondary">Sujith</span>
                <span className="text-text-tertiary">{`',`}</span>
              </div>
              <div className="ml-4 lg:ml-8 mr-2">
                <span className="text-text-primary">skills:</span>
                <span className="text-text-tertiary">{`['`}</span>
                {heroSkills.map((skill, i) => (
                  <Fragment key={skill}>
                    <span className="text-text-secondary">{skill}</span>
                    {i !== heroSkills.length - 1 && (
                      <span className="text-text-tertiary">{"', '"}</span>
                    )}
                  </Fragment>
                ))}
                <span className="text-text-tertiary">{"'],"}</span>
              </div>
              <div>
                <span className="ml-4 lg:ml-8 mr-2 text-text-primary">hardWorker:</span>
                <span className="text-text-secondary">true</span>
                <span className="text-text-tertiary">,</span>
              </div>
              <div>
                <span className="ml-4 lg:ml-8 mr-2 text-text-primary">quickLearner:</span>
                <span className="text-text-secondary">true</span>
                <span className="text-text-tertiary">,</span>
              </div>
              <div>
                <span className="ml-4 lg:ml-8 mr-2 text-text-primary">problemSolver:</span>
                <span className="text-text-secondary">true</span>
                <span className="text-text-tertiary">,</span>
              </div>
              <div>
                <span className="ml-4 lg:ml-8 mr-2 text-text-primary">hireable:</span>
                <span className="text-text-secondary">function</span>
                <span className="text-text-tertiary">{'() {'}</span>
              </div>
              <div>
                <span className="ml-8 lg:ml-16 mr-2 text-text-secondary">return</span>
                <span className="text-text-tertiary">{`(`}</span>
              </div>
              <div>
                <span className="ml-12 lg:ml-24 text-text-tertiary">this.</span>
                <span className="mr-2 text-text-primary">hardWorker</span>
                <span className="text-text-tertiary">&amp;&amp;</span>
              </div>
              <div>
                <span className="ml-12 lg:ml-24 text-text-tertiary">this.</span>
                <span className="mr-2 text-text-primary">problemSolver</span>
                <span className="text-text-tertiary">&amp;&amp;</span>
              </div>
              <div>
                <span className="ml-12 lg:ml-24 text-text-tertiary">this.</span>
                <span className="mr-2 text-text-primary">skills.length</span>
                <span className="mr-2 text-text-tertiary">&gt;=</span>
                <span className="text-text-secondary">5</span>
              </div>
              <div><span className="ml-8 lg:ml-16 mr-2 text-text-tertiary">{`);`}</span></div>
              <div><span className="ml-4 lg:ml-8 text-text-tertiary">{`};`}</span></div>
              <div><span className="text-text-tertiary">{`};`}</span></div>
            </code>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
