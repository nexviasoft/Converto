import { SITE_URL } from "@/lib/siteUrl";
import type { Metadata } from "next";
import ConvertoProPricingPage from "@/components/pro/ConvertoProPricingPage";
import { PRO_PUBLIC } from "@/lib/siteReadiness";
import { redirect } from "next/navigation";


export const metadata: Metadata = {
  title: "Pro Plans",
  description: PRO_PUBLIC
    ? "Explore Converto Pro plans, advanced conversion controls, higher limits, and batch workflow features."
    : "Preview upcoming Converto Pro plans and higher-limit conversion features.",
  alternates: {
    canonical: `${SITE_URL}/pro`,
  },
  robots: {
    index: PRO_PUBLIC,
    follow: true,
    googleBot: {
      index: PRO_PUBLIC,
      follow: true,
    },
  },
};

export default function ProPage() {
  if (!PRO_PUBLIC) redirect("/converter");
  return <ConvertoProPricingPage />;
}