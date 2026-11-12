import type { Metadata } from "next";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/manrope/latin-600.css";
import "./globals.css";
import { MotionProvider } from "@/components/motion-provider";

export const metadata: Metadata = {
  title: { default: "Till Dawn — Skincare & makeup", template: "%s | Till Dawn" },
  description: "Skincare and makeup product discovery.",
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-SG" data-scroll-behavior="smooth"><body><a className="skip-link" href="#main-content">Skip to content</a><MotionProvider>{children}</MotionProvider></body></html>;
}
