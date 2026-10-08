import type { Metadata } from "next";
import { AvailabilityPage } from "@/components/availability-page";

export const metadata: Metadata = { title: "Save your conversations" };

export default function SignIn() {
  return <AvailabilityPage title="Your next chapter, saved."><p>Customer accounts and saved consultation history are coming soon. Sign-in isn’t available in this early preview, and no email address is being collected here.</p><p>For now, explore the consultation without an account. Your messages stay on that page and clear when you leave or refresh.</p></AvailabilityPage>;
}
