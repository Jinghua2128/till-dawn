"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mobile-nav">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild><Button variant="ghost" size="icon" aria-label="Open menu"><Menu /></Button></SheetTrigger>
        <SheetContent>
          <SheetHeader><SheetTitle>Till Dawn</SheetTitle><SheetDescription>Beauty, considered.</SheetDescription></SheetHeader>
          <nav className="mobile-links" aria-label="Mobile navigation">
            {[['Skincare', '/products?category=skincare'], ['Makeup', '/products?category=makeup'], ['Consultation', '/consultation'], ['History', '/account/history'], ['Sign in', '/sign-in']].map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
