import type { Metadata } from "next";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/manrope/latin-600.css";
import "./globals.css";
import { MotionProvider } from "@/components/motion-provider";

export const metadata: Metadata = {
  title: { default: "Till Dawn — Beauty, considered.", template: "%s | Till Dawn" },
  description: "Explore skincare and makeup through a conversation about what matters to you.",
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-SG"><body><a className="skip-link" href="#main-content">Skip to content</a><MotionProvider>{children}</MotionProvider></body></html>;
}
