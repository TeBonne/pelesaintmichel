import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const alt = "Pèlerinage de Saint Michel — De Saint-Malo au Mont, 8 au 10 mai 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  let logoSrc = null;
  try {
    const logo = fs.readFileSync(path.join(process.cwd(), "public/img/logo-medallion-cream.png"));
    logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  } catch {
    logoSrc = null;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(120% 130% at 50% 0%, #16486E 0%, #0A2940 60%, #07223A 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: 64,
          }}
        >
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoSrc} width={150} height={150} style={{ width: 150, height: 150, objectFit: "contain" }} alt="" />
          ) : (
            <div style={{ display: "flex", width: 120, height: 120, borderRadius: 60, border: "3px solid #C9A45E" }} />
          )}
          <div style={{ display: "flex", width: 240, height: 3, background: "#C9A45E", borderRadius: 2, marginTop: 28 }} />
          <div style={{ display: "flex", color: "#F6ECD8", fontSize: 66, fontWeight: 700, marginTop: 22 }}>
            Pèlerinage de Saint Michel
          </div>
          <div style={{ display: "flex", color: "#E3CD9B", fontSize: 34, marginTop: 18 }}>
            De Saint-Malo au Mont, 8 au 10 mai 2026
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
