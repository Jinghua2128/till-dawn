import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <SiteHeader overlay />
      <main id="main-content">
      <div className="landing-top">
        <Image className="hero-art" src="/images/dawn-architecture.png" alt="" fill sizes="100vw" priority />
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-copy">
              <h1 id="hero-title">Skincare &amp;<br />makeup.</h1>
              <div className="hero-actions">
                <Button size="lg" asChild><Link href="/consultation">Start a consultation<ArrowRight data-icon="inline-end" /></Link></Button>
                <Link className="editorial-link" href="/products">Browse products</Link>
              </div>
            </div>
          </section>
      </div>
      <section className="category-diptych" aria-label="Explore skincare and makeup">
        <Link className="category-feature" href="/products?category=skincare">
          <Image src="/images/skincare-texture.png" alt="" fill sizes="(max-width: 639px) 100vw, 50vw" />
          <div className="category-copy"><h2>Skincare <ArrowRight size={24} aria-hidden="true" /></h2></div>
        </Link>
        <Link className="category-feature" href="/products?category=makeup">
          <Image src="/images/makeup-texture.png" alt="" fill sizes="(max-width: 639px) 100vw, 50vw" />
          <div className="category-copy"><h2>Makeup <ArrowRight size={24} aria-hidden="true" /></h2></div>
        </Link>
      </section>
      </main>
      <SiteFooter />
    </>
  );
}
