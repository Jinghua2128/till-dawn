import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DawnMark } from "@/components/dawn-mark";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export function AvailabilityPage({ title, children, action = "Start a consultation", href = "/consultation" }: { title: string; children: React.ReactNode; action?: string; href?: string }) {
  return <><SiteHeader /><main id="main-content" className="availability-page"><DawnMark className="dawn-mark" /><h1>{title}</h1>{children}<Button asChild size="lg"><Link href={href}>{action}<ArrowRight data-icon="inline-end" /></Link></Button></main><SiteFooter /></>;
}
