"use client";
// @flow strict

import Link from "next/link";
import { useState } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";

// Order matches the page's actual scroll order (app/page.js), not the
// original template's — that one listed EDUCATION before PROJECTS while
// the page itself renders Projects, then Education, a mismatch inherited
// from the initial commit and never corrected until this pass.
const NAV_LINKS = [
  { href: "/#about", label: "ABOUT" },
  { href: "/#experience", label: "EXPERIENCE" },
  { href: "/#skills", label: "SKILLS" },
  { href: "/#projects", label: "PROJECTS" },
  { href: "/#education", label: "EDUCATION" },
];

// Focus-visible only (not plain :focus) so a mouse click doesn't leave a
// ring behind, but Tab always does — same treatment on every nav link,
// replacing the previous outline-none with no substitute at all (tabbing
// through the nav gave zero visible indication of position).
const LINK_CLS =
  "block px-4 py-2 no-underline outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 rounded hover:no-underline";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-transparent">
      <div className="flex items-center justify-between py-5">
        <div className="flex flex-shrink-0 items-center">
          <Link
            href="/"
            className="text-accent text-3xl font-display font-bold outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 rounded"
          >
            SUJITH
          </Link>
        </div>

        {/* Below md, this is the only way to reach the nav links at all —
            previously there was no button here and the <ul> below was
            permanently opacity-0/max-h-0 with nothing to ever change that,
            making the entire nav unreachable on narrow viewports. */}
        <button
          type="button"
          className="md:hidden text-text-primary hover:text-accent transition-colors duration-300 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 rounded p-2"
          aria-expanded={isOpen}
          aria-controls="navbar-default"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <FaXmark size={22} /> : <FaBars size={22} />}
        </button>

        <ul
          id="navbar-default"
          className={`${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"} mt-4 flex w-full flex-col items-start overflow-hidden text-sm transition-all duration-300 md:mt-0 md:max-h-screen md:w-auto md:flex-row md:items-center md:space-x-1 md:overflow-visible md:opacity-100`}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href} className="w-full md:w-auto">
              <Link className={LINK_CLS} href={href} onClick={() => setIsOpen(false)}>
                <div className="text-sm font-mono text-text-primary transition-colors duration-300 hover:text-accent">
                  {label}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
