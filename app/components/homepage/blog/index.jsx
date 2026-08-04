"use client";
// @flow strict
import { useSectionReveal } from '@/utils/hooks/use-section-reveal';
import Link from 'next/link';
import { useRef } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import BlogCard from './blog-card';

function Blog({ blogs }) {
  const scopeRef = useRef(null);
  useSectionReveal(scopeRef);

  return (
    <div ref={scopeRef} id='blogs' className="relative z-50 border-t my-12 lg:my-24 border-border">
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
            Blogs
          </span>
          <span className="w-24 h-[2px] bg-border-strong"></span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 lg:gap-8 xl:gap-10">
        {
          blogs.slice(0, 6).map((blog, i) => (
            blog?.cover_image &&
            <div data-reveal="figure" key={i}>
              <BlogCard blog={blog} />
            </div>
          ))
        }
      </div>

      <div className="flex justify-center  mt-5 lg:mt-12">
        <Link
          className="flex items-center gap-1 hover:gap-3 rounded-full border border-border-strong px-3 md:px-8 py-3 md:py-4 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-text-primary no-underline transition-all duration-200 ease-out hover:text-accent hover:border-accent hover:no-underline md:font-semibold"
          role="button"
          href="/blog"
        >
          <span>View More</span>
          <FaArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default Blog;