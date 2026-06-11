import { ImageResponse } from "next/og";

// Branded cover image shown when the site link is shared (Open Graph / Twitter).
export const alt = "The Daily Derby — daily football predictions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: 80,
        textAlign: "center",
        color: "white",
        fontFamily: "sans-serif",
        background: "radial-gradient(ellipse at top, #065f46 0%, #0a0a0a 62%)",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 26,
          letterSpacing: 10,
          textTransform: "uppercase",
          color: "#6ee7b7",
        }}
      >
        Daily Football Predictions
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 120,
          fontWeight: 800,
          letterSpacing: -3,
        }}
      >
        The Daily Derby
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 36,
          lineHeight: 1.3,
          maxWidth: 920,
          color: "#a1a1aa",
        }}
      >
        Pick winners, manage your Football Money, earn trophies, and climb the
        global leaderboard.
      </div>
    </div>,
    size
  );
}
