"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ErrorPage({ retry }: { retry: () => void }) {
  return <main id="main-content" className="availability-page"><h1>Page unavailable</h1><p>This page couldn’t load.</p><div className="flex flex-wrap gap-4"><Button onClick={retry}>Try again</Button><Button variant="outline" asChild><Link href="/">Return home</Link></Button></div></main>;
}
