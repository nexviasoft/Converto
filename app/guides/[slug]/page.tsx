import { SITE_URL } from "@/lib/siteUrl";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SimpleTopBar from "@/components/layout/SimpleTopBar";
import Footer from "@/components/landing/Footer";
import EditorialGuidePage from "@/components/guides/EditorialGuidePage";
import { allEditorialGuides, editorialGuides } from "@/lib/editorialGuides";


type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allEditorialGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = editorialGuides[slug];
  if (!guide) return {};

  const url = `${SITE_URL}/guides/${guide.slug}`;
  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url,
      siteName: "Converto",
      type: "article",
      modifiedTime: "2026-07-06T00:00:00.000Z",
      authors: ["NexviaSoft"],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.metaTitle,
      description: guide.metaDescription,
    },
  };
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const guide = editorialGuides[slug];
  if (!guide) notFound();

  const url = `${SITE_URL}/guides/${guide.slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    datePublished: "2026-07-06",
    dateModified: "2026-07-06",
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: "NexviaSoft", url: SITE_URL },
    publisher: { "@type": "Organization", name: "NexviaSoft", url: SITE_URL },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
      { "@type": "ListItem", position: 3, name: guide.shortTitle, item: url },
    ],
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <SimpleTopBar shellMax="max-w-[1320px]" />
      <EditorialGuidePage guide={guide} />
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
