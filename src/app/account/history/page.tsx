import type { Metadata } from "next";
import { AvailabilityPage } from "@/components/availability-page";

export const metadata: Metadata = { title: "Your consultation history" };

export default function History() {
  return <AvailabilityPage title="A place for your conversations."><p>Saved history will live here once customer accounts are available. This preview hasn’t saved any conversations.</p><p>You can explore the consultation now. There’s no account to create and no email to enter.</p></AvailabilityPage>;
}
