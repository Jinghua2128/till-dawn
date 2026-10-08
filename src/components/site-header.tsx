import Link from "next/link";
import { MobileNavigation } from "@/components/mobile-navigation";
import { Button } from "@/components/ui/button";

export type ActivePage = "skincare" | "makeup" | "consultation" | "history";

export function SiteHeader({ active, overlay = false, history = false }: { active?: ActivePage; overlay?: boolean; history?: boolean }) {
  return (
    <header className={overlay ? "site-header site-header-overlay" : "site-header"}>
      <Link className="wordmark" href="/" aria-label="Till Dawn home">Till Dawn</Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        <Link href="/products?category=skincare" aria-current={active === "skincare" ? "page" : undefined}>Skincare</Link>
        <Link href="/products?category=makeup" aria-current={active === "makeup" ? "page" : undefined}>Makeup</Link>
        <Link href="/consultation" aria-current={active === "consultation" ? "page" : undefined}>Consultation</Link>
      </nav>
      <div className="header-account">
        {history ? <Link className="history-link" href="/account/history">History</Link> : null}
        <Button variant={overlay ? "default" : "ghost"} size="sm" asChild><Link href="/sign-in">Sign in</Link></Button>
      </div>
      <MobileNavigation />
    </header>
  );
}
