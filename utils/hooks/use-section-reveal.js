"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

let loadRefreshRegistered = false;
function ensureLoadRefresh() {
  // Lottie animations and images can change section heights after
  // ScrollTrigger's initial position calculation. Refreshing once
  // everything has settled keeps trigger start/end points accurate
  // instead of silently drifting stale (see gsap-scrolltrigger skill).
  if (loadRefreshRegistered || typeof window === "undefined") return;
  loadRefreshRegistered = true;
  window.addEventListener("load", () => ScrollTrigger.refresh());
}

/**
 * Shared "one coordinated reveal per section" primitive — every section on
 * the site uses this same hook rather than inventing its own animation.
 *
 * Mark elements to animate with data-reveal="text" or data-reveal="figure"
 * in JSX, in reading order. On first scroll into view, every marked element
 * inside scopeRef animates in as ONE timeline (not one ScrollTrigger per
 * element) — text steps get a smaller slide-up, figure steps (images,
 * project cards, anything visual) get a slightly larger movement + a touch
 * of scale. DOM order is preserved regardless of step type.
 *
 * Fail-safe by construction: nothing is ever hidden except in the same
 * synchronous pass that immediately wires up the animation to reveal it
 * again. If there's nothing to reveal, if the visitor prefers reduced
 * motion, or if anything throws while setting up, elements are simply left
 * in (or forced back to) their natural visible state — the failure mode is
 * always "no animation," never "invisible content." A previous version of
 * this hook hid elements via a CSS class applied unconditionally, then
 * relied on gsap.matchMedia() to reveal them — but matchMedia's
 * conditions-object form only invokes its callback when at least one named
 * condition's query actually matches (see gsap-core's MatchMedia.add
 * source), so for any visitor WITHOUT prefers-reduced-motion set, the
 * reveal callback silently never ran, leaving every section permanently
 * hidden. Reduced-motion is now a plain, unambiguous window.matchMedia()
 * check made before anything is hidden, not something a callback has to be
 * trusted to reach.
 */
export function useSectionReveal(scopeRef, { start = "top 78%" } = {}) {
  useGSAP(
    () => {
      const root = scopeRef.current;
      if (!root) return undefined;

      const steps = Array.from(root.querySelectorAll("[data-reveal]"));
      if (!steps.length) return undefined;

      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        // Nothing was ever hidden, so there's nothing to do — reduced
        // motion means fully visible and usable instantly, not a faster
        // version of the same animation.
        return undefined;
      }

      ensureLoadRefresh();

      try {
        // Hide, then immediately (same synchronous pass) wire the reveal
        // that brings it back — never two separate steps that depend on
        // each other working correctly later.
        gsap.set(steps, {
          autoAlpha: 0,
          y: (_i, target) => (target.dataset.reveal === "figure" ? 32 : 20),
          scale: (_i, target) => (target.dataset.reveal === "figure" ? 0.97 : 1),
        });

        const tween = gsap.to(steps, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: (_i, target) => (target.dataset.reveal === "figure" ? 0.7 : 0.55),
          ease: "power2.out",
          stagger: 0.12,
          clearProps: "transform,opacity,visibility",
          scrollTrigger: {
            trigger: root,
            start,
            once: true,
            onRefresh: (self) => {
              // If layout shifted (e.g. a Lottie animation finished
              // sizing) and this trigger's start point turns out to
              // already be behind the current scroll position, reveal
              // immediately instead of leaving it stuck waiting for a
              // scroll event that already happened.
              if (self.progress > 0 || self.isActive) {
                gsap.set(steps, { autoAlpha: 1, y: 0, scale: 1, clearProps: "transform,opacity,visibility" });
                self.kill();
              }
            },
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      } catch (error) {
        // Setup failed for any reason — make sure nothing is left hidden
        // rather than trusting an animation that didn't wire up correctly.
        gsap.set(steps, { autoAlpha: 1, y: 0, scale: 1, clearProps: "transform,opacity,visibility" });
        if (process.env.NODE_ENV !== "production") {
          console.error("useSectionReveal: falling back to visible, no animation:", error);
        }
        return undefined;
      }
    },
    { scope: scopeRef },
  );
}
