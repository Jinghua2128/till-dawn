import type { Metadata } from "next";
import { AvailabilityPage } from "@/components/availability-page";

export const metadata: Metadata = { title: "Consultation history" };

export default function History() {
  return <AvailabilityPage title="Consultation history"><p>This preview doesn’t save conversations.</p></AvailabilityPage>;
}
