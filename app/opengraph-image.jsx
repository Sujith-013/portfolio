import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Token-based OG/Twitter card — no photography, no invented credentials.
// Colors and type pairing lifted directly from docs/DESIGN-SYSTEM.md
// (ink-900 canvas, ink-50/ink-300 text, signal-500 accent, Roboto Slab +
// IBM Plex Mono) rather than reusing the personal photo that was
// previously wired up here with the wrong declared dimensions (1200x630
// claimed, actual file 828x1006 — a portrait crop, not a social card).
// next/og's ImageResponse (satori) needs real font bytes, not next/font's
// CSS-only output, so the two weights actually used are vendored as plain
// .ttf files under app/assets/fonts/og/ (same Apache-2.0/OFL-1.1 fonts
// already in use elsewhere on the site — no new license to track).

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Sujith — Space Systems Engineer. Aerospace, robotics, autonomy.";

const INK_900 = "#0d1224";
const INK_600 = "#262e52";
const INK_500 = "#5b6390";
const INK_300 = "#a6acc7";
const INK_50 = "#f8f9fc";
const SIGNAL_500 = "#16f2b3";

export default async function OpengraphImage() {
  const [robotoSlab, plexMono] = await Promise.all([
    readFile(join(process.cwd(), "app/assets/fonts/og/RobotoSlab-Bold.ttf")),
    readFile(join(process.cwd(), "app/assets/fonts/og/IBMPlexMono-Medium.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          backgroundColor: INK_900,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            border: `2px solid ${INK_500}`,
            borderRadius: "16px",
            padding: "64px",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "IBM Plex Mono",
              fontSize: "28px",
              fontWeight: 500,
              letterSpacing: "6px",
              color: SIGNAL_500,
              textTransform: "uppercase",
              marginBottom: "28px",
            }}
          >
            Space Systems Engineer
          </div>

          <div
            style={{
              display: "flex",
              fontFamily: "Roboto Slab",
              fontSize: "144px",
              fontWeight: 700,
              color: INK_50,
              lineHeight: 1,
            }}
          >
            SUJITH
          </div>

          <div
            style={{
              display: "flex",
              width: "180px",
              height: "3px",
              backgroundColor: INK_600,
              margin: "40px 0",
            }}
          />

          <div
            style={{
              display: "flex",
              fontFamily: "IBM Plex Mono",
              fontSize: "34px",
              fontWeight: 500,
              color: INK_300,
              letterSpacing: "1px",
            }}
          >
            Aerospace · Robotics · Autonomy
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Roboto Slab", data: robotoSlab, weight: 700, style: "normal" },
        { name: "IBM Plex Mono", data: plexMono, weight: 500, style: "normal" },
      ],
    },
  );
}
