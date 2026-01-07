import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #0f172a, #020617)",
          color: "white",
          fontSize: 72,
          fontWeight: 700,
        }}
      >
        <div>CreaDart 🎯</div>
        <div style={{ fontSize: 32, marginTop: 20, opacity: 0.85 }}>
          Tournois de fléchettes CreaTech
        </div>
      </div>
    ),
    size
  );
}
