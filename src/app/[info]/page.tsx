import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AvailabilityPage } from "@/components/availability-page";

const pages = {
  privacy: { title: "Privacy", label: "Privacy", intro: "Information for this early preview, before Till Dawn’s full privacy notice is published.", sections: [
    { title: "Conversations in this preview", body: "Messages and preferences exist only in the consultation page’s memory. They aren’t sent to an AI provider or saved to a customer database. Leaving or refreshing the page clears them. Please avoid sharing personal or medical details." },
    { title: "Website requests", body: "Your browser requests website files and images from the hosting service. The host may process connection information in its operational logs. This preview has no marketing analytics or advertising trackers, and its fonts are hosted with the site." },
    { title: "Before saved accounts launch", body: "A complete notice covering the operating entity, privacy contact, providers, retention, overseas transfers and deletion rights will be published before customer accounts and live consultations are enabled." },
  ]},
  terms: { title: "Terms", label: "Terms", intro: "Till Dawn is currently an early interface preview. Full service terms will be published before the controlled beta.", sections: [
    { title: "Preview", body: "This preview demonstrates the consultation interface. It does not provide live AI recommendations, verified product listings, retailer offers or medical advice." },
    { title: "Product discovery", body: "Till Dawn is being designed for cosmetic product discovery. Purchases will take place on external retailer websites, with prices and availability confirmed by the retailer. An exact complexion or shade match cannot be guaranteed." },
  ]},
  "affiliate-disclosure": { title: "Affiliate disclosure", label: "Affiliate disclosure", intro: "There are no affiliate shopping links in this preview.", sections: [
    { title: "When shopping links arrive", body: "Approved affiliate links will be clearly disclosed. Till Dawn may earn a commission from eligible purchases through those links. Ordinary retailer links can be used before affiliate approval." },
    { title: "Independent recommendations", body: "Commercial relationships will not silently change organic recommendation rankings. Any sponsored placements will be labelled. An outbound click will not be presented as a confirmed sale." },
  ]},
  contact: { title: "Contact", label: "Contact", intro: "Till Dawn’s customer support channel is being prepared for the beta launch.", sections: [
    { title: "Feedback", body: "This is a private development preview. Please share feedback with the person who invited you. A verified support and privacy contact will be published before customer accounts are enabled." },
  ]},
} as const;

function getPage(info: string) { return Object.hasOwn(pages, info) ? pages[info as keyof typeof pages] : null; }

export function generateStaticParams() { return Object.keys(pages).map((info) => ({ info })); }
export async function generateMetadata({ params }: { params: Promise<{ info: string }> }): Promise<Metadata> {
  const page = getPage((await params).info);
  return { title: page?.label ?? "Page not found" };
}

export default async function Information({ params }: { params: Promise<{ info: string }> }) {
  const page = getPage((await params).info);
  if (!page) notFound();
  return <AvailabilityPage title={page.title} action="Back to Till Dawn" href="/"><p>{page.intro}</p><div className="info-sections">{page.sections.map((section) => <section key={section.title}><h2>{section.title}</h2><p>{section.body}</p></section>)}</div></AvailabilityPage>;
}
