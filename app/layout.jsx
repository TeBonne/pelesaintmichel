import "./globals.css";
import { Cinzel, Cormorant_Garamond, Mulish } from "next/font/google";
import localFont from "next/font/local";
import Anims from "@/components/site/Anims";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-cinzel",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-mulish",
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
      className={`${cinzel.variable} ${cormorant.variable} ${mulish.variable} ${bitter.variable}`}
    >
      <body>
        {children}
        <Anims />
      </body>
    </html>
  );
}
