import type { Metadata } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

type MarketingMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

export function marketingMetadata({ title, description, path, keywords = [] }: MarketingMetadataInput): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: "CloudInvoice",
      title,
      description
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}

export function PageJsonLd({
  title,
  description,
  path,
  type = "WebPage"
}: {
  title: string;
  description: string;
  path: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "TechArticle";
}) {
  const pageUrl = new URL(path, appUrl).toString();
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": type,
        name: title,
        description,
        url: pageUrl,
        isPartOf: {
          "@type": "WebSite",
          name: "CloudInvoice",
          url: appUrl
        }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: appUrl },
          { "@type": "ListItem", position: 2, name: title, item: pageUrl }
        ]
      }
    ]
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function FaqJsonLd({ questions }: { questions: Array<{ question: string; answer: string }> }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer }
    }))
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
