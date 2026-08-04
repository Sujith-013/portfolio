// @flow strict

import * as React from 'react';

function ProjectCard({ project }) {

  return (
    <div className="relative rounded-lg border border-border-strong bg-surface-raised w-full">
      <div className="flex flex-row">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-border-strong to-transparent"></div>
      </div>
      <div className="px-4 lg:px-8 py-3 lg:py-5 relative">
        <div className="flex flex-row space-x-1 lg:space-x-2 absolute top-1/2 -translate-y-1/2">
          <div className="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-ink-500"></div>
          <div className="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-ink-400"></div>
          <div className="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-ink-300"></div>
        </div>
        <p className="font-display text-center ml-3 text-accent text-base lg:text-xl">
          {project.nameFull}
        </p>
      </div>
      <div className="overflow-hidden border-t-2 border-border px-4 lg:px-8 py-4 lg:py-8">
        <code className="font-mono text-xs md:text-sm lg:text-base">
          <div className="blink">
            <span className="mr-2 text-text-primary">const</span>
            <span className="mr-2 text-text-primary">project</span>
            <span className="mr-2 text-text-primary">=</span>
            <span className="text-text-tertiary">{'{'}</span>
          </div>
          <div>
            <span className="ml-4 lg:ml-8 mr-2 text-text-primary">name:</span>
            <span className="text-text-tertiary">{`'`}</span>
            <span className="text-text-secondary">{project.name}</span>
            <span className="text-text-tertiary">{`',`}</span>
          </div>

          <div className="ml-4 lg:ml-8 mr-2">
            <span className="text-text-primary">tools:</span>
            <span className="text-text-tertiary">{` ['`}</span>
            {
              project.tools.map((tag, i) => (
                <React.Fragment key={i}>
                  <span className="text-text-secondary">{tag}</span>
                  {
                    project.tools?.length - 1 !== i &&
                    <span className="text-text-tertiary">{`', '`}</span>
                  }
                </React.Fragment>
              ))
            }
            <span className="text-text-tertiary">{"],"}</span>
          </div>
          <div>
            <span className="ml-4 lg:ml-8 mr-2 text-text-primary">myRole:</span>
            <span className="text-text-secondary">{project.role}</span>
            <span className="text-text-tertiary">,</span>
          </div>
          <div className="ml-4 lg:ml-8 mr-2">
            <span className="text-text-primary">Description:</span>
            <span className="text-text-secondary">{' ' + project.description}</span>
            <span className="text-text-tertiary">,</span>
          </div>
          <div><span className="text-text-tertiary">{`};`}</span></div>
        </code>
      </div>
    </div>
  );
};

export default ProjectCard;
