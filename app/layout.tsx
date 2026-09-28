import type { Metadata } from "next";
import { Fraunces, Public_Sans, Dancing_Script } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const publicSans = Public_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dancingScript = Dancing_Script({
  variable: "--font-signature",
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  title: {
    default: "SIDEP | Microcertificaciones",
    template: "%s | SIDEP",
  },
  description:
    "Microcertificaciones virtuales, prácticas y verificables para fortalecer habilidades profesionales.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${publicSans.variable} ${dancingScript.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
