import type { Metadata, Viewport } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2D5A27",
};

export const metadata: Metadata = {
  title: {
    default: "Kot Jingrwai",
    template: "%s | Kot Jingrwai",
  },
  description: "Ka kot jingrwai — Khasi Hymnbook with 639 hymns, chorus, creed, and commandments.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Jingrwai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="kha" className={`${inter.variable} ${lora.variable}`}>
      <body>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
