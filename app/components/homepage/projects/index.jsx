"use client";

import { projectsData } from '@/utils/data/projects-data';
import { useSectionReveal } from '@/utils/hooks/use-section-reveal';
import { useRef } from 'react';
import { ProjectShowcase } from './project-showcase';

const Projects = () => {
  const scopeRef = useRef(null);
  useSectionReveal(scopeRef);

  return (
    <div ref={scopeRef} id='projects' className="relative z-50 my-12 lg:my-24">
      <div className="w-[80px] h-[80px] bg-ink-500 rounded-full absolute -top-3 left-0 translate-x-1/2 filter blur-3xl opacity-30"></div>
      <div className="flex items-center justify-start relative mb-12">
        <span data-reveal="text" className="font-display bg-surface-raised absolute left-0  w-fit text-text-primary px-5 py-3 text-xl rounded-md">
          PROJECTS
        </span>
        <span className="w-full h-[2px] bg-border-strong"></span>
      </div>

      <div className="pt-16">
        {projectsData.map((project, index) => (
          <ProjectShowcase key={project.slug} project={project} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
