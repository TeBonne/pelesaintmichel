import "./globals.css";
import localFont from "next/font/local";
import Anims from "@/components/site/Anims";

// Polices hébergées dans le projet (public/fonts) : le build ne dépend plus de Google Fonts.
// Chaque famille a deux fichiers, comme le servait Google : « latin » (français, préchargé)
// et « latin étendu » (autres langues européennes, téléchargé seulement si un tel caractère
// apparaît). next/font exige des valeurs écrites en dur, d'où la répétition des plages Unicode.

const cinzel = localFont({
  src: [{ path: "../public/fonts/cinzel-latin-wght-normal.woff2", weight: "400 900", style: "normal" }],
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" }],
  adjustFontFallback: "Times New Roman",
  display: "swap",
  variable: "--font-cinzel",
});
const cinzelExt = localFont({
  src: [{ path: "../public/fonts/cinzel-latin-ext-wght-normal.woff2", weight: "400 900", style: "normal" }],
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF" }],
  adjustFontFallback: false,
  preload: false,
  display: "swap",
  variable: "--font-cinzel-ext",
});

const cormorant = localFont({
  src: [
    { path: "../public/fonts/cormorant-garamond-latin-wght-normal.woff2", weight: "300 700", style: "normal" },
    { path: "../public/fonts/cormorant-garamond-latin-wght-italic.woff2", weight: "300 700", style: "italic" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" }],
  adjustFontFallback: "Times New Roman",
  display: "swap",
  variable: "--font-cormorant",
});
const cormorantExt = localFont({
  src: [
    { path: "../public/fonts/cormorant-garamond-latin-ext-wght-normal.woff2", weight: "300 700", style: "normal" },
    { path: "../public/fonts/cormorant-garamond-latin-ext-wght-italic.woff2", weight: "300 700", style: "italic" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF" }],
  adjustFontFallback: false,
  preload: false,
  display: "swap",
  variable: "--font-cormorant-ext",
});

const mulish = localFont({
  src: [{ path: "../public/fonts/mulish-latin-wght-normal.woff2", weight: "200 1000", style: "normal" }],
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" }],
  adjustFontFallback: "Arial",
  display: "swap",
  variable: "--font-mulish",
});
const mulishExt = localFont({
  src: [{ path: "../public/fonts/mulish-latin-ext-wght-normal.woff2", weight: "200 1000", style: "normal" }],
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF" }],
  adjustFontFallback: false,
  preload: false,
  display: "swap",
  variable: "--font-mulish-ext",
});

const bitter = localFont({
  src: [
    { path: "../public/fonts/Bitter-VariableFont_wght.ttf", style: "normal" },
    { path: "../public/fonts/Bitter-Italic-VariableFont_wght.ttf", style: "italic" },
  ],
  display: "swap",
  variable: "--font-bitter",
});

export const metadata = {
  metadataBase: new URL("https://www.pelesaintmichel.fr"),
  title: "Pèlerinage de Saint Michel 2026 — De Saint-Malo au Mont, 8–10 mai",
  description:
    "Pèlerinage catholique de toute la France au Mont-Saint-Michel : 3 jours de marche et de prière de Saint-Malo au Mont, du 8 au 10 mai 2026. Inscription en chapitre ou en individuel, branche famille dès 6 ans.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.pelesaintmichel.fr/" },
  openGraph: {
    type: "website",
    siteName: "Pèlerinage de Saint Michel",
    locale: "fr_FR",
    title: "Pèlerinage de Saint Michel 2026 — De Saint-Malo au Mont",
    description:
      "3 jours et 3 nuits de marche et de prière, du 8 au 10 mai 2026. Devenez miquelot.",
    url: "https://www.pelesaintmichel.fr/",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport = {
  themeColor: "#103A5C",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      className={`${cinzel.variable} ${cinzelExt.variable} ${cormorant.variable} ${cormorantExt.variable} ${mulish.variable} ${mulishExt.variable} ${bitter.variable}`}
    >
      <body>
        {children}
        <Anims />
      </body>
    </html>
  );
}
