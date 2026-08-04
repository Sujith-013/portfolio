"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const REVEAL_READY_CLASS = "reveal-ready";

/**
 * Shared "one coordinated reveal per section" primitive — every section on
 * the site uses this same hook rather than inventing its own animation.
 *
 * Mark elements to animate with data-reveal="text" or data-reveal="figure"
 * in JSX, in reading order. On first scroll into view, every marked element
 * inside scopeRef animates in as ONE timeline (not one ScrollTrigger per
 * element) — text steps get a smaller slide-up, figure steps (images,
 * project cards, anything visual) get a slightly larger movement + a touch
 * of scale, so an image reads as "resolving into view" rather than sliding
 * text. DOM order is preserved regardless of step type, so headline ->
 * supporting text -> figure -> proof point always animates in reading
 * order even when types are mixed.
 *
 * FOUC/no-JS safety: elements are fully visible by default (see the
 * [data-reveal] rules in app/css/globals.scss) — nothing is hidden until
 * this hook confirms on the client that it can actually run, and
 * prefers-reduced-motion is backed by both a JS check (below) and a plain
 * CSS @media fallback, so reduced-motion users are never left invisible
 * even in a race condition. Content is never hidden from first paint; nothing
 * here can delay LCP for anything not deliberately opted in via data-reveal.
 */
export function useSectionReveal(scopeRef, { start = "top 78%" } = {}) {
  useGSAP(
    () => {
      if (!scopeRef.current) return undefined;

      document.documentElement.classList.add(REVEAL_READY_CLASS);

      const mm = gsap.matchMedia();

      mm.add({ reduceMotion: "(prefers-reduced-motion: reduce)" }, (context) => {
        const { reduceMotion } = context.conditions;
        const steps = gsap.utils.toArray("[data-reveal]", scopeRef.current);

        if (!steps.length) return undefined;

        if (reduceMotion) {
          // Reduced motion means fully visible and usable instantly, not a
          // faster version of the same animation.
          gsap.set(steps, { autoAlpha: 1, y: 0, scale: 1 });
          return undefined;
        }

        const tl = gsap.timeline({
          scrollTrigger: { trigger: scopeRef.current, start, once: true },
        });

        tl.from(steps, {
          autoAlpha: 0,
          y: (_i, target) => (target.dataset.reveal === "figure" ? 32 : 20),
          scale: (_i, target) => (target.dataset.reveal === "figure" ? 0.97 : 1),
          duration: (_i, target) => (target.dataset.reveal === "figure" ? 0.7 : 0.55),
          ease: "power2.out",
          stagger: 0.12,
        });

        return () => tl.scrollTrigger?.kill();
      });

      return () => mm.revert();
    },
    { scope: scopeRef },
  );
}
