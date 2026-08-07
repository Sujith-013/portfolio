"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

/**
 * animationPath is now a /public URL string ("/lottie/code.json"), fetched
 * at runtime, not a statically-imported JSON module. The two animation
 * files in use (code.json, study.json) are 84KB/475KB of raw keyframe
 * data — static-importing them bundled that data straight into the
 * Experience/Education section's own JS chunk, shipped to every homepage
 * visitor as part of the initial page weight, even though the *library*
 * that renders it (lottie-react) was already correctly lazy-loaded via
 * next/dynamic. Fetching the JSON as a plain static asset — same timing
 * as the library, decoupled from the JS bundle entirely — actually
 * delivers on that lazy-loading intent instead of half of it. See
 * docs/POLISH-AUDIT.md's Polish pass 3 performance findings.
 */
const AnimationLottie = ({ animationPath }) => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(animationPath)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setAnimationData(data);
      })
      .catch(() => {
        // Decorative animation only — nothing else on the page depends
        // on it, so a fetch failure just means it stays unrendered
        // rather than breaking the section around it.
      });
    return () => {
      cancelled = true;
    };
  }, [animationPath]);

  if (!animationData) return null;

  return (
    <Lottie
      animationData={animationData}
      loop={true}
      autoplay={true}
      style={{ width: '95%' }}
    />
  );
};

export default AnimationLottie;
