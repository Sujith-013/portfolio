import { GoogleTagManager } from "@next/third-parties/google";
import { IBM_Plex_Mono, IBM_Plex_Sans, Roboto_Slab } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/footer";
import ScrollToTop from "./components/helper/scroll-to-top";
import Navbar from "./components/navbar";
import "./css/theme.css";
import "./css/globals.scss";
import "./css/card.scss";

// Body copy. Replaced Inter (Stage 3) with IBM Plex Sans — see
// docs/DESIGN-SYSTEM.md "Typography" for the full argument.
//
// weight: "variable", not a static array — Google serves IBM Plex Sans
// with a real wght axis (100-700), and requesting discrete static
// weights (["400","500","600","700"]) from a variable-capable family
// hit a real next/font + Turbopack bug: every requested weight's
// @font-face was silently pointed at the SAME physical Regular (400)
// file (verified by inspecting the built .next/static/chunks/*.css —
// 4 distinct font-weight declarations, 1 underlying file, confirmed via
// fontTools' OS/2.usWeightClass/postscript name on the actual bytes).
// font-medium/semibold/bold would have rendered as plain Regular.
// `variable` loads the real variable instance and lets font-weight
// interpolate for real — matches every weight utility actually used on
// sans text (400 default, 500/600/700 via font-medium/semibold/bold).
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-plex-sans",
});

// Display face for name/headings/section eyebrows — a slab serif,
// chosen for its "engineered" structural weight over a literary serif.
// Also variable (same reasoning as plexSans above — Roboto Slab has a
// wght axis too, and the static-array form hit the identical bug).
// app/components/homepage/hero-section/index.jsx's h1 requests
// md:font-extrabold (800) on this face; the old static-weight-array
// setup only loaded 700, so 800 had no matching @font-face at all.
// Variable covers the full range including 800 for real.
const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-roboto-slab",
});

// Technical/data face — dates, durations, tool tags, spec readouts,
// and the existing fake-terminal code blocks. IBM designed this
// specifically for technical documentation, which is the whole brief.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

// Canonical production URL — matches the resume's own portfolio link,
// README.md, and SETUP.md's NEXT_PUBLIC_APP_URL guidance. Required for
// next/og's ImageResponse (app/opengraph-image.jsx) and any relative
// social-image URL to resolve to an absolute one; without it Next falls
// back to localhost, which is wrong in any shared/production link.
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sujith-portfolio-eight.vercel.app";

// Single source of truth for the title/description pair — reused across
// the base tag, OpenGraph, and Twitter card instead of three copies that
// can silently drift out of sync with each other (the base <meta
// name="description"> previously still had leftover template phrasing —
// "a self taught developer... I love to learn new things" — while
// OpenGraph/Twitter had already been corrected to the resume-accurate
// version below; this contradicted itself between the same page's own
// meta tags).
const TITLE = "Portfolio of Sujith - Space Systems Engineer";
const DESCRIPTION = "Space systems, robotics, autonomy, and engineering portfolio of Sujith.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,

  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    // No `images` entry: app/opengraph-image.jsx is Next's file-convention
    // route for this and is picked up automatically — declaring images
    // here too would just be a second, easily-stale copy of the same URL.
  },

  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    // Same reasoning — app/twitter-image.jsx supplies this automatically.
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${plexSans.variable} ${robotoSlab.variable} ${plexMono.variable} font-sans`}>
        <ToastContainer />
        <main className="min-h-screen relative mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem] text-text-primary">
          <Navbar />
          {children}
          <ScrollToTop />
        </main>
        <Footer />
      </body>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM} />
    </html>
  );
}
