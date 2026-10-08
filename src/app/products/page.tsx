import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DawnMark } from "@/components/dawn-mark";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export const metadata: Metadata = { title: "Explore the catalogue" };

export default async function Products({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const kind = category === "skincare" || category === "makeup" ? category : undefined;
  return <><SiteHeader active={kind} /><main id="main-content" className="content-page"><div className="page-heading"><h1>Explore the catalogue.</h1><p>Skincare and makeup, with the details that matter. We’re carefully preparing our first collection.</p></div><nav className="catalogue-tabs" aria-label="Product categories">{[{ label: "All products", value: undefined }, { label: "Skincare", value: "skincare" }, { label: "Makeup", value: "makeup" }].map(({ label, value }) => <Button asChild variant={kind === value ? "default" : "outline"} key={label}><Link href={value ? `/products?category=${value}` : "/products"} aria-current={kind === value ? "page" : undefined}>{label}</Link></Button>)}</nav><Empty className="catalogue-empty"><EmptyHeader><EmptyMedia><DawnMark className="dawn-mark" /></EmptyMedia><EmptyTitle><h2 className="catalogue-empty-heading">A considered collection takes care.</h2></EmptyTitle><EmptyDescription>{kind ? `Our ${kind} catalogue` : "Our catalogue"} is being verified. Product details, images and retailer offers will appear here when they’re ready.</EmptyDescription></EmptyHeader><EmptyContent><Button asChild variant="outline"><Link href={kind ? `/consultation?interest=${kind}` : "/consultation"}>Explore your preferences<ArrowRight data-icon="inline-end" /></Link></Button></EmptyContent></Empty></main><SiteFooter /></>;
}
