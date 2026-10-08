"use client";

import { AlertCircle } from "lucide-react";
import { DawnMark } from "@/components/dawn-mark";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";

export type ResultPreviewState = "empty" | "loading" | "error";

export function RecommendationPreview({ state, onRetry }: { state: ResultPreviewState; onRetry: () => void }) {
  if (state === "loading") return <div role="status" aria-label="Example loading state"><p className="sr-only">Loading state preview. No product search is running.</p><div className="loading-recommendations" aria-hidden="true">{[0, 1, 2].map((key) => <div key={key}><Skeleton className="h-28 w-full" /><Skeleton className="h-4 w-4/5" /><Skeleton className="h-4 w-3/5" /></div>)}</div></div>;
  if (state === "error") return <div className="status-message"><Alert variant="destructive"><AlertCircle /><AlertTitle>We couldn’t load your recommendations.</AlertTitle><AlertDescription><p>This is an error-state example. Your preferences are still here.</p><Button variant="outline" onClick={onRetry}>Try again</Button></AlertDescription></Alert></div>;
  return <Empty className="recommendations-empty"><EmptyHeader><EmptyMedia><DawnMark className="dawn-mark" /></EmptyMedia><EmptyTitle><h3>Verified catalogue products will appear here.</h3></EmptyTitle><EmptyDescription>We’re preparing the catalogue. No products or prices are being recommended in this preview.</EmptyDescription></EmptyHeader></Empty>;
}
