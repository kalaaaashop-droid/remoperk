import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vértice.scrub · Uniformes médicos de autor",
  description:
    "Uniformes médicos confeccionados artesanalmente en nuestro taller de Valencia. Telas premium, patrones propios y entalle preciso. Personaliza el tuyo.",
  openGraph: {
    title: "Vértice.scrub · Slow fashion médico",
    description: "Personaliza tu uniforme: modelo, tela, color, talla y bordado.",
    locale: "es_ES",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f8f5f0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
