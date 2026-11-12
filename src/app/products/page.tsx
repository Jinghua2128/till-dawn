import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DawnMark } from "@/components/dawn-mark";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export const metadata: Metadata = { title: "Products" };

export default async function Products({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const kind = category === "skincare" || category === "makeup" ? category : undefined;
  return <><SiteHeader active={kind} /><main id="main-content" className="content-page"><div className="page-heading"><h1>Products</h1></div><nav className="catalogue-tabs" aria-label="Product categories">{[{ label: "All products", value: undefined }, { label: "Skincare", value: "skincare" }, { label: "Makeup", value: "makeup" }].map(({ label, value }) => <Button asChild variant={kind === value ? "default" : "outline"} key={label}><Link href={value ? `/products?category=${value}` : "/products"} aria-current={kind === value ? "page" : undefined}>{label}</Link></Button>)}</nav><Empty className="catalogue-empty"><EmptyHeader><EmptyMedia><DawnMark className="dawn-mark" /></EmptyMedia><EmptyTitle><h2 className="catalogue-empty-heading">No products yet.</h2></EmptyTitle></EmptyHeader><EmptyContent><Button asChild variant="outline"><Link href={kind ? `/consultation?interest=${kind}` : "/consultation"}>Start a consultation<ArrowRight data-icon="inline-end" /></Link></Button></EmptyContent></Empty></main><SiteFooter /></>;
}
