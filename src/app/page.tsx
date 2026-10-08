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
              <h1 id="hero-title">Beauty,<br />considered.</h1>
              <p>Explore skincare and makeup through<br className="wide-break" /> a conversation about what matters to you.</p>
              <div className="hero-actions">
                <Button size="lg" asChild><Link href="/consultation">Start a consultation<ArrowRight data-icon="inline-end" /></Link></Button>
                <Link className="editorial-link" href="/products">Browse the catalogue</Link>
              </div>
            </div>
          </section>
      </div>
      <section className="category-diptych" aria-label="Explore skincare and makeup">
        <Link className="category-feature" href="/products?category=skincare">
          <Image src="/images/skincare-texture.png" alt="" fill sizes="(max-width: 639px) 100vw, 50vw" />
          <div className="category-copy"><h2>Skincare</h2><p>Textures, ingredients and<br />everyday rituals.</p><span className="editorial-link">Explore skincare <ArrowRight size={20} /></span></div>
        </Link>
        <Link className="category-feature" href="/products?category=makeup">
          <Image src="/images/makeup-texture.png" alt="" fill sizes="(max-width: 639px) 100vw, 50vw" />
          <div className="category-copy"><h2>Makeup</h2><p>Finish, formula and colour,<br />on your terms.</p><span className="editorial-link">Explore makeup <ArrowRight size={20} /></span></div>
        </Link>
      </section>
      <section className="how-it-works" aria-labelledby="how-title">
        <h2 id="how-title">A little conversation. A considered shortlist.</h2>
        <ol>
          <li><span aria-hidden="true">01</span><h3>Share your preferences</h3></li>
          <li><span aria-hidden="true">02</span><h3>Explore verified details</h3></li>
          <li><span aria-hidden="true">03</span><h3>Choose your retailer</h3></li>
        </ol>
        <p>Recommendations come from our curated catalogue. Purchases happen on retailer websites.</p>
      </section>
      <section className="save-banner" aria-labelledby="save-title">
        <Image src="/images/dawn-architecture.png" alt="" fill sizes="100vw" />
        <div><h2 id="save-title">Pick up where you left off.</h2><p>Coming soon: your consultation history, saved across devices.</p><Button size="lg" asChild><Link href="/sign-in">Save your conversations<ArrowRight data-icon="inline-end" /></Link></Button></div>
      </section>
      </main>
      <SiteFooter />
    </>
  );
}
