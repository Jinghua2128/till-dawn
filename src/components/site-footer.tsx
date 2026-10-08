import Link from "next/link";

export function SiteFooter({ compact = false }: { compact?: boolean }) {
  return (
    <footer className={compact ? "site-footer footer-compact" : "site-footer"}>
      {!compact ? <Link className="wordmark" href="/" aria-label="Till Dawn home">Till Dawn</Link> : null}
      <nav aria-label="Footer navigation">
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/affiliate-disclosure">Affiliate disclosure</Link>
        <Link href="/contact">Contact</Link>
      </nav>
      {!compact ? <p>Purchases happen on retailer websites. Any affiliate links will be clearly disclosed. Commercial relationships won’t change organic recommendation rankings.</p> : null}
    </footer>
  );
}
