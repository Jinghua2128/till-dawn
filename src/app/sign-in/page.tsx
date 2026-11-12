import type { Metadata } from "next";
import { AvailabilityPage } from "@/components/availability-page";

export const metadata: Metadata = { title: "Sign in" };

export default function SignIn() {
  return <AvailabilityPage title="Sign in"><p>Accounts and saved history aren’t available yet.</p></AvailabilityPage>;
}
