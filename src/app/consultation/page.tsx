import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ConsultationClient } from "@/features/consultation/consultation-client";
import { isPreviewInterest } from "@/features/consultation/preferences";

export const metadata: Metadata = { title: "Your consultation" };

export default async function Consultation({ searchParams }: { searchParams: Promise<{ interest?: string; preview?: string }> }) {
  const { interest, preview } = await searchParams;
  return <div className="consultation-backdrop"><div className="consultation-frame"><SiteHeader active="consultation" history /><ConsultationClient interest={isPreviewInterest(interest) ? interest : "exploring"} showPreviewControls={preview === "1"} /><SiteFooter compact /></div></div>;
}
