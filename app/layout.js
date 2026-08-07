import { GoogleTagManager } from "@next/third-parties/google";
import { IBM_Plex_Mono, Inter, Roboto_Slab } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/footer";
import ScrollToTop from "./components/helper/scroll-to-top";
import Navbar from "./components/navbar";
import "./css/theme.css";
import "./css/globals.scss";
import "./css/card.scss";

// Body copy — unchanged from the original template.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// Display face for name/headings/section eyebrows — a slab serif,
// chosen for its "engineered" structural weight over a literary serif.
const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["700"],
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
      <body className={`${inter.variable} ${robotoSlab.variable} ${plexMono.variable} font-sans`}>
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
