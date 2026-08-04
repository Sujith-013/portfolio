// @flow strict

import Link from "next/link";

function page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="font-display text-6xl font-bold text-text-primary">404</h1>
      <p className="mt-4 text-lg text-text-secondary">Page Not Found</p>
      <p className="mt-2 text-text-tertiary">Sorry, the page you are looking for does not exist.</p>
      <Link className="mt-5 flex items-center gap-1 hover:gap-3 rounded-full bg-accent px-3 md:px-8 py-3 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-ink-950 no-underline transition-all duration-200 ease-out hover:bg-accent-hover hover:no-underline md:font-semibold"
        role="button" 
        href="/"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default page;