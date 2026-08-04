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

export const metadata = {
  title: "Portfolio of Sujith - Space Systems Engineer",
  description:
    "This is the portfolio of Sujith. I am a Space Systems Engineer and a self taught developer. I love to learn new things and I am always open to collaborating with others. I am a quick learner and I am always looking for new challenges.",

  openGraph: {
    title: "Portfolio of Sujith - Space Systems Engineer",
    description:
      "Space systems, robotics, autonomy, and engineering portfolio of Sujith.",
    images: [
      {
        url: "/profile.png",
        width: 1200,
        height: 630,
        alt: "Portfolio of Sujith",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Portfolio of Sujith - Space Systems Engineer",
    description:
      "Space systems, robotics, autonomy, and engineering portfolio of Sujith.",
    images: ["/profile.png"],
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
